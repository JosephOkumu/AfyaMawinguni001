<?php

namespace App\Http\Controllers;

use App\Models\NursingProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NursingProviderController extends Controller
{
    /**
     * Display a listing of the nursing providers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $nursingProviders = NursingProvider::all();
        
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
        $nursingProvider = NursingProvider::find($id);

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
}
