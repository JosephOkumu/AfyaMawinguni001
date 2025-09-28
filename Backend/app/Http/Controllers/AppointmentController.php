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

        // Generate meeting link for virtual appointments
        if ($request->type === 'virtual') {
            $data['meeting_link'] = 'https://meet.afyamawinguni.com/' . uniqid();
        }

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

        // If changing to virtual type and no meeting link is set, generate one
        if ($request->has('type') && $request->type === 'virtual' && empty($request->meeting_link)) {
            $request->merge(['meeting_link' => 'https://meet.afyamawinguni.com/' . uniqid()]);
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
}
