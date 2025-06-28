<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\LabProviderController;
use App\Http\Controllers\LabTestController;
use App\Http\Controllers\NursingProviderController;
use App\Http\Controllers\NursingServiceController;
use App\Http\Controllers\PharmacyController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\MedicineOrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Doctor routes
    Route::apiResource('doctors', DoctorController::class);

    // Appointment routes
    Route::apiResource('appointments', AppointmentController::class);
    Route::get('/patient/appointments', [AppointmentController::class, 'index'])->name('patient.appointments');
    Route::get('/doctor/appointments', [AppointmentController::class, 'index'])->name('doctor.appointments');

    // Lab Provider routes
    Route::apiResource('lab-providers', LabProviderController::class);
    Route::get('/lab-provider/profile', [LabProviderController::class, 'profile']);
    Route::put('/lab-provider/profile', [LabProviderController::class, 'updateProfile']);

    // Lab Test routes
    Route::apiResource('lab-tests', LabTestController::class);
    Route::get('/patient/lab-tests', [LabTestController::class, 'index'])->name('patient.lab-tests');
    Route::get('/lab-provider/lab-tests', [LabTestController::class, 'index'])->name('lab-provider.lab-tests');

    // Nursing Provider routes
    Route::apiResource('nursing-providers', NursingProviderController::class);

    // Nursing Service routes
    Route::apiResource('nursing-services', NursingServiceController::class);
    Route::get('/patient/nursing-services', [NursingServiceController::class, 'index'])->name('patient.nursing-services');
    Route::get('/nursing-provider/nursing-services', [NursingServiceController::class, 'index'])->name('nursing-provider.nursing-services');

    // Pharmacy routes
    Route::apiResource('pharmacies', PharmacyController::class);

    // Medicine routes
    Route::apiResource('medicines', MedicineController::class);
    Route::get('/pharmacy/medicines', [MedicineController::class, 'index'])->name('pharmacy.medicines');

    // Medicine Order routes
    Route::apiResource('medicine-orders', MedicineOrderController::class);
    Route::get('/patient/medicine-orders', [MedicineOrderController::class, 'index'])->name('patient.medicine-orders');
    Route::get('/pharmacy/medicine-orders', [MedicineOrderController::class, 'index'])->name('pharmacy.medicine-orders');
});

// Public medicine search route
Route::get('/medicines/search', [MedicineController::class, 'index']);
