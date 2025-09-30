<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'nullable|string|max:1000'
        ]);

        // Get the appointment and verify it belongs to the authenticated user
        $appointment = Appointment::findOrFail($request->appointment_id);
        
        if ($appointment->patient_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Check if appointment is completed
        if ($appointment->status !== 'completed') {
            return response()->json(['error' => 'Can only review completed appointments'], 400);
        }

        // Check if review already exists for this appointment
        if (Review::where('appointment_id', $request->appointment_id)->exists()) {
            return response()->json(['error' => 'Review already exists for this appointment'], 400);
        }

        // Create the review
        $review = Review::create([
            'patient_id' => Auth::id(),
            'doctor_id' => $appointment->doctor_id,
            'appointment_id' => $request->appointment_id,
            'rating' => $request->rating,
            'review_text' => $request->review_text
        ]);

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
            'total_reviews' => $totalReviews
        ]);
    }
}
