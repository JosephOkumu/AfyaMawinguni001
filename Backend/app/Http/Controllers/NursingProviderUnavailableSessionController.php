<?php

namespace App\Http\Controllers;

use App\Models\NursingProviderUnavailableSession;
use App\Models\NursingProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class NursingProviderUnavailableSessionController extends Controller
{
    /**
     * Display a listing of unavailable sessions for the authenticated nursing provider.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $nursingProvider = NursingProvider::where('user_id', $user->id)->first();

        if (!$nursingProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nursing provider profile not found'
            ], 404);
        }

        try {
            Log::info('Fetching unavailable sessions for provider', ['provider_id' => $nursingProvider->id]);

            $sessions = NursingProviderUnavailableSession::where('nursing_provider_id', $nursingProvider->id)
                ->future()
                ->orderBy('date', 'asc')
                ->orderBy('start_time', 'asc')
                ->get();

            Log::info('Unavailable sessions fetched successfully', [
                'provider_id' => $nursingProvider->id,
                'sessions_count' => $sessions->count()
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $sessions
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch unavailable sessions', [
                'provider_id' => $nursingProvider->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch unavailable sessions'
            ], 500);
        }
    }

    /**
     * Store a newly created unavailable session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $nursingProvider = NursingProvider::where('user_id', $user->id)->first();

        if (!$nursingProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nursing provider profile not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'reason' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            Log::warning('Validation failed for unavailable session creation', [
                'provider_id' => $nursingProvider->id,
                'errors' => $validator->errors()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check for overlapping sessions
            $overlappingSessions = NursingProviderUnavailableSession::forProviderAndDate($nursingProvider->id, $request->date)
                ->where(function ($query) use ($request) {
                    $query->where(function ($q) use ($request) {
                        // New session starts during existing session
                        $q->where('start_time', '<', $request->end_time)
                          ->where('end_time', '>', $request->start_time);
                    });
                })
                ->exists();

            if ($overlappingSessions) {
                Log::warning('Overlapping unavailable session detected', [
                    'provider_id' => $nursingProvider->id,
                    'date' => $request->date,
                    'start_time' => $request->start_time,
                    'end_time' => $request->end_time
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'This time period overlaps with an existing unavailable session'
                ], 422);
            }

            // Check for existing appointments in this time slot
            $existingAppointments = DB::table('nursing_services')
                ->where('nursing_provider_id', $nursingProvider->id)
                ->whereDate('scheduled_datetime', $request->date)
                ->where('status', 'scheduled')
                ->where(function ($query) use ($request) {
                    $query->where(function ($q) use ($request) {
                        $q->whereTime('scheduled_datetime', '>=', $request->start_time)
                          ->whereTime('scheduled_datetime', '<', $request->end_time);
                    });
                })
                ->exists();

            if ($existingAppointments) {
                Log::warning('Existing appointments conflict with unavailable session', [
                    'provider_id' => $nursingProvider->id,
                    'date' => $request->date,
                    'start_time' => $request->start_time,
                    'end_time' => $request->end_time
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'You have existing appointments during this time period. Please reschedule or cancel them first.'
                ], 422);
            }

            $session = NursingProviderUnavailableSession::create([
                'nursing_provider_id' => $nursingProvider->id,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'reason' => $request->reason,
            ]);

            Log::info('Unavailable session created successfully', [
                'provider_id' => $nursingProvider->id,
                'session_id' => $session->id,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Unavailable session created successfully',
                'data' => $session
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to create unavailable session', [
                'provider_id' => $nursingProvider->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create unavailable session'
            ], 500);
        }
    }

    /**
     * Remove the specified unavailable session.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $nursingProvider = NursingProvider::where('user_id', $user->id)->first();

        if (!$nursingProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nursing provider profile not found'
            ], 404);
        }

        try {
            $session = NursingProviderUnavailableSession::where('id', $id)
                ->where('nursing_provider_id', $nursingProvider->id)
                ->first();

            if (!$session) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unavailable session not found'
                ], 404);
            }

            Log::info('Deleting unavailable session', [
                'provider_id' => $nursingProvider->id,
                'session_id' => $session->id,
                'date' => $session->date
            ]);

            $session->delete();

            Log::info('Unavailable session deleted successfully', [
                'provider_id' => $nursingProvider->id,
                'session_id' => $id
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Unavailable session deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to delete unavailable session', [
                'provider_id' => $nursingProvider->id,
                'session_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete unavailable session'
            ], 500);
        }
    }

    /**
     * Get unavailable sessions for a specific provider (public route for patient booking).
     *
     * @param  int  $providerId
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByProvider($providerId, Request $request)
    {
        $nursingProvider = NursingProvider::find($providerId);

        if (!$nursingProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nursing provider not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'nullable|date',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            Log::info('Fetching unavailable sessions for provider (public)', [
                'provider_id' => $providerId,
                'date' => $request->date,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date
            ]);

            $query = NursingProviderUnavailableSession::where('nursing_provider_id', $providerId)
                ->future();

            if ($request->date) {
                $query->where('date', $request->date);
            } elseif ($request->start_date && $request->end_date) {
                $query->whereBetween('date', [$request->start_date, $request->end_date]);
            }

            $sessions = $query->orderBy('date', 'asc')
                ->orderBy('start_time', 'asc')
                ->get();

            Log::info('Unavailable sessions fetched successfully (public)', [
                'provider_id' => $providerId,
                'sessions_count' => $sessions->count()
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $sessions
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch unavailable sessions (public)', [
                'provider_id' => $providerId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch unavailable sessions'
            ], 500);
        }
    }
}
