<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Services\PesapalService;

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
                'patient_id' => 'required|integer'
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
                    'initiated_at' => now()
                ], now()->addHours(24));

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
                $paymentData['status'] = $transactionStatus['payment_status_description'] ?? 'UNKNOWN';
                $paymentData['payment_method'] = $transactionStatus['payment_method'] ?? null;
                $paymentData['confirmation_code'] = $transactionStatus['confirmation_code'] ?? null;
                $paymentData['updated_at'] = now();

                cache()->put('pesapal_payment_' . $orderMerchantReference, $paymentData, now()->addDays(7));

                Log::info('Pesapal payment status updated', [
                    'merchant_reference' => $orderMerchantReference,
                    'status' => $paymentData['status'],
                    'payment_method' => $paymentData['payment_method']
                ]);
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
}
