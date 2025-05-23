<?php

namespace App\Http\Controllers;

use App\Models\LabProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LabProviderController extends Controller
{
    /**
     * Display a listing of the lab providers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $labProviders = LabProvider::all();
        
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
            'description' => 'required|string',
            'license_number' => 'required|string|unique:lab_providers,license_number',
            'certifications' => 'nullable|string',
            'services_offered' => 'required|json',
            'logo' => 'nullable|string',
            'operating_hours' => 'nullable|json',
            'address' => 'required|string',
            'city' => 'required|string',
            'offers_home_sample_collection' => 'boolean',
            'home_collection_fee' => 'nullable|numeric|min:0',
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
            'data' => $labProvider
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
        $labProvider = LabProvider::find($id);

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
            'description' => 'string',
            'license_number' => 'string|unique:lab_providers,license_number,'.$id,
            'certifications' => 'nullable|string',
            'services_offered' => 'json',
            'logo' => 'nullable|string',
            'operating_hours' => 'nullable|json',
            'address' => 'string',
            'city' => 'string',
            'offers_home_sample_collection' => 'boolean',
            'home_collection_fee' => 'nullable|numeric|min:0',
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
            'data' => $labProvider
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
