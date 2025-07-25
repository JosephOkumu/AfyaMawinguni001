<?php
// Test script for lab provider registration

// Display script execution start
echo "Starting test for lab provider registration...\n";

// API endpoint - make sure there's no leading slash in the path part
$url = 'http://127.0.0.1:8080/api/register';
echo "Target URL: $url\n";

// Lab provider registration data
$data = [
    'name' => 'Test Lab Provider',
    'email' => 'testlab'.time().'@example.com', // Using timestamp to ensure unique email
    'password' => 'password123',
    'password_confirmation' => 'password123',
    'phone_number' => '0700123456',
    'user_type' => 'laboratory',
    'license_number' => 'LAB'.rand(1000, 9999).'/'.date('Y')
];
echo "Request payload: " . json_encode($data) . "\n";

// Initialize cURL session
$ch = curl_init($url);

// Set cURL options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

// Execute cURL request
$response = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    echo 'cURL Error: ' . curl_error($ch) . PHP_EOL;
    exit(1);
}

// Get HTTP status code
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Close cURL session
curl_close($ch);

// Display results
echo "HTTP Status Code: $statusCode" . PHP_EOL;
echo "Response Body:" . PHP_EOL;
echo json_encode(json_decode($response), JSON_PRETTY_PRINT) . PHP_EOL;

// Check if registration was successful
$responseData = json_decode($response, true);
if ($statusCode === 201 && isset($responseData['access_token'])) {
    echo "SUCCESS: Lab provider registration was successful!" . PHP_EOL;
    echo "User ID: " . $responseData['user']['id'] . PHP_EOL;
    echo "User Type: " . $responseData['user']['user_type'] . PHP_EOL;
} else {
    echo "ERROR: Lab provider registration failed!" . PHP_EOL;
    if (isset($responseData['message'])) {
        echo "Error Message: " . $responseData['message'] . PHP_EOL;
    }
    if (isset($responseData['errors'])) {
        echo "Validation Errors: " . PHP_EOL;
        print_r($responseData['errors']);
    }
}
