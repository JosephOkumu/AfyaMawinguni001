<?php

namespace App\Http\Controllers;

use App\Models\NursingProvider;
use App\Models\NursingProviderUnavailableSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NursingProviderController extends Controller
{
    /**
     * Display a listing of the nursing providers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $nursingProviders = NursingProvider::with(['user', 'nursingServiceOfferings'])->get();

        return response()->json([
            'status' => 'success',
            'data' => $nursingProviders
        ]);
    }

    /**
     * Store a newly created nursing provider in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'provider_name' => 'required|string|max:255',
            'description' => 'required|string',
            'license_number' => 'required|string|unique:nursing_providers,license_number',
            'qualifications' => 'required|string',
            'services_offered' => 'required|json',
            'service_areas' => 'nullable|json',
            'logo' => 'nullable|string',
            'base_rate_per_hour' => 'required|numeric|min:0',
            'is_available' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $nursingProvider = NursingProvider::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Nursing provider created successfully',
            'data' => $nursingProvider
        ], 201);
    }

    /**
     * Display the specified nursing provider.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $nursingProvider = NursingProvider::with(['user', 'nursingServiceOfferings'])->find($id);

        if (!$nursingProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nursing provider not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $nursingProvider
        ]);
    }

    /**
     * Update the specified nursing provider in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'exists:users,id',
            'provider_name' => 'string|max:255',
            'description' => 'string',
            'license_number' => 'string|unique:nursing_providers,license_number,'.$id,
            'qualifications' => 'string',
            'services_offered' => 'json',
            'service_areas' => 'nullable|json',
            'logo' => 'nullable|string',
            'base_rate_per_hour' => 'numeric|min:0',
            'is_available' => 'boolean',
            'average_rating' => 'integer|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $nursingProvider = NursingProvider::find($id);

        if (!$nursingProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nursing provider not found'
            ], 404);
        }

        $nursingProvider->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Nursing provider updated successfully',
            'data' => $nursingProvider
        ]);
    }

    /**
     * Remove the specified nursing provider from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $nursingProvider = NursingProvider::find($id);

        if (!$nursingProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nursing provider not found'
            ], 404);
        }

        $nursingProvider->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Nursing provider deleted successfully'
        ]);
    }

    /**
     * Get the current nursing provider's profile.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not authenticated'
            ], 401);
        }

        $nursingProvider = NursingProvider::with('user')->where('user_id', $user->id)->first();

        if (!$nursingProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nursing provider profile not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $nursingProvider
        ]);
    }

    /**
     * Update the current nursing provider's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not authenticated'
            ], 401);
        }

        $nursingProvider = NursingProvider::where('user_id', $user->id)->first();

        $isCreating = !$nursingProvider;

        $validationRules = [
            'name' => 'string|max:255',
            'provider_name' => 'string|max:255',
            'description' => 'string',
            'location' => 'string|max:255',
            'availability' => 'string|max:255',
            'experience' => 'string',
            'qualifications' => 'string',
            'services_offered' => 'string',
            'base_rate_per_hour' => 'numeric|min:0',
            'phone_number' => 'string|max:20',
            'email' => 'email|max:255',
        ];

        // If creating, make certain fields required
        if ($isCreating) {
            $validationRules['provider_name'] = 'required|string|max:255';
            $validationRules['description'] = 'required|string';
            $validationRules['base_rate_per_hour'] = 'required|numeric|min:0';
        }

        $validator = Validator::make($request->all(), $validationRules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update user data if provided
        $userData = [];
        if ($request->has('name')) {
            $userData['name'] = $request->name;
        }
        if ($request->has('phone_number')) {
            $userData['phone_number'] = $request->phone_number;
        }
        if ($request->has('email')) {
            $userData['email'] = $request->email;
        }

        if (!empty($userData)) {
            $user->update($userData);
        }

        // Update nursing provider data
        $providerData = [];
        if ($request->has('provider_name')) {
            $providerData['provider_name'] = $request->provider_name;
        }
        if ($request->has('description')) {
            $providerData['description'] = $request->description;
        }
        if ($request->has('location')) {
            $providerData['location'] = $request->location;
        }
        if ($request->has('qualifications')) {
            $providerData['qualifications'] = $request->qualifications;
        }
        if ($request->has('services_offered')) {
            $providerData['services_offered'] = $request->services_offered;
        }
        if ($request->has('base_rate_per_hour')) {
            $providerData['base_rate_per_hour'] = $request->base_rate_per_hour;
        }
        if ($request->has('availability_schedule')) {
            $providerData['availability_schedule'] = $request->availability_schedule;
        }
        if ($request->has('appointment_duration_minutes')) {
            $providerData['appointment_duration_minutes'] = $request->appointment_duration_minutes;
        }
        if ($request->has('repeat_weekly')) {
            $providerData['repeat_weekly'] = $request->repeat_weekly;
        }

        if ($isCreating) {
            // Create new nursing provider profile
            $providerData['user_id'] = $user->id;
            $providerData['license_number'] = $providerData['license_number'] ?? 'NP_' . time();
            $providerData['provider_name'] = $providerData['provider_name'] ?? $request->name ?? 'Nursing Provider';
            $providerData['description'] = $providerData['description'] ?? 'Professional nursing services';
            $providerData['base_rate_per_hour'] = $providerData['base_rate_per_hour'] ?? 1000;
            $providerData['qualifications'] = $providerData['qualifications'] ?? 'Professional nursing qualifications';
            $providerData['services_offered'] = $providerData['services_offered'] ?? 'Home nursing services';

            $nursingProvider = NursingProvider::create($providerData);
        } else {
            // Update existing profile
            if (!empty($providerData)) {
                $nursingProvider->update($providerData);
            }
        }

        // Reload with relationships
        $nursingProvider = $nursingProvider->fresh('user');

        return response()->json([
            'status' => 'success',
            'message' => $isCreating ? 'Profile created successfully' : 'Profile updated successfully',
            'data' => $nursingProvider
        ]);
    }

    /**
     * Upload profile image for the current nursing provider.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadProfileImage(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not authenticated'
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
            'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Delete old image if exists
            if ($nursingProvider->logo) {
                $oldImagePath = str_replace(url('storage/'), '', $nursingProvider->logo);
                if (Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }

            // Store new image
            $image = $request->file('profile_image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('nursing_providers/profiles', $imageName, 'public');
            $imageUrl = url('storage/' . $imagePath);

            // Update nursing provider record
            $nursingProvider->update(['logo' => $imageUrl]);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile image updated successfully',
                'data' => [
                    'profile_image' => $imageUrl
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to upload image: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get occupied dates for a specific nursing provider
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOccupiedDates($id)
    {
        $nursingProvider = NursingProvider::find($id);

        if (!$nursingProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nursing provider not found'
            ], 404);
        }

        try {
            // Log the request for debugging
            Log::info('Fetching occupied dates for nursing provider', ['provider_id' => $id]);

            // Define all available time slots for nursing services
            $allTimeSlots = [
                '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
                '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
                '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
                '4:00 PM', '4:30 PM'
            ];
            $totalSlots = count($allTimeSlots);

            // Get dates where ALL time slots are booked
            // Only include paid appointments to mark dates as fully occupied
            $occupiedDates = DB::table('nursing_services')
                ->where('nursing_provider_id', $id)
                ->whereIn('status', ['scheduled', 'in_progress'])
                ->where('is_paid', true)
                ->whereDate('scheduled_datetime', '>=', now()->toDateString())
                ->select(DB::raw('DATE(scheduled_datetime) as date'))
                ->groupBy(DB::raw('DATE(scheduled_datetime)'))
                ->havingRaw('COUNT(*) >= ?', [$totalSlots])
                ->pluck('date')
                ->toArray();

            Log::info('Occupied dates fetched successfully', [
                'provider_id' => $id,
                'dates_count' => count($occupiedDates)
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $occupiedDates
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch occupied dates for nursing provider', [
                'provider_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch occupied dates: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get occupied time slots for a specific nursing provider on a specific date
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOccupiedTimes($id, Request $request)
    {
        $nursingProvider = NursingProvider::find($id);

        if (!$nursingProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nursing provider not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $date = $request->get('date');

            Log::info('Fetching occupied times for nursing provider', [
                'provider_id' => $id,
                'date' => $date
            ]);

            // Get all scheduled nursing services for this provider on the specified date
            // Only include paid appointments to mark time slots as occupied
            $occupiedTimes = DB::table('nursing_services')
                ->where('nursing_provider_id', $id)
                ->whereIn('status', ['scheduled', 'in_progress'])
                ->where('is_paid', true)
                ->whereDate('scheduled_datetime', $date)
                ->select(DB::raw('TIME_FORMAT(scheduled_datetime, "%h:%i %p") as time'))
                ->pluck('time')
                ->toArray();

            // Get unavailable sessions for this date and convert to occupied time slots
            $unavailableSessions = NursingProviderUnavailableSession::forProviderAndDate($id, $date)->get();
            $unavailableTimes = [];

            Log::info('Processing unavailable sessions for occupied times', [
                'provider_id' => $id,
                'date' => $date,
                'unavailable_sessions_count' => $unavailableSessions->count()
            ]);

            foreach ($unavailableSessions as $session) {
                // Generate time slots that fall within the unavailable session
                $sessionStart = strtotime($session->start_time);
                $sessionEnd = strtotime($session->end_time);
                $appointmentDuration = $nursingProvider->appointment_duration_minutes ?? 30;

                $current = $sessionStart;
                while ($current < $sessionEnd) {
                    $timeSlot = date('g:i A', $current);
                    $unavailableTimes[] = $timeSlot;
                    $current = strtotime('+' . $appointmentDuration . ' minutes', $current);
                }
            }

            // Only return booked appointment times, not unavailable sessions
            // Unavailable sessions are handled separately in the frontend
            sort($occupiedTimes);

            Log::info('Occupied times fetched successfully', [
                'provider_id' => $id,
                'date' => $date,
                'appointment_times_count' => count($occupiedTimes),
                'unavailable_times_count' => count($unavailableTimes),
                'note' => 'Only returning booked appointments, not unavailable sessions'
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $occupiedTimes, // Only booked appointments (RED)
                'debug' => [
                    'appointment_occupied' => $occupiedTimes,
                    'unavailable_occupied' => $unavailableTimes,
                    'unavailable_sessions' => $unavailableSessions->toArray()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch occupied times for nursing provider', [
                'provider_id' => $id,
                'date' => $date,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch occupied times: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update availability settings for the current nursing provider.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateAvailabilitySettings(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not authenticated'
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
            'availability_schedule' => 'nullable|array',
            'appointment_duration_minutes' => 'nullable|integer|min:15|max:480',
            'repeat_weekly' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = [];

            if ($request->has('availability_schedule')) {
                $updateData['availability_schedule'] = $request->availability_schedule;
                Log::info('Updating availability schedule', [
                    'provider_id' => $nursingProvider->id,
                    'schedule' => $request->availability_schedule
                ]);
            }

            if ($request->has('appointment_duration_minutes')) {
                $updateData['appointment_duration_minutes'] = $request->appointment_duration_minutes;
                Log::info('Updating appointment duration', [
                    'provider_id' => $nursingProvider->id,
                    'duration_minutes' => $request->appointment_duration_minutes
                ]);
            }

            if ($request->has('repeat_weekly')) {
                $updateData['repeat_weekly'] = $request->repeat_weekly;
                Log::info('Updating repeat weekly setting', [
                    'provider_id' => $nursingProvider->id,
                    'repeat_weekly' => $request->repeat_weekly
                ]);
            }

            if (!empty($updateData)) {
                $nursingProvider->update($updateData);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Availability settings updated successfully',
                'data' => [
                    'availability_schedule' => $nursingProvider->availability_schedule,
                    'appointment_duration_minutes' => $nursingProvider->appointment_duration_minutes,
                    'repeat_weekly' => $nursingProvider->repeat_weekly,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update availability settings', [
                'provider_id' => $nursingProvider->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update availability settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available time slots for a specific nursing provider on a specific date
     * based on their availability settings and appointment duration.
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAvailableTimeSlots($id, Request $request)
    {
        $nursingProvider = NursingProvider::find($id);

        if (!$nursingProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nursing provider not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $date = $request->get('date');
            $dayOfWeek = strtolower(substr(date('l', strtotime($date)), 0, 3));

            // Debug day-of-week calculation
            $fullDayName = date('l', strtotime($date));
            $timestamp = strtotime($date);
            $carbonDate = \Carbon\Carbon::parse($date);
            $carbonDayOfWeek = strtolower(substr($carbonDate->format('l'), 0, 3));

            Log::info('Generating available time slots', [
                'provider_id' => $id,
                'date' => $date,
                'day_of_week' => $dayOfWeek,
                'full_day_name' => $fullDayName,
                'timestamp' => $timestamp,
                'carbon_day_of_week' => $carbonDayOfWeek,
                'appointment_duration' => $nursingProvider->appointment_duration_minutes,
                'debug_note' => 'Checking day-of-week calculation consistency'
            ]);

            // Get provider's availability schedule
            $availabilitySchedule = $nursingProvider->availability_schedule;
            $appointmentDuration = $nursingProvider->appointment_duration_minutes ?? 30;

            Log::info('Dumping availability schedule for debugging', [
                'provider_id' => $id,
                'availability_schedule' => $availabilitySchedule
            ]);

            $availableSlots = [];

            if ($availabilitySchedule && array_key_exists($dayOfWeek, $availabilitySchedule)) {
                // Use custom availability schedule
                $daySchedule = $availabilitySchedule[$dayOfWeek];

                Log::info('Processing day schedule', [
                    'provider_id' => $id,
                    'day_of_week' => $dayOfWeek,
                    'day_schedule' => $daySchedule
                ]);

                if ($daySchedule['available']) {
                    $startTime = $daySchedule['start_time'];
                    $endTime = $daySchedule['end_time'];

                    // Generate time slots based on appointment duration
                    $availableSlots = $this->generateTimeSlots($startTime, $endTime, $appointmentDuration);
                }
            }

            // Get occupied time slots from appointments
            $occupiedTimes = DB::table('nursing_services')
                ->where('nursing_provider_id', $id)
                ->whereIn('status', ['scheduled', 'in_progress'])
                ->where('is_paid', true)
                ->whereDate('scheduled_datetime', $date)
                ->select(DB::raw('TIME_FORMAT(scheduled_datetime, "%h:%i %p") as time'))
                ->pluck('time')
                ->toArray();

            // The frontend sends a date with a +1 day offset for availability checks.
            // We now use this date directly to fetch unavailability, aligning both checks.
            $unavailableSessions = NursingProviderUnavailableSession::forProviderAndDate($id, $date)->get();
            $unavailableTimes = [];

            Log::info('Processing unavailable sessions for available slots', [
                'provider_id' => $id,
                'date_for_unavailable_check' => $date,
                'unavailable_sessions_count' => $unavailableSessions->count(),
                'note' => 'Using the date directly as received from the frontend for unavailability checks.'
            ]);

            foreach ($unavailableSessions as $session) {
                // Check which time slots overlap with the unavailable session
                foreach ($availableSlots as $slot) {
                    $slotTime = strtotime($slot);
                    $slotEndTime = $slotTime + ($appointmentDuration * 60);
                    $sessionStart = strtotime($session->start_time);
                    $sessionEnd = strtotime($session->end_time);

                    // If slot overlaps with unavailable session, mark it as unavailable
                    if ($slotTime < $sessionEnd && $slotEndTime > $sessionStart) {
                        $unavailableTimes[] = $slot;
                    }
                }
            }

            // Keep all time slots for display - don't remove any
            // Frontend will handle styling based on occupied_slots and unavailable_slots arrays
            $allTimeSlots = $availableSlots; // Keep original generated slots

            Log::info('Available time slots generated', [
                'provider_id' => $id,
                'date' => $date,
                'all_time_slots' => count($allTimeSlots),
                'appointment_occupied_slots' => count($occupiedTimes),
                'unavailable_slots' => count($unavailableTimes),
                'truly_available_slots' => count($allTimeSlots) - count($occupiedTimes) - count($unavailableTimes)
            ]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'available_slots' => $allTimeSlots, // All possible time slots
                    'appointment_duration_minutes' => $appointmentDuration,
                    'occupied_slots' => $occupiedTimes, // Booked appointments (red)
                    'unavailable_slots' => $unavailableTimes, // Unavailable sessions (gray)
                    'unavailable_sessions' => $unavailableSessions->toArray()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to generate available time slots', [
                'provider_id' => $id,
                'date' => $date,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate available time slots: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate time slots based on start time, end time, and duration
     *
     * @param  string  $startTime
     * @param  string  $endTime
     * @param  int  $durationMinutes
     * @return array
     */
    private function generateTimeSlots($startTime, $endTime, $durationMinutes)
    {
        $slots = [];
        $current = strtotime($startTime);
        $end = strtotime($endTime);

        // Calculate the last possible start time
        $last_start_time = $end - ($durationMinutes * 60);

        while ($current <= $last_start_time) {
            $slots[] = date('g:i A', $current);
            $current = strtotime('+' . $durationMinutes . ' minutes', $current);
        }

        return $slots;
    }
}
