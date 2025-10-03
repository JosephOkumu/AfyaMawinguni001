<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Doctor;
use App\Models\NursingProvider;
use App\Models\LabProvider;
use App\Models\Pharmacy;
use App\Models\Appointment;
use App\Models\NursingService;
use App\Models\LabAppointment;
use App\Models\MedicineOrder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    // Predefined admin credentials
    private $adminCredentials = [
        'Sanja' => 'Administrator$1',
        'Jose' => 'Administrator$2',
        'Aceso' => 'Administrator$3',
    ];

    /**
     * Admin login
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $username = $request->username;
        $password = $request->password;

        // Check if credentials match
        if (isset($this->adminCredentials[$username]) && $this->adminCredentials[$username] === $password) {
            // Generate a simple token for admin session
            $token = base64_encode($username . ':' . time());
            
            return response()->json([
                'success' => true,
                'token' => $token,
                'admin' => [
                    'username' => $username,
                    'role' => 'admin'
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }

    /**
     * Verify admin token
     */
    public function verifyToken(Request $request)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['valid' => false], 401);
        }

        try {
            $decoded = base64_decode($token);
            $parts = explode(':', $decoded);
            $username = $parts[0] ?? null;

            if ($username && isset($this->adminCredentials[$username])) {
                return response()->json([
                    'valid' => true,
                    'admin' => [
                        'username' => $username,
                        'role' => 'admin'
                    ]
                ]);
            }
        } catch (\Exception $e) {
            return response()->json(['valid' => false], 401);
        }

        return response()->json(['valid' => false], 401);
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats(Request $request)
    {
        try {
            // Get counts for each user type
            $doctorsCount = Doctor::count();
            $nursingProvidersCount = NursingProvider::count();
            $labProvidersCount = LabProvider::count();
            $pharmaciesCount = Pharmacy::count();
            $patientsCount = User::whereHas('userType', function($query) {
                $query->where('name', 'patient');
            })->count();

            // Get revenue data
            $doctorRevenue = Appointment::where('is_paid', true)
                ->whereIn('status', ['scheduled', 'confirmed', 'completed'])
                ->sum('fee');

            $nursingRevenue = NursingService::where('is_paid', true)
                ->whereIn('status', ['scheduled', 'confirmed', 'completed'])
                ->sum('service_price');

            $labRevenue = LabAppointment::where('is_paid', true)
                ->whereIn('status', ['scheduled', 'confirmed', 'completed'])
                ->sum('total_amount');

            $medicineRevenue = MedicineOrder::where('is_paid', true)
                ->whereIn('status', ['pending', 'processing', 'delivered'])
                ->sum('total');

            $totalRevenue = $doctorRevenue + $nursingRevenue + $labRevenue + $medicineRevenue;

            // Get recent appointments count
            $recentAppointments = Appointment::where('created_at', '>=', now()->subDays(30))->count();
            $recentNursingServices = NursingService::where('created_at', '>=', now()->subDays(30))->count();
            $recentLabAppointments = LabAppointment::where('created_at', '>=', now()->subDays(30))->count();

            return response()->json([
                'success' => true,
                'stats' => [
                    'userCounts' => [
                        'doctors' => $doctorsCount,
                        'nursing' => $nursingProvidersCount,
                        'labs' => $labProvidersCount,
                        'pharmacies' => $pharmaciesCount,
                        'patients' => $patientsCount,
                    ],
                    'revenue' => [
                        'total' => $totalRevenue,
                        'doctors' => $doctorRevenue,
                        'nursing' => $nursingRevenue,
                        'labs' => $labRevenue,
                        'medicines' => $medicineRevenue,
                    ],
                    'recentActivity' => [
                        'appointments' => $recentAppointments,
                        'nursingServices' => $recentNursingServices,
                        'labAppointments' => $recentLabAppointments,
                        'total' => $recentAppointments + $recentNursingServices + $recentLabAppointments,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching dashboard stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching statistics'
            ], 500);
        }
    }

    /**
     * Get users by type
     */
    public function getUsersByType(Request $request, $type)
    {
        try {
            $users = [];

            switch ($type) {
                case 'doctors':
                    $users = Doctor::with('user')->get()->map(function($doctor) {
                        return [
                            'id' => $doctor->id,
                            'user_id' => $doctor->user_id,
                            'name' => $doctor->user->name ?? 'N/A',
                            'email' => $doctor->user->email ?? 'N/A',
                            'phone' => $doctor->user->phone ?? 'N/A',
                            'specialization' => $doctor->specialization,
                            'license_number' => $doctor->license_number,
                            'created_at' => $doctor->created_at,
                            'type' => 'doctor'
                        ];
                    });
                    break;

                case 'nursing':
                    $users = NursingProvider::with('user')->get()->map(function($provider) {
                        return [
                            'id' => $provider->id,
                            'user_id' => $provider->user_id,
                            'name' => $provider->user->name ?? 'N/A',
                            'email' => $provider->user->email ?? 'N/A',
                            'phone' => $provider->user->phone ?? 'N/A',
                            'specialization' => $provider->specialization,
                            'license_number' => $provider->license_number,
                            'created_at' => $provider->created_at,
                            'type' => 'nursing'
                        ];
                    });
                    break;

                case 'labs':
                    $users = LabProvider::with('user')->get()->map(function($provider) {
                        return [
                            'id' => $provider->id,
                            'user_id' => $provider->user_id,
                            'name' => $provider->user->name ?? 'N/A',
                            'email' => $provider->user->email ?? 'N/A',
                            'phone' => $provider->user->phone ?? 'N/A',
                            'lab_name' => $provider->lab_name,
                            'license_number' => $provider->license_number,
                            'created_at' => $provider->created_at,
                            'type' => 'lab'
                        ];
                    });
                    break;

                case 'pharmacies':
                    $users = Pharmacy::with('user')->get()->map(function($pharmacy) {
                        return [
                            'id' => $pharmacy->id,
                            'user_id' => $pharmacy->user_id,
                            'name' => $pharmacy->user->name ?? 'N/A',
                            'email' => $pharmacy->user->email ?? 'N/A',
                            'phone' => $pharmacy->user->phone ?? 'N/A',
                            'pharmacy_name' => $pharmacy->pharmacy_name,
                            'license_number' => $pharmacy->license_number,
                            'created_at' => $pharmacy->created_at,
                            'type' => 'pharmacy'
                        ];
                    });
                    break;

                case 'patients':
                    $users = User::whereHas('userType', function($query) {
                        $query->where('name', 'patient');
                    })->get()->map(function($user) {
                        return [
                            'id' => $user->id,
                            'user_id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'phone' => $user->phone,
                            'created_at' => $user->created_at,
                            'type' => 'patient'
                        ];
                    });
                    break;

                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid user type'
                    ], 400);
            }

            return response()->json([
                'success' => true,
                'users' => $users
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching users: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching users'
            ], 500);
        }
    }

    /**
     * Delete a user
     */
    public function deleteUser(Request $request, $type, $id)
    {
        try {
            DB::beginTransaction();

            switch ($type) {
                case 'doctors':
                    $provider = Doctor::findOrFail($id);
                    $userId = $provider->user_id;
                    $provider->delete();
                    if ($userId) {
                        User::find($userId)?->delete();
                    }
                    break;

                case 'nursing':
                    $provider = NursingProvider::findOrFail($id);
                    $userId = $provider->user_id;
                    $provider->delete();
                    if ($userId) {
                        User::find($userId)?->delete();
                    }
                    break;

                case 'labs':
                    $provider = LabProvider::findOrFail($id);
                    $userId = $provider->user_id;
                    $provider->delete();
                    if ($userId) {
                        User::find($userId)?->delete();
                    }
                    break;

                case 'pharmacies':
                    $provider = Pharmacy::findOrFail($id);
                    $userId = $provider->user_id;
                    $provider->delete();
                    if ($userId) {
                        User::find($userId)?->delete();
                    }
                    break;

                case 'patients':
                    User::findOrFail($id)->delete();
                    break;

                default:
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid user type'
                    ], 400);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new user
     */
    public function createUser(Request $request)
    {
        $request->validate([
            'type' => 'required|in:doctor,nursing,lab,pharmacy,patient',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string',
            'password' => 'required|string|min:8',
            'specialization' => 'required_if:type,doctor,nursing',
            'license_number' => 'required_if:type,doctor,nursing,lab,pharmacy',
            'lab_name' => 'required_if:type,lab',
            'pharmacy_name' => 'required_if:type,pharmacy',
        ]);

        try {
            DB::beginTransaction();

            // Get user type ID
            $userType = DB::table('user_types')->where('name', $request->type === 'nursing' ? 'nursing' : $request->type)->first();
            
            if (!$userType) {
                throw new \Exception('User type not found');
            }

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'user_type_id' => $userType->id,
            ]);

            // Create provider profile based on type
            switch ($request->type) {
                case 'doctor':
                    Doctor::create([
                        'user_id' => $user->id,
                        'specialty' => $request->specialization,
                        'license_number' => $request->license_number,
                        'qualifications' => $request->specialization ?? 'Medical Doctor',
                        'consultation_fee' => $request->consultation_fee ?? 1000,
                        'years_of_experience' => $request->years_of_experience ?? 0,
                    ]);
                    break;

                case 'nursing':
                    NursingProvider::create([
                        'user_id' => $user->id,
                        'provider_name' => $request->name,
                        'description' => $request->specialization ?? 'Professional nursing provider',
                        'license_number' => $request->license_number,
                        'qualifications' => $request->specialization ?? 'Certified Nurse',
                        'services_offered' => json_encode(['General Nursing Care']),
                        'base_rate_per_hour' => 1000.00,
                        'is_available' => true,
                    ]);
                    break;

                case 'lab':
                    LabProvider::create([
                        'user_id' => $user->id,
                        'lab_name' => $request->lab_name,
                        'license_number' => $request->license_number,
                        'address' => 'To be updated',
                        'description' => 'Professional laboratory services',
                        'is_available' => true,
                    ]);
                    break;

                case 'pharmacy':
                    Pharmacy::create([
                        'user_id' => $user->id,
                        'pharmacy_name' => $request->pharmacy_name,
                        'license_number' => $request->license_number,
                        'description' => 'Professional pharmacy services',
                        'address' => 'To be updated',
                        'city' => 'Nairobi',
                        'is_available' => true,
                    ]);
                    break;

                case 'patient':
                    // Patient doesn't need additional profile
                    break;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error creating user: ' . $e->getMessage()
            ], 500);
        }
    }
}
