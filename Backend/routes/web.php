<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Debug route to capture Pesapal callback parameters
Route::get('/payment-success', function (Illuminate\Http\Request $request) {
    \Illuminate\Support\Facades\Log::info('Pesapal callback received', [
        'all_params' => $request->all(),
        'query_params' => $request->query(),
        'url' => $request->fullUrl(),
        'headers' => $request->headers->all()
    ]);

    // Redirect to frontend with all parameters
    $params = http_build_query($request->all());
    return redirect("http://localhost:8080/payment-success?" . $params);
});
