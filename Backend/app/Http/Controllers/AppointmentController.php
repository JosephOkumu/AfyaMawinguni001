<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the appointments.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Allow filtering by patient_id or doctor_id
        $query = Appointment::query();

        // Check the route name to determine filtering context
        $routeName = $request->route()->getName();

        if ($routeName === 'doctor.appointments') {
            // For doctor appointments route, get doctor_id from authenticated user's doctor profile
            $user = Auth::user()->load('userType');
            if ($user && $user->userType && $user->userType->name === 'doctor') {
                $doctor = \App\Models\Doctor::where('user_id', $user->id)->first();
                if ($doctor) {
                    $query->where('doctor_id', $doctor->id);
                }
            }
        } elseif ($routeName === 'patient.appointments') {
            // For patient appointments route, filter by patient_id (user_id)
            $user = Auth::user()->load('userType');
            if ($user && $user->userType && $user->userType->name === 'patient') {
                $query->where('patient_id', $user->id);
            }
        }

        // Allow additional filtering via parameters
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->with(['patient', 'doctor.user'])->orderBy('appointment_datetime', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $appointments
        ]);
    }

    /**
     * Store a newly created appointment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:users,id',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_datetime' => 'required|date|after:now',
            'type' => 'required|in:in_person,virtual',
            'reason_for_visit' => 'nullable|string',
            'symptoms' => 'nullable|string',
            'fee' => 'required|numeric|min:0',
            'is_paid' => 'nullable|boolean',
            'payment_reference' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Set default values for remaining fields
        $data = $request->all();
        $data['status'] = 'pending';
        $data['is_paid'] = $request->input('is_paid', false);


        $appointment = Appointment::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Appointment created successfully',
            'data' => $appointment
        ], 201);
    }

    /**
     * Display the specified appointment.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $appointment = Appointment::with(['patient', 'doctor'])->find($id);

        if (!$appointment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Appointment not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $appointment
        ]);
    }

    /**
     * Update the specified appointment in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'exists:users,id',
            'doctor_id' => 'exists:doctors,id',
            'appointment_datetime' => 'date|after:now',
            'status' => 'in:pending,confirmed,scheduled,completed,cancelled,rescheduled,no_show',
            'type' => 'in:in_person,virtual',
            'reason_for_visit' => 'nullable|string',
            'symptoms' => 'nullable|string',
            'doctor_notes' => 'nullable|string',
            'prescription' => 'nullable|string',
            'meeting_link' => 'nullable|string',
            'fee' => 'numeric|min:0',
            'is_paid' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Appointment not found'
            ], 404);
        }


        $appointment->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Appointment updated successfully',
            'data' => $appointment
        ]);
    }

    /**
     * Remove the specified appointment from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Appointment not found'
            ], 404);
        }

        $appointment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Appointment deleted successfully'
        ]);
    }

    /**
     * Confirm an appointment (change status from pending to scheduled).
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function confirm($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Appointment not found'
            ], 404);
        }

        // Check if appointment can be confirmed
        if ($appointment->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only pending appointments can be confirmed'
            ], 422);
        }

        $appointment->status = 'scheduled';
        $appointment->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Appointment confirmed successfully',
            'data' => $appointment->load(['patient', 'doctor.user'])
        ]);
    }

    /**
     * Reject an appointment (change status from pending to cancelled).
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function reject($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Appointment not found'
            ], 404);
        }

        // Check if appointment can be rejected
        if ($appointment->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only pending appointments can be rejected'
            ], 422);
        }

        $appointment->status = 'cancelled';
        $appointment->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Appointment rejected successfully',
            'data' => $appointment->load(['patient', 'doctor.user'])
        ]);
    }

    /**
     * Complete an appointment (change status from scheduled to completed).
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function complete($id)
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Appointment not found'
            ], 404);
        }

        // Check if appointment can be completed
        if ($appointment->status !== 'scheduled') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only scheduled appointments can be completed'
            ], 422);
        }

        $appointment->status = 'completed';
        $appointment->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Appointment completed successfully',
            'data' => $appointment->load(['patient', 'doctor.user'])
        ]);
    }

    /**
     * Store WebRTC signaling data
     */
    public function signal(Request $request, $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        $user = Auth::user();
        
        // Store signal in cache for 5 minutes
        $cacheKey = "webrtc_signals_{$id}";
        $signals = cache()->get($cacheKey, []);
        
        // Store the entire signal data, preserving structure for different signal types
        $signalData = $request->all();
        $signalData['from'] = $user->id;
        $signalData['timestamp'] = now()->toISOString();
        
        $signals[] = $signalData;
        
        cache()->put($cacheKey, $signals, 300); // 5 minutes
        
        return response()->json([
            'status' => 'success',
            'debug' => [
                'signal_stored' => true,
                'total_signals_now' => count($signals),
                'cache_key' => $cacheKey,
                'from_user' => $user->id,
                'signal_type' => $request->input('type')
            ]
        ]);
    }

    /**
     * Get WebRTC signaling data
     */
    public function getSignals(Request $request, $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        $user = Auth::user();
        $cacheKey = "webrtc_signals_{$id}";
        $signals = cache()->get($cacheKey, []);
        
        // Return signals not from current user and not older than 2 minutes
        $cutoffTime = now()->subSeconds(120);
        $filteredSignals = array_filter($signals, function($signal) use ($user, $cutoffTime) {
            $signalTime = \Carbon\Carbon::parse($signal['timestamp']);
            return $signal['from'] != $user->id && $signalTime->gt($cutoffTime);
        });
        
        // Get call session status
        $callSession = $this->getCallSession($id);
        
        // Clear old signals to prevent accumulation
        $freshSignals = array_filter($signals, function($signal) use ($cutoffTime) {
            $signalTime = \Carbon\Carbon::parse($signal['timestamp']);
            return $signalTime->gt($cutoffTime);
        });
        cache()->put($cacheKey, $freshSignals, 300);
        
        return response()->json([
            'signals' => array_values($filteredSignals),
            'callSession' => $callSession,
            'signalsCount' => count($filteredSignals),
            'rawSignals' => array_values($filteredSignals),
            'debug' => [
                'total_signals' => count($signals),
                'filtered_signals' => count($filteredSignals),
                'current_user_id' => $user->id,
                'cutoff_time' => $cutoffTime->toISOString(),
                'all_signals_with_times' => array_map(function($signal) use ($cutoffTime) {
                    $signalTime = \Carbon\Carbon::parse($signal['timestamp']);
                    return [
                        'from' => $signal['from'],
                        'type' => $signal['type'],
                        'timestamp' => $signal['timestamp'],
                        'is_recent' => $signalTime->gt($cutoffTime),
                        'age_seconds' => now()->diffInSeconds($signalTime)
                    ];
                }, $signals)
            ]
        ]);
    }

    /**
     * Start a video call session
     */
    public function startCall(Request $request, $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        $user = Auth::user();
        $sessionKey = "call_session_{$id}";
        
        // Check if call already exists
        $existingSession = cache()->get($sessionKey);
        if ($existingSession) {
            return response()->json([
                'error' => 'Call already in progress',
                'callSession' => $existingSession
            ], 409);
        }

        // Create new call session
        $callSession = [
            'appointment_id' => $id,
            'caller_id' => $user->id,
            'caller_name' => $user->name,
            'status' => 'waiting_for_participant',
            'started_at' => now()->toISOString(),
            'participants' => [$user->id]
        ];

        cache()->put($sessionKey, $callSession, 1800); // 30 minutes

        return response()->json([
            'status' => 'success',
            'callSession' => $callSession
        ]);
    }

    /**
     * Join an existing video call session
     */
    public function joinCall(Request $request, $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        $user = Auth::user();
        $sessionKey = "call_session_{$id}";
        
        $callSession = cache()->get($sessionKey);
        if (!$callSession) {
            return response()->json(['error' => 'No active call session found'], 404);
        }

        // Add participant if not already in call
        if (!in_array($user->id, $callSession['participants'])) {
            $callSession['participants'][] = $user->id;
            $callSession['status'] = 'active';
            $callSession['joined_at'] = now()->toISOString();
            
            cache()->put($sessionKey, $callSession, 1800); // 30 minutes
        }

        return response()->json([
            'status' => 'success',
            'callSession' => $callSession
        ]);
    }

    /**
     * End a video call session
     */
    public function endCall(Request $request, $id)
    {
        $sessionKey = "call_session_{$id}";
        cache()->forget($sessionKey);
        
        // Also clear signals
        $signalsKey = "webrtc_signals_{$id}";
        cache()->forget($signalsKey);

        return response()->json(['status' => 'success']);
    }

    /**
     * Get call session status
     */
    public function getCallSession($appointmentId)
    {
        $sessionKey = "call_session_{$appointmentId}";
        return cache()->get($sessionKey);
    }
}
