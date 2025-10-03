import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import adminService, { AdminStats, AdminUser, CreateUserData } from '@/services/adminService';
import {
  Users,
  Stethoscope,
  Heart,
  FlaskConical,
  Pill,
  DollarSign,
  Activity,
  LogOut,
  Trash2,
  UserPlus,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('doctors');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newUser, setNewUser] = useState<CreateUserData>({
    type: 'doctor',
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    verifyAuth();
  }, []);

  useEffect(() => {
    if (stats) {
      loadUsers(selectedCategory);
    }
  }, [selectedCategory]);

  const verifyAuth = async () => {
    const isAuth = adminService.isAuthenticated();
    if (!isAuth) {
      navigate('/admin');
      return;
    }

    const verification = await adminService.verifyToken();
    if (!verification.valid) {
      adminService.logout();
      navigate('/admin');
      return;
    }

    setAdminUser(adminService.getAdminUser());
    loadDashboardData();
  };

  const loadDashboardData = async () => {
    try {
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
      await loadUsers('doctors');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async (type: string) => {
    try {
      const usersList = await adminService.getUsersByType(type);
      setUsers(usersList);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    adminService.logout();
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
    navigate('/admin');
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await adminService.deleteUser(userToDelete.type, userToDelete.id);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      loadUsers(selectedCategory);
      loadDashboardData();
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await adminService.createUser(newUser);
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
      setShowAddUserDialog(false);
      setNewUser({
        type: 'doctor',
        name: '',
        email: '',
        phone: '',
        password: '',
      });
      loadUsers(selectedCategory);
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create user',
        variant: 'destructive',
      });
    }
  };

  const categories = [
    { id: 'doctors', name: 'Doctors', icon: Stethoscope, color: 'from-blue-500 to-blue-600' },
    { id: 'nursing', name: 'Home Nursing', icon: Heart, color: 'from-pink-500 to-pink-600' },
    { id: 'labs', name: 'Lab Providers', icon: FlaskConical, color: 'from-purple-500 to-purple-600' },
    { id: 'pharmacies', name: 'Pharmacies', icon: Pill, color: 'from-green-500 to-green-600' },
    { id: 'patients', name: 'Patients', icon: Users, color: 'from-indigo-500 to-indigo-600' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src="/aceso.svg" alt="Aceso Logo" className="h-[86px] w-[86px]" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Aceso Health Solutions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminUser?.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{formatCurrency(stats?.revenue.total || 0)}</p>
                  <p className="text-xs opacity-80 mt-1">All services combined</p>
                </div>
                <DollarSign className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {(stats?.userCounts.doctors || 0) +
                      (stats?.userCounts.nursing || 0) +
                      (stats?.userCounts.labs || 0) +
                      (stats?.userCounts.pharmacies || 0) +
                      (stats?.userCounts.patients || 0)}
                  </p>
                  <p className="text-xs opacity-80 mt-1">All categories</p>
                </div>
                <Users className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats?.recentActivity.total || 0}</p>
                  <p className="text-xs opacity-80 mt-1">Last 30 days</p>
                </div>
                <Activity className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats?.recentActivity.appointments || 0}</p>
                  <p className="text-xs opacity-80 mt-1">This month</p>
                </div>
                <Calendar className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Revenue Breakdown</span>
            </CardTitle>
            <CardDescription>Revenue by service category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Doctor Consultations</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats?.revenue.doctors || 0)}
                </p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <p className="text-sm text-gray-600 mb-1">Nursing Services</p>
                <p className="text-2xl font-bold text-pink-600">
                  {formatCurrency(stats?.revenue.nursing || 0)}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Lab Tests</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats?.revenue.labs || 0)}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Medicines</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats?.revenue.medicines || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Categories Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Categories</CardTitle>
                <CardDescription>Select a category to manage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const count =
                    category.id === 'doctors'
                      ? stats?.userCounts.doctors
                      : category.id === 'nursing'
                      ? stats?.userCounts.nursing
                      : category.id === 'labs'
                      ? stats?.userCounts.labs
                      : category.id === 'pharmacies'
                      ? stats?.userCounts.pharmacies
                      : stats?.userCounts.patients;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                        selectedCategory === category.id
                          ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="font-bold">{count}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {categories.find((c) => c.id === selectedCategory)?.name || 'Users'}
                    </CardTitle>
                    <CardDescription>{users.length} users found</CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowAddUserDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No users found in this category</p>
                    </div>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user.id}
                        className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span> {user.email}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Phone:</span> {user.phone}
                              </p>
                              {user.specialization && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Specialization:</span>{' '}
                                  {user.specialization}
                                </p>
                              )}
                              {user.license_number && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">License:</span>{' '}
                                  {user.license_number}
                                </p>
                              )}
                              {user.lab_name && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Lab Name:</span> {user.lab_name}
                                </p>
                              )}
                              {user.pharmacy_name && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Pharmacy:</span>{' '}
                                  {user.pharmacy_name}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                Joined: {new Date(user.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account in the system</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="type">User Type</Label>
                <Select
                  value={newUser.type}
                  onValueChange={(value: any) =>
                    setNewUser({ ...newUser, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nursing">Home Nursing Provider</SelectItem>
                    <SelectItem value="lab">Lab Provider</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength={8}
                />
              </div>

              {(newUser.type === 'doctor' || newUser.type === 'nursing') && (
                <div className="col-span-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={newUser.specialization || ''}
                    onChange={(e) =>
                      setNewUser({ ...newUser, specialization: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {(newUser.type === 'doctor' ||
                newUser.type === 'nursing' ||
                newUser.type === 'lab' ||
                newUser.type === 'pharmacy') && (
                <div className="col-span-2">
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    value={newUser.license_number || ''}
                    onChange={(e) =>
                      setNewUser({ ...newUser, license_number: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {newUser.type === 'lab' && (
                <div className="col-span-2">
                  <Label htmlFor="lab_name">Lab Name</Label>
                  <Input
                    id="lab_name"
                    value={newUser.lab_name || ''}
                    onChange={(e) => setNewUser({ ...newUser, lab_name: e.target.value })}
                    required
                  />
                </div>
              )}

              {newUser.type === 'pharmacy' && (
                <div className="col-span-2">
                  <Label htmlFor="pharmacy_name">Pharmacy Name</Label>
                  <Input
                    id="pharmacy_name"
                    value={newUser.pharmacy_name || ''}
                    onChange={(e) =>
                      setNewUser({ ...newUser, pharmacy_name: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {newUser.type === 'doctor' && (
                <>
                  <div>
                    <Label htmlFor="consultation_fee">Consultation Fee (KES)</Label>
                    <Input
                      id="consultation_fee"
                      type="number"
                      value={newUser.consultation_fee || ''}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          consultation_fee: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="years_of_experience">Years of Experience</Label>
                    <Input
                      id="years_of_experience"
                      type="number"
                      value={newUser.years_of_experience || ''}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          years_of_experience: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddUserDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{userToDelete?.name}</strong> and all
              associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
