<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DoctorController extends Controller
{
    /**
     * Display a listing of the doctors.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $doctors = Doctor::with('user')->get();

        return response()->json([
            'status' => 'success',
            'data' => $doctors
        ]);
    }

    /**
     * Store a newly created doctor in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'specialty' => 'required|string|max:255',
            'license_number' => 'required|string|unique:doctors,license_number',
            'experience' => 'nullable|string',
            'consultation_fee' => 'required|numeric|min:0',
            'availability' => 'nullable|json',
            'is_available_for_consultation' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $doctor = Doctor::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Doctor created successfully',
            'data' => $doctor
        ], 201);
    }

    /**
     * Display the specified doctor.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $doctor = Doctor::with('user')->find($id);

        if (!$doctor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doctor not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $doctor
        ]);
    }

    /**
     * Update the specified doctor in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'exists:users,id',
            'specialty' => 'string|max:255',
            'license_number' => 'string|unique:doctors,license_number,'.$id,
            'experience' => 'nullable|string',
            'consultation_fee' => 'numeric|min:0',
            'availability' => 'nullable|json',
            'is_available_for_consultation' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doctor not found'
            ], 404);
        }

        $doctor->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Doctor updated successfully',
            'data' => $doctor
        ]);
    }

    /**
     * Debug method to test authentication and user info
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function debug()
    {
        $user = Auth::user();

        return response()->json([
            'authenticated' => !!$user,
            'user' => $user,
            'doctors_count' => Doctor::count(),
            'user_doctor' => $user ? Doctor::where('user_id', $user->id)->first() : null
        ]);
    }

    /**
     * Get the current authenticated doctor's profile
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 401);
        }

        $doctor = Doctor::where('user_id', $user->id)->with('user')->first();

        if (!$doctor) {
            // Create a default doctor profile if none exists
            $doctor = Doctor::create([
                'user_id' => $user->id,
                'specialty' => 'General Practitioner',
                'license_number' => 'DOC-' . $user->id . '-' . date('Y'),
                'consultation_fee' => 2500.00,
                'is_available_for_consultation' => true,
                'average_rating' => 0
            ]);
            $doctor->load('user');
        }

        return response()->json([
            'status' => 'success',
            'data' => $doctor
        ]);
    }

    /**
     * Update the current authenticated doctor's profile
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
                'message' => 'Unauthorized'
            ], 401);
        }

        $doctor = Doctor::where('user_id', $user->id)->first();

        if (!$doctor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doctor profile not found'
            ], 404);
        }

        // Debug request data
        Log::info('Doctor Profile Update Request:', [
            'request_data' => $request->all(),
            'user_id' => $user->id,
            'doctor_id' => $doctor->id
        ]);

        // More permissive validation rules
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:500',
            'specialty' => 'nullable|string|max:500',
            'description' => 'nullable|string|max:5000',
            'hospital' => 'nullable|string|max:500',
            'location' => 'nullable|string|max:500',
            'availability' => 'nullable|string|max:1000',
            'experience' => 'nullable', // Accept both string and numeric
            'physicalPrice' => 'nullable|numeric|min:0|max:999999',
            'onlinePrice' => 'nullable|numeric|min:0|max:999999',
            'languages' => 'nullable|string|max:500',
            'acceptsInsurance' => 'nullable|boolean',
            'consultationModes' => 'nullable|array|max:20',
            'consultationModes.*' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            Log::error('Doctor Profile Validation Failed:', [
                'errors' => $validator->errors()->toArray(),
                'request_data' => $request->all(),
                'request_types' => array_map('gettype', $request->all())
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'debug_request_data' => $request->all(),
                'debug_request_types' => array_map('gettype', $request->all())
            ], 422);
        }

        // Map form fields to database fields
        $updateData = [];

        if ($request->has('specialty')) {
            $updateData['specialty'] = $request->specialty;
        }
        if ($request->has('description')) {
            $updateData['description'] = $request->description;
            $updateData['professional_summary'] = $request->description;
            $updateData['bio'] = $request->description;
        }
        if ($request->has('hospital')) {
            $updateData['hospital'] = $request->hospital;
        }
        if ($request->has('location')) {
            $updateData['location'] = $request->location;
        }
        if ($request->has('availability')) {
            $updateData['availability'] = $request->availability;
        }
        if ($request->has('experience')) {
            $experienceValue = is_numeric($request->experience) ? (string)$request->experience : $request->experience;
            $updateData['experience'] = $experienceValue;
            $updateData['years_of_experience'] = $experienceValue;
        }
        if ($request->has('physicalPrice')) {
            $updateData['physical_consultation_fee'] = $request->physicalPrice;
            $updateData['consultation_fee'] = $request->physicalPrice;
        }
        if ($request->has('onlinePrice')) {
            $updateData['online_consultation_fee'] = $request->onlinePrice;
        }
        if ($request->has('languages')) {
            $updateData['languages'] = $request->languages;
        }
        if ($request->has('acceptsInsurance')) {
            $updateData['accepts_insurance'] = $request->acceptsInsurance;
        }
        if ($request->has('consultationModes')) {
            $updateData['consultation_modes'] = json_encode($request->consultationModes);
        }

        // Update user name if provided
        if ($request->has('name')) {
            try {
                $user->update(['name' => $request->name]);
            } catch (\Exception $e) {
                Log::error('Failed to update user name:', [
                    'error' => $e->getMessage(),
                    'user_id' => $user->id
                ]);
            }
        }

        try {
            $doctor->update($updateData);

            Log::info('Doctor Profile Updated Successfully:', [
                'doctor_id' => $doctor->id,
                'updated_fields' => array_keys($updateData)
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'data' => $doctor->load('user')
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update doctor profile:', [
                'error' => $e->getMessage(),
                'doctor_id' => $doctor->id,
                'update_data' => $updateData
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload profile image for the authenticated doctor
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
                'message' => 'Unauthorized'
            ], 401);
        }

        $doctor = Doctor::where('user_id', $user->id)->first();

        if (!$doctor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doctor profile not found'
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
            $image = $request->file('profile_image');
            $imageName = 'doctor_' . $doctor->id . '_' . time() . '.' . $image->getClientOriginalExtension();

            // Store in public/storage/doctor_images directory
            $imagePath = $image->storeAs('doctor_images', $imageName, 'public');

            // Get the full URL
            $imageUrl = url('storage/' . $imagePath);

            // Update doctor profile
            $doctor->update(['profile_image' => $imageUrl]);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile image uploaded successfully',
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
     * Get occupied dates for a specific doctor
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOccupiedDates($id)
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doctor not found'
            ], 404);
        }

        try {
            // Define all available time slots for doctors
            $allTimeSlots = [
                '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
                '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
                '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
                '4:00 PM', '4:30 PM'
            ];
            $totalSlots = count($allTimeSlots);

            // Get dates where ALL time slots are booked
            // Only include paid appointments to mark dates as fully occupied
            $occupiedDates = DB::table('appointments')
                ->where('doctor_id', $id)
                ->where('status', 'confirmed')
                ->where('is_paid', true)
                ->whereDate('appointment_datetime', '>=', now()->toDateString())
                ->select(DB::raw('DATE(appointment_datetime) as date'))
                ->groupBy(DB::raw('DATE(appointment_datetime)'))
                ->havingRaw('COUNT(*) >= ?', [$totalSlots])
                ->pluck('date')
                ->toArray();

            return response()->json([
                'status' => 'success',
                'data' => $occupiedDates
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch occupied dates: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get occupied time slots for a specific doctor on a specific date
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOccupiedTimes($id, Request $request)
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doctor not found'
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

            // Get all confirmed and paid appointments for this doctor on the specified date
            $occupiedTimes = DB::table('appointments')
                ->where('doctor_id', $id)
                ->where('status', 'confirmed')
                ->where('is_paid', true)
                ->whereDate('appointment_datetime', $date)
                ->select(DB::raw('TIME_FORMAT(appointment_datetime, "%h:%i %p") as time'))
                ->pluck('time')
                ->toArray();

            return response()->json([
                'status' => 'success',
                'data' => $occupiedTimes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch occupied times: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update availability settings for the authenticated doctor
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
                'message' => 'Unauthorized'
            ], 401);
        }

        $doctor = Doctor::where('user_id', $user->id)->first();

        if (!$doctor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doctor profile not found'
            ], 404);
        }

        // Validate the request
        $validator = Validator::make($request->all(), [
            'availability_schedule' => 'required|json',
            'appointment_duration_minutes' => 'required|integer|min:15|max:480',
            'repeat_weekly' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Parse and validate the availability schedule
            $schedule = json_decode($request->availability_schedule, true);
            
            if (!$schedule) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid availability schedule format'
                ], 422);
            }

            // Validate schedule structure
            $validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            foreach ($schedule as $day => $daySchedule) {
                if (!in_array($day, $validDays)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => "Invalid day: $day"
                    ], 422);
                }

                if (isset($daySchedule['available']) && $daySchedule['available']) {
                    if (!isset($daySchedule['start_time']) || !isset($daySchedule['end_time'])) {
                        return response()->json([
                            'status' => 'error',
                            'message' => "Missing start_time or end_time for $day"
                        ], 422);
                    }
                }
            }

            // Update the doctor's availability settings
            $updateData = [
                'availability_schedule' => $request->availability_schedule,
                'appointment_duration_minutes' => $request->appointment_duration_minutes,
                'repeat_weekly' => $request->repeat_weekly
            ];

            $doctor->update($updateData);

            Log::info('Doctor availability settings updated:', [
                'doctor_id' => $doctor->id,
                'user_id' => $user->id,
                'schedule' => $schedule,
                'duration' => $request->appointment_duration_minutes,
                'repeat_weekly' => $request->repeat_weekly
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Availability settings updated successfully',
                'data' => [
                    'availability_schedule' => $doctor->availability_schedule,
                    'appointment_duration_minutes' => $doctor->appointment_duration_minutes,
                    'repeat_weekly' => $doctor->repeat_weekly,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update doctor availability settings:', [
                'error' => $e->getMessage(),
                'doctor_id' => $doctor->id,
                'request_data' => $request->all()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update availability settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available time slots for a specific doctor on a specific date
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAvailableTimeSlots($id, Request $request)
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doctor not found'
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
            $dateObj = new \DateTime($date);
            $dayOfWeek = strtolower($dateObj->format('D')); // mon, tue, wed, etc.

            Log::info('Doctor availability data:', [
                'doctor_id' => $id,
                'date' => $date,
                'day_of_week' => $dayOfWeek,
                'availability_schedule' => $doctor->availability_schedule,
                'appointment_duration_minutes' => $doctor->appointment_duration_minutes
            ]);

            // Check if doctor has custom availability schedule
            if ($doctor->availability_schedule) {
                // Parse the JSON string if it's still a string
                $schedule = is_string($doctor->availability_schedule) 
                    ? json_decode($doctor->availability_schedule, true) 
                    : $doctor->availability_schedule;
                
                Log::info('Parsed availability schedule:', [
                    'doctor_id' => $id,
                    'raw_schedule' => $doctor->availability_schedule,
                    'parsed_schedule' => $schedule,
                    'looking_for_day' => $dayOfWeek
                ]);
                
                if ($schedule && isset($schedule[$dayOfWeek])) {
                    $daySchedule = $schedule[$dayOfWeek];
                    
                    // Check if doctor is available on this day
                    if (!isset($daySchedule['available']) || !$daySchedule['available']) {
                        Log::info('Doctor not available on this day:', [
                            'doctor_id' => $id,
                            'day' => $dayOfWeek,
                            'day_schedule' => $daySchedule
                        ]);
                        
                        return response()->json([
                            'status' => 'success',
                            'data' => []
                        ]);
                    }

                    // Generate custom timeslots based on doctor's schedule
                    $startTime = $daySchedule['start_time'];
                    $endTime = $daySchedule['end_time'];
                    $duration = $doctor->appointment_duration_minutes ?: 30;

                    Log::info('Using custom availability schedule:', [
                        'doctor_id' => $id,
                        'day' => $dayOfWeek,
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'duration' => $duration
                    ]);

                    $timeSlots = $this->generateCustomTimeSlots($startTime, $endTime, $duration);
                    
                    Log::info('Generated custom timeslots:', [
                        'doctor_id' => $id,
                        'timeslots' => $timeSlots
                    ]);
                } else {
                    // Fallback to default schedule if day not found in custom schedule
                    Log::info('Day not found in custom schedule, using default:', [
                        'doctor_id' => $id,
                        'day' => $dayOfWeek,
                        'schedule' => $schedule
                    ]);
                    
                    $timeSlots = $this->getDefaultTimeSlots();
                }
            } else {
                // Use default time slots if no custom schedule
                Log::info('No custom schedule found, using default timeslots:', [
                    'doctor_id' => $id
                ]);
                
                $timeSlots = $this->getDefaultTimeSlots();
            }

            // Get booked appointments for this date
            $bookedTimes = DB::table('appointments')
                ->where('doctor_id', $id)
                ->where('status', 'confirmed')
                ->where('is_paid', true)
                ->whereDate('appointment_datetime', $date)
                ->select(DB::raw('TIME_FORMAT(appointment_datetime, "%h:%i %p") as time'))
                ->pluck('time')
                ->toArray();

            // Get unavailable sessions for this date
            $unavailableTimes = DB::table('unavailable_sessions')
                ->where('doctor_id', $id)
                ->whereDate('date', $date)
                ->get()
                ->map(function ($session) {
                    // Convert start and end times to generate all affected slots
                    $startTime = \DateTime::createFromFormat('H:i:s', $session->start_time);
                    $endTime = \DateTime::createFromFormat('H:i:s', $session->end_time);
                    
                    $affectedSlots = [];
                    $current = clone $startTime;
                    
                    while ($current < $endTime) {
                        $affectedSlots[] = $current->format('g:i A');
                        $current->add(new \DateInterval('PT30M')); // Add 30 minutes
                    }
                    
                    return $affectedSlots;
                })
                ->flatten()
                ->toArray();

            // Mark slots as booked or unavailable
            $availableSlots = array_map(function ($slot) use ($bookedTimes, $unavailableTimes) {
                $isBooked = in_array($slot, $bookedTimes);
                $isUnavailable = in_array($slot, $unavailableTimes);
                
                return [
                    'time' => $slot,
                    'available' => !$isBooked && !$isUnavailable,
                    'status' => $isBooked ? 'booked' : ($isUnavailable ? 'unavailable' : 'available')
                ];
            }, $timeSlots);

            // Include appointment duration in response
            $appointmentDuration = $doctor->appointment_duration_minutes ?: 30;

            return response()->json([
                'status' => 'success',
                'data' => $availableSlots,
                'appointment_duration_minutes' => $appointmentDuration
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch available time slots for doctor:', [
                'error' => $e->getMessage(),
                'doctor_id' => $id,
                'date' => $request->get('date')
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch available time slots: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate custom time slots based on start and end time
     *
     * @param  string  $startTime
     * @param  string  $endTime
     * @param  int  $durationMinutes
     * @return array
     */
    private function generateCustomTimeSlots($startTime, $endTime, $durationMinutes = 30)
    {
        $slots = [];
        
        try {
            // Convert times to DateTime objects
            $start = \DateTime::createFromFormat('H:i', $startTime);
            $end = \DateTime::createFromFormat('H:i', $endTime);
            
            if (!$start || !$end) {
                Log::error('Invalid time format:', [
                    'start_time' => $startTime,
                    'end_time' => $endTime
                ]);
                return $this->getDefaultTimeSlots();
            }

            $current = clone $start;
            $interval = new \DateInterval('PT' . $durationMinutes . 'M');

            // Generate slots until we reach the end time minus appointment duration
            $lastSlotStart = clone $end;
            $lastSlotStart->sub($interval);

            while ($current <= $lastSlotStart) {
                $slots[] = $current->format('g:i A');
                $current->add($interval);
            }

            Log::info('Generated custom time slots:', [
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration' => $durationMinutes,
                'slots_count' => count($slots),
                'slots' => $slots
            ]);

        } catch (\Exception $e) {
            Log::error('Error generating custom time slots:', [
                'error' => $e->getMessage(),
                'start_time' => $startTime,
                'end_time' => $endTime
            ]);
            
            // Fallback to default slots
            return $this->getDefaultTimeSlots();
        }

        return $slots;
    }

    /**
     * Create an unavailable session for the doctor
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createUnavailableSession(Request $request)
    {
        try {
            $request->validate([
                'date' => 'required|date|after_or_equal:today',
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
                'reason' => 'nullable|string|max:255',
            ]);

            $user = auth()->user();
            $doctor = $user->doctor ?? \App\Models\Doctor::where('user_id', $user->id)->first();
            if (!$doctor) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Doctor profile not found'
                ], 404);
            }

            // Check for overlapping sessions
            $existingSession = DB::table('unavailable_sessions')
                ->where('doctor_id', $doctor->id)
                ->whereDate('date', $request->date)
                ->where(function ($query) use ($request) {
                    $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                          ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                          ->orWhere(function ($q) use ($request) {
                              $q->where('start_time', '<=', $request->start_time)
                                ->where('end_time', '>=', $request->end_time);
                          });
                })
                ->first();

            if ($existingSession) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This time period overlaps with an existing unavailable session'
                ], 422);
            }

            $session = DB::table('unavailable_sessions')->insertGetId([
                'doctor_id' => $doctor->id,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'reason' => $request->reason,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $createdSession = DB::table('unavailable_sessions')->find($session);

            Log::info('Created unavailable session for doctor:', [
                'doctor_id' => $doctor->id,
                'session' => $createdSession
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Unavailable session created successfully',
                'data' => $createdSession
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create unavailable session for doctor:', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create unavailable session'
            ], 500);
        }
    }

    /**
     * Get unavailable sessions for the doctor
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUnavailableSessions()
    {
        try {
            $user = auth()->user();
            $doctor = $user->doctor ?? \App\Models\Doctor::where('user_id', $user->id)->first();
            if (!$doctor) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Doctor profile not found'
                ], 404);
            }

            $sessions = DB::table('unavailable_sessions')
                ->where('doctor_id', $doctor->id)
                ->whereDate('date', '>=', now()->toDateString())
                ->orderBy('date', 'asc')
                ->orderBy('start_time', 'asc')
                ->get();

            Log::info('Retrieved unavailable sessions for doctor:', [
                'doctor_id' => $doctor->id,
                'sessions_count' => $sessions->count()
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $sessions
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get unavailable sessions for doctor:', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve unavailable sessions'
            ], 500);
        }
    }

    /**
     * Delete an unavailable session for the doctor
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteUnavailableSession($id)
    {
        try {
            $user = auth()->user();
            $doctor = $user->doctor ?? \App\Models\Doctor::where('user_id', $user->id)->first();
            if (!$doctor) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Doctor profile not found'
                ], 404);
            }

            $session = DB::table('unavailable_sessions')
                ->where('id', $id)
                ->where('doctor_id', $doctor->id)
                ->first();

            if (!$session) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unavailable session not found'
                ], 404);
            }

            DB::table('unavailable_sessions')
                ->where('id', $id)
                ->where('doctor_id', $doctor->id)
                ->delete();

            Log::info('Deleted unavailable session for doctor:', [
                'doctor_id' => $doctor->id,
                'session_id' => $id
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Unavailable session deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to delete unavailable session for doctor:', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
                'session_id' => $id
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete unavailable session'
            ], 500);
        }
    }

    /**
     * Get default time slots for doctors
     *
     * @return array
     */
    private function getDefaultTimeSlots()
    {
        return [
            '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
            '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
            '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
            '4:00 PM', '4:30 PM'
        ];
    }

    /**
     * Remove the specified doctor from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json([
                'status' => 'error',
                'message' => 'Doctor not found'
            ], 404);
        }

        $doctor->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Doctor deleted successfully'
        ]);
    }
}
