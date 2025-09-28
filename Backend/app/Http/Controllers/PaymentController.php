<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Services\PesapalService;
use App\Models\NursingService;
use App\Models\Appointment;
use App\Models\LabAppointment;

class PaymentController extends Controller
{
    /**
     * Initiate Pesapal payment
     */
    public function initiatePesapalPayment(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:1',
                'email' => 'required|email',
                'phone_number' => 'required|string',
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'description' => 'required|string',
                'lab_provider_id' => 'required|integer',
                'patient_id' => 'required|integer',
                'payment_method' => 'sometimes|string|in:mpesa,card,all',
                'booking_data' => 'sometimes|array'
            ]);

            $pesapalService = new PesapalService();

            // Generate merchant reference
            $merchantReference = $pesapalService->generateMerchantReference(
                $request->lab_provider_id,
                $request->patient_id
            );

            // Step 1: Get access token (already done in submitOrder method)
            // Step 2: Register fresh IPN ID
            Log::info('Registering fresh IPN for payment');
            $ipnId = $pesapalService->getIPNId();
            Log::info('IPN registered', ['ipn_id' => $ipnId]);

            // Validate that we have a valid IPN ID before proceeding
            if (!$ipnId) {
                Log::error('Failed to get or register IPN ID');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment service configuration error. Please try again later.'
                ], 500);
            }

            $orderData = [
                'merchant_reference' => $merchantReference,
                'amount' => $request->amount,
                'description' => $request->description,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'address' => $request->address ?? '',
                'city' => $request->city ?? 'Nairobi',
                'state' => $request->state ?? 'Nairobi',
                'postal_code' => $request->postal_code ?? '00100',
                'zip_code' => $request->zip_code ?? '00100',
                'notification_id' => $ipnId
            ];

            // Step 3: Submit order and get redirect URL
            Log::info('Submitting order to Pesapal', ['merchant_reference' => $merchantReference]);
            $response = $pesapalService->submitOrder($orderData);

            Log::info('Pesapal order response', ['response' => $response]);

            if (isset($response['order_tracking_id']) && isset($response['redirect_url'])) {
                // Store payment data for tracking
                cache()->put('pesapal_payment_' . $merchantReference, [
                    'order_tracking_id' => $response['order_tracking_id'],
                    'merchant_reference' => $merchantReference,
                    'amount' => $request->amount,
                    'lab_provider_id' => $request->lab_provider_id,
                    'patient_id' => $request->patient_id,
                    'description' => $request->description,
                    'payment_method' => $request->payment_method ?? 'pesapal',
                    'initiated_at' => now()
                ], now()->addHours(24));

                // Store detailed booking data if provided
                if ($request->has('booking_data')) {
                    $bookingType = 'lab'; // Default
                    if (isset($request->booking_data['doctor_id'])) {
                        $bookingType = 'doctor';
                    } elseif (isset($request->booking_data['nursing_provider_id'])) {
                        $bookingType = 'nursing';
                    }

                    cache()->put($bookingType . '_booking_' . $merchantReference,
                        json_encode($request->booking_data),
                        now()->addDays(7)
                    );
                }

                Log::info('Pesapal payment initiated successfully', [
                    'merchant_reference' => $merchantReference,
                    'order_tracking_id' => $response['order_tracking_id'],
                    'amount' => $request->amount
                ]);

                return response()->json([
                    'status' => 'success',
                    'merchant_reference' => $merchantReference,
                    'order_tracking_id' => $response['order_tracking_id'],
                    'redirect_url' => $response['redirect_url']
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to initiate payment'
            ], 400);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Pesapal payment initiation failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Payment initiation failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle Pesapal IPN callback
     */
    public function handlePesapalIPN(Request $request): JsonResponse
    {
        try {
            $orderTrackingId = $request->get('OrderTrackingId');
            $orderMerchantReference = $request->get('OrderMerchantReference');

            Log::info('Pesapal IPN received', [
                'order_tracking_id' => $orderTrackingId,
                'merchant_reference' => $orderMerchantReference,
                'all_params' => $request->all()
            ]);

            if (!$orderTrackingId || !$orderMerchantReference) {
                Log::warning('Invalid Pesapal IPN data received');
                return response()->json(['message' => 'Invalid IPN data'], 400);
            }

            $pesapalService = new PesapalService();
            $transactionStatus = $pesapalService->getTransactionStatus($orderTrackingId);

            // Update payment status in cache
            $paymentData = cache()->get('pesapal_payment_' . $orderMerchantReference);
            if ($paymentData) {
                $currentStatus = $paymentData['status'] ?? 'UNKNOWN';
                $newStatus = $transactionStatus['payment_status_description'] ?? 'UNKNOWN';

                $paymentData['status'] = $newStatus;
                $paymentData['payment_method'] = $transactionStatus['payment_method'] ?? null;
                $paymentData['confirmation_code'] = $transactionStatus['confirmation_code'] ?? null;
                $paymentData['updated_at'] = now();

                cache()->put('pesapal_payment_' . $orderMerchantReference, $paymentData, now()->addDays(7));

                Log::info('Pesapal payment status updated', [
                    'merchant_reference' => $orderMerchantReference,
                    'old_status' => $currentStatus,
                    'new_status' => $newStatus,
                    'payment_method' => $paymentData['payment_method']
                ]);

                // Create appointment if payment is successful and not already created
                if (($newStatus === 'COMPLETED' || $newStatus === 'SUCCESS') && $currentStatus !== $newStatus) {
                    $this->createAppointmentFromPayment($paymentData, $orderMerchantReference);
                }
            }

            return response()->json(['message' => 'IPN processed successfully']);

        } catch (\Exception $e) {
            Log::error('Pesapal IPN processing failed', [
                'message' => $e->getMessage(),
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['message' => 'IPN processing failed'], 500);
        }
    }

    /**
     * Create appointment based on successful payment data
     */
    private function createAppointmentFromPayment($paymentData, $merchantReference)
        {
            try {
                // Get stored booking data from localStorage equivalent (cache)
                $bookingDataKeys = [
                    "doctor_booking_$merchantReference",
                    "nursing_booking_$merchantReference",
                    "lab_booking_$merchantReference"
                ];

                $bookingData = null;
                $appointmentType = null;

                foreach ($bookingDataKeys as $key) {
                    $data = cache()->get($key);
                    if ($data) {
                        $bookingData = json_decode($data, true);
                        if (strpos($key, 'doctor_') !== false) {
                            $appointmentType = 'doctor';
                        } elseif (strpos($key, 'nursing_') !== false) {
                            $appointmentType = 'nursing';
                        } elseif (strpos($key, 'lab_') !== false) {
                            $appointmentType = 'lab';
                        }
                        break;
                    }
                }

                if (!$bookingData || !$appointmentType) {
                    Log::warning('No booking data found for payment', [
                        'merchant_reference' => $merchantReference
                    ]);
                    return;
                }

                // Create appointment based on type
                switch ($appointmentType) {
                    case 'doctor':
                        $appointment = new Appointment();
                        $appointment->patient_id = $bookingData['patient_id'];
                        $appointment->doctor_id = $bookingData['doctor_id'];
                        $appointment->appointment_datetime = $bookingData['appointment_datetime'];
                        // Set appointment type based on consultation_type from booking data
                        $appointment->type = isset($bookingData['consultation_type']) && $bookingData['consultation_type'] === 'online' ? 'virtual' : 'in_person';
                        $appointment->reason_for_visit = 'Doctor consultation';
                        $appointment->fee = $bookingData['consultation_fee'];
                        $appointment->status = 'pending';
                        $appointment->save();

                        Log::info('Doctor appointment created', [
                            'appointment_id' => $appointment->id,
                            'merchant_reference' => $merchantReference
                        ]);
                        break;

                    case 'nursing':
                        $nursingService = new NursingService();
                        $nursingService->patient_id = $bookingData['patient_id'];
                        $nursingService->nursing_provider_id = $bookingData['nursing_provider_id'];
                        $nursingService->service_name = $bookingData['service_names'] ?? 'Home Nursing Service';
                        $nursingService->service_description = 'Home nursing services';
                        $nursingService->service_price = $bookingData['total_amount'];
                        $nursingService->start_date = $bookingData['appointment_datetime'];
                        $nursingService->end_date = $bookingData['end_datetime'] ?? $bookingData['appointment_datetime'];
                        $nursingService->patient_address = 'Address to be confirmed';
                        $nursingService->status = 'confirmed';
                        $nursingService->save();

                        Log::info('Nursing appointment created', [
                            'nursing_service_id' => $nursingService->id,
                            'merchant_reference' => $merchantReference
                        ]);
                        break;

                    case 'lab':
                        $labAppointment = new LabAppointment();
                        $labAppointment->patient_id = $bookingData['patient_id'];
                        $labAppointment->lab_provider_id = $bookingData['lab_provider_id'];
                        $labAppointment->appointment_datetime = $bookingData['appointment_datetime'];
                        $labAppointment->test_ids = json_encode($bookingData['test_ids']);
                        $labAppointment->total_amount = $bookingData['total_amount'];
                        $labAppointment->payment_reference = $merchantReference;
                        $labAppointment->status = 'confirmed';
                        $labAppointment->notes = 'Lab tests booked via Pesapal payment';
                        $labAppointment->save();

                        Log::info('Lab appointment created', [
                            'lab_appointment_id' => $labAppointment->id,
                            'merchant_reference' => $merchantReference
                        ]);
                        break;
                }

            } catch (\Exception $e) {
                Log::error('Failed to create appointment from payment', [
                    'merchant_reference' => $merchantReference,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

    /**
     * Get Pesapal payment status
     */
    public function getPesapalPaymentStatus($merchantReference): JsonResponse
    {
        try {
            // First check cached payment data
            $paymentData = cache()->get('pesapal_payment_' . $merchantReference);

            if (!$paymentData) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment not found'
                ], 404);
            }

            // If we have an order tracking ID, get fresh status from Pesapal
            if (isset($paymentData['order_tracking_id'])) {
                try {
                    $pesapalService = new PesapalService();
                    $transactionStatus = $pesapalService->getTransactionStatus($paymentData['order_tracking_id']);

                    $currentStatus = $transactionStatus['payment_status_description'] ?? 'UNKNOWN';

                    // Update cached data with fresh status
                    $paymentData['status'] = $currentStatus;
                    $paymentData['payment_method'] = $transactionStatus['payment_method'] ?? null;
                    $paymentData['confirmation_code'] = $transactionStatus['confirmation_code'] ?? null;
                    $paymentData['updated_at'] = now();

                    cache()->put('pesapal_payment_' . $merchantReference, $paymentData, now()->addDays(7));

                    Log::info('Pesapal payment status retrieved', [
                        'merchant_reference' => $merchantReference,
                        'status' => $currentStatus,
                        'order_tracking_id' => $paymentData['order_tracking_id']
                    ]);

                } catch (\Exception $e) {
                    Log::warning('Failed to get fresh status from Pesapal, using cached data', [
                        'merchant_reference' => $merchantReference,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            return response()->json([
                'status' => 'success',
                'payment_status' => $paymentData['status'] ?? 'PENDING',
                'merchant_reference' => $merchantReference,
                'order_tracking_id' => $paymentData['order_tracking_id'] ?? null,
                'amount' => $paymentData['amount'] ?? null,
                'payment_method' => $paymentData['payment_method'] ?? null,
                'confirmation_code' => $paymentData['confirmation_code'] ?? null
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get Pesapal payment status', [
                'merchant_reference' => $merchantReference,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to get payment status'
            ], 500);
        }
    }

    /**
     * Register IPN with Pesapal (Step 2)
     */
    public function registerPesapalIPN(): JsonResponse
    {
        try {
            $pesapalService = new PesapalService();

            Log::info('Registering IPN with Pesapal');

            $result = $pesapalService->registerIPN();

            return response()->json([
                'status' => 'success',
                'message' => 'IPN registered successfully',
                'ipn_id' => $result['ipn_id'] ?? null,
                'url' => $result['url'] ?? null
            ]);

        } catch (\Exception $e) {
            Log::error('Pesapal IPN registration failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'IPN registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Auth Token (Step 1)
     */
    public function getPesapalAuthToken(): JsonResponse
    {
        try {
            $pesapalService = new PesapalService();

            Log::info('Getting Pesapal auth token');

            $token = $pesapalService->getAccessToken();

            return response()->json([
                'status' => 'success',
                'message' => 'Token retrieved successfully',
                'token_preview' => substr($token, 0, 20) . '...'
            ]);

        } catch (\Exception $e) {
            Log::error('Pesapal auth token failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Auth token failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test Pesapal connection
     */
    public function testPesapalConnection(): JsonResponse
    {
        try {
            $pesapalService = new PesapalService();
            $result = $pesapalService->testConnection();

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Pesapal connection test failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Connection test failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Debug endpoint to test Pesapal integration step by step
     */
    public function debugPesapal(Request $request): JsonResponse
    {
        try {
            Log::info('Starting Pesapal debug test');

            $pesapalService = new PesapalService();
            $results = [];

            // Step 1: Test configuration
            $results['config'] = [
                'consumer_key' => config('pesapal.consumer_key') ? 'SET' : 'MISSING',
                'consumer_secret' => config('pesapal.consumer_secret') ? 'SET' : 'MISSING',
                'base_url' => config('pesapal.base_url'),
                'ipn_url' => config('pesapal.ipn_url'),
                'callback_url' => config('pesapal.callback_url'),
                'currency' => config('pesapal.currency')
            ];

            // Step 2: Test token generation
            try {
                $token = $pesapalService->getAccessToken();
                $results['token'] = [
                    'status' => 'SUCCESS',
                    'token_preview' => substr($token, 0, 20) . '...',
                    'token_length' => strlen($token)
                ];
            } catch (\Exception $e) {
                $results['token'] = [
                    'status' => 'FAILED',
                    'error' => $e->getMessage()
                ];
                return response()->json($results, 500);
            }

            // Step 3: Test IPN registration
            try {
                $ipnResponse = $pesapalService->registerIPN();
                $results['ipn'] = [
                    'status' => 'SUCCESS',
                    'ipn_id' => $ipnResponse['ipn_id'] ?? null,
                    'response' => $ipnResponse
                ];
            } catch (\Exception $e) {
                $results['ipn'] = [
                    'status' => 'FAILED',
                    'error' => $e->getMessage()
                ];
                return response()->json($results, 500);
            }

            // Step 4: Test order submission (with test data)
            if ($request->has('test_order')) {
                try {
                    $testOrderData = [
                        'merchant_reference' => 'TEST-' . time(),
                        'amount' => 100.00,
                        'description' => 'Test payment',
                        'email' => 'test@example.com',
                        'phone_number' => '+254722549387',
                        'first_name' => 'Test',
                        'last_name' => 'User',
                        'address' => 'Test Address',
                        'city' => 'Nairobi',
                        'state' => 'Nairobi',
                        'postal_code' => '00100',
                        'zip_code' => '00100',
                        'notification_id' => $results['ipn']['ipn_id']
                    ];

                    $orderResponse = $pesapalService->submitOrder($testOrderData);
                    $results['order'] = [
                        'status' => 'SUCCESS',
                        'order_tracking_id' => $orderResponse['order_tracking_id'] ?? null,
                        'redirect_url' => $orderResponse['redirect_url'] ?? null
                    ];
                } catch (\Exception $e) {
                    $results['order'] = [
                        'status' => 'FAILED',
                        'error' => $e->getMessage()
                    ];
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Pesapal debug completed',
                'results' => $results
            ]);

        } catch (\Exception $e) {
            Log::error('Pesapal debug failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Debug failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment status by order tracking ID (alternative to merchant reference)
     */
    public function getPesapalPaymentStatusByTrackingId(Request $request, $orderTrackingId): JsonResponse
    {
        try {
            Log::info('Getting payment status by tracking ID', ['order_tracking_id' => $orderTrackingId]);

            $pesapalService = new PesapalService();
            $transactionStatus = $pesapalService->getTransactionStatus($orderTrackingId);

            if (!$transactionStatus) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment not found'
                ], 404);
            }

            // Try to find merchant reference from cache
            $merchantReference = null;
            $paymentData = null;

            // Try to find the payment data in cache using a simple approach
            // Since we can't easily search all cache keys, we'll rely on the transaction status from Pesapal
            // and use that to get merchant reference if available in the response
            $merchantReference = $transactionStatus['merchant_reference'] ?? null;
            $paymentData = null;

            // If we have merchant reference from Pesapal, try to get cached payment data
            if ($merchantReference) {
                $paymentData = cache()->get('pesapal_payment_' . $merchantReference);
            }

            Log::info('Payment status retrieved by tracking ID', [
                'order_tracking_id' => $orderTrackingId,
                'merchant_reference' => $merchantReference,
                'payment_status' => $transactionStatus['payment_status_description'] ?? 'UNKNOWN'
            ]);

            return response()->json([
                'status' => 'success',
                'order_tracking_id' => $orderTrackingId,
                'merchant_reference' => $merchantReference,
                'payment_status' => $transactionStatus['payment_status_description'] ?? 'UNKNOWN',
                'amount' => $transactionStatus['amount'] ?? ($paymentData['amount'] ?? null),
                'currency' => $transactionStatus['currency'] ?? 'KES',
                'payment_method' => $transactionStatus['payment_method'] ?? null,
                'confirmation_code' => $transactionStatus['confirmation_code'] ?? null,
                'transaction_reference' => $transactionStatus['pesapal_transaction_id'] ?? null,
                'created_date' => $transactionStatus['created_date'] ?? null,
                'description' => $transactionStatus['description'] ?? ($paymentData['description'] ?? null)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get payment status by tracking ID', [
                'order_tracking_id' => $orderTrackingId,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Unable to retrieve payment status: ' . $e->getMessage()
            ], 500);
        }
    }
}
