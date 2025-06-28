<?php

namespace App\Http\Controllers;

use App\Models\LabProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class LabProviderController extends Controller
{
    /**
     * Display a listing of the lab providers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $labProviders = LabProvider::with('user')->get();

        return response()->json([
            'status' => 'success',
            'data' => $labProviders
        ]);
    }

    /**
     * Store a newly created lab provider in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'lab_name' => 'required|string|max:255',
            'license_number' => 'required|string|unique:lab_providers,license_number',
            'website' => 'nullable|url|max:255',
            'address' => 'required|string',
            'operating_hours' => 'nullable|json',
            'description' => 'nullable|string',
            'contact_person_name' => 'nullable|string|max:255',
            'contact_person_role' => 'nullable|string|max:255',
            'profile_image' => 'nullable|string',
            'certifications' => 'nullable|json',
            'is_available' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $labProvider = LabProvider::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Lab provider created successfully',
            'data' => $labProvider->load('user')
        ], 201);
    }

    /**
     * Display the specified lab provider.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $labProvider = LabProvider::with('user')->find($id);

        if (!$labProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lab provider not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $labProvider
        ]);
    }

    /**
     * Update the specified lab provider in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'exists:users,id',
            'lab_name' => 'string|max:255',
            'license_number' => 'string|unique:lab_providers,license_number,'.$id,
            'website' => 'nullable|url|max:255',
            'address' => 'string',
            'operating_hours' => 'nullable|json',
            'description' => 'nullable|string',
            'contact_person_name' => 'nullable|string|max:255',
            'contact_person_role' => 'nullable|string|max:255',
            'profile_image' => 'nullable|string',
            'certifications' => 'nullable|json',
            'is_available' => 'boolean',
            'average_rating' => 'numeric|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $labProvider = LabProvider::find($id);

        if (!$labProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lab provider not found'
            ], 404);
        }

        $labProvider->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Lab provider updated successfully',
            'data' => $labProvider->load('user')
        ]);
    }

    /**
     * Get the current authenticated lab provider's profile
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

        $labProvider = LabProvider::where('user_id', $user->id)->with('user')->first();

        if (!$labProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lab provider profile not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $labProvider
        ]);
    }

    /**
     * Update the current authenticated lab provider's profile
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

        $labProvider = LabProvider::where('user_id', $user->id)->first();

        if (!$labProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lab provider profile not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'lab_name' => 'string|max:255',
            'license_number' => 'string|unique:lab_providers,license_number,'.$labProvider->id,
            'website' => 'nullable|url|max:255',
            'address' => 'string',
            'operating_hours' => 'nullable|json',
            'description' => 'nullable|string',
            'contact_person_name' => 'nullable|string|max:255',
            'contact_person_role' => 'nullable|string|max:255',
            'profile_image' => 'nullable|string',
            'certifications' => 'nullable|json',
            'is_available' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $labProvider->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => $labProvider->load('user')
        ]);
    }

    /**
     * Remove the specified lab provider from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $labProvider = LabProvider::find($id);

        if (!$labProvider) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lab provider not found'
            ], 404);
        }

        $labProvider->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Lab provider deleted successfully'
        ]);
    }
}
