<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Appointment;
use App\Models\NursingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'appointment_id' => 'nullable|exists:appointments,id',
            'nursing_service_id' => 'nullable|exists:nursing_services,id',
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'nullable|string|max:1000'
        ]);

        // Ensure either appointment_id or nursing_service_id is provided
        if (!$request->appointment_id && !$request->nursing_service_id) {
            return response()->json(['error' => 'Either appointment_id or nursing_service_id is required'], 400);
        }

        if ($request->appointment_id && $request->nursing_service_id) {
            return response()->json(['error' => 'Cannot provide both appointment_id and nursing_service_id'], 400);
        }

        $reviewData = [
            'patient_id' => Auth::id(),
            'rating' => $request->rating,
            'review_text' => $request->review_text
        ];

        if ($request->appointment_id) {
            // Handle doctor appointment review
            $appointment = Appointment::findOrFail($request->appointment_id);
            
            if ($appointment->patient_id !== Auth::id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            if ($appointment->status !== 'completed') {
                return response()->json(['error' => 'Can only review completed appointments'], 400);
            }

            if (Review::where('appointment_id', $request->appointment_id)->exists()) {
                return response()->json(['error' => 'Review already exists for this appointment'], 400);
            }

            $reviewData['doctor_id'] = $appointment->doctor_id;
            $reviewData['appointment_id'] = $request->appointment_id;
        } else {
            // Handle nursing service review
            $nursingService = NursingService::findOrFail($request->nursing_service_id);
            
            if ($nursingService->patient_id !== Auth::id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            if ($nursingService->status !== 'completed') {
                return response()->json(['error' => 'Can only review completed nursing services'], 400);
            }

            if (Review::where('nursing_service_id', $request->nursing_service_id)->exists()) {
                return response()->json(['error' => 'Review already exists for this nursing service'], 400);
            }

            $reviewData['nursing_provider_id'] = $nursingService->nursing_provider_id;
            $reviewData['nursing_service_id'] = $request->nursing_service_id;
        }

        // Create the review
        $review = Review::create($reviewData);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review
        ], 201);
    }

    public function getDoctorReviews($doctorId)
    {
        $reviews = Review::with(['patient:id,name'])
            ->where('doctor_id', $doctorId)
            ->orderBy('created_at', 'desc')
            ->get();

        $averageRating = $reviews->avg('rating');
        $totalReviews = $reviews->count();

        // Check if current authenticated user has already reviewed this doctor
        $currentUserReviewed = false;
        if (Auth::check()) {
            $currentUserReviewed = Review::where('doctor_id', $doctorId)
                ->where('patient_id', Auth::id())
                ->exists();
        }

        return response()->json([
            'reviews' => $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'patient_name' => $review->patient->name,
                    'rating' => $review->rating,
                    'review_text' => $review->review_text,
                    'created_at' => $review->created_at->format('M d, Y')
                ];
            }),
            'average_rating' => $averageRating ? round($averageRating, 1) : 0,
            'total_reviews' => $totalReviews,
            'current_user_reviewed' => $currentUserReviewed
        ]);
    }

    public function getNursingProviderReviews($nursingProviderId)
    {
        $reviews = Review::with(['patient:id,name'])
            ->where('nursing_provider_id', $nursingProviderId)
            ->orderBy('created_at', 'desc')
            ->get();

        $averageRating = $reviews->avg('rating');
        $totalReviews = $reviews->count();

        // Check if current authenticated user has already reviewed this nursing provider
        $currentUserReviewed = false;
        if (Auth::check()) {
            $currentUserReviewed = Review::where('nursing_provider_id', $nursingProviderId)
                ->where('patient_id', Auth::id())
                ->exists();
        }

        return response()->json([
            'reviews' => $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'patient_name' => $review->patient->name,
                    'rating' => $review->rating,
                    'review_text' => $review->review_text,
                    'created_at' => $review->created_at->format('M d, Y')
                ];
            }),
            'average_rating' => $averageRating ? round($averageRating, 1) : 0,
            'total_reviews' => $totalReviews,
            'current_user_reviewed' => $currentUserReviewed
        ]);
    }
}
