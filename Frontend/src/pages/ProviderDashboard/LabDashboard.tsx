
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { 
  Save, 
  Search,
  TestTube, 
  Microscope,
  Activity, 
  ChevronDown, 
  Plus, 
  Calendar, 
  Bell, 
  Settings,
  User,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Interfaces
interface LabTest {
  id: number;
  name: string;
  description: string;
  price: number;
  turnaroundTime: string;
  icon: React.ElementType;
  isActive: boolean;
}

interface LaboratoryProfile {
  facilityName: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  operatingHours: string;
  description: string;
  specialties: string[];
  certifications: string[];
  contactPersonName: string;
  contactPersonRole: string;
  profileImage: string;
}

interface Appointment {
  id: number;
  patientName: string;
  patientImage: string;
  testName: string;
  date: string;
  time: string;
  status: "pending" | "completed" | "In progress";
  paymentStatus: "paid" | "unpaid" | "partial";
  amount: number;
  location: string;
  assignedStaff: string;
  notes: string;
}

const LabDashboard = () => {
  // State variables
  const [activeTab, setActiveTab] = useState<string>("tests");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [showTestForm, setShowTestForm] = useState<boolean>(false);
  const [showProfileDialog, setShowProfileDialog] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Laboratory profile state
  const [laboratoryProfile, setLaboratoryProfile] = useState<LaboratoryProfile>({
    facilityName: "Central Diagnostic Laboratory",
    address: "123 Health Avenue, Nairobi, Kenya",
    phoneNumber: "+254 712 345 678",
    email: "info@centraldl.com",
    website: "www.centraldl.com",
    operatingHours: "Monday-Friday: 8:00AM-8:00PM, Saturday: 9:00AM-5:00PM, Sunday: Closed",
    description: "Central Diagnostic Laboratory is a state-of-the-art facility offering comprehensive diagnostic services with modern equipment and highly trained professionals.",
    specialties: ["Hematology", "Biochemistry", "Microbiology", "Molecular Diagnostics", "Immunology"],
    certifications: ["ISO 15189", "Kenya Laboratory Accreditation Service", "CAP Certification"],
    contactPersonName: "Dr. Sarah Kimani",
    contactPersonRole: "Laboratory Director",
    profileImage: "https://randomuser.me/api/portraits/men/41.jpg"
  });
  
  // Profile form setup
  const profileForm = useForm<LaboratoryProfile>({
    defaultValues: laboratoryProfile
  });
  
  // Test form
  const testForm = useForm<Omit<LabTest, "id" | "icon" | "isActive">>({
    defaultValues: {
      name: selectedTest?.name || "",
      description: selectedTest?.description || "",
      price: selectedTest?.price || 0,
      turnaroundTime: selectedTest?.turnaroundTime || ""
    }
  });

  // Sample data
  const [labTests, setLabTests] = useState<LabTest[]>([
    {
      id: 1,
      name: "Complete Blood Count",
      description: "Measures different components of blood including red blood cells, white blood cells, and platelets.",
      price: 1200,
      turnaroundTime: "2 hours",
      icon: Activity,
      isActive: true
    },
    {
      id: 2,
      name: "Blood Glucose Test",
      description: "Measures the amount of glucose in blood to diagnose diabetes.",
      price: 800,
      turnaroundTime: "1 hour",
      icon: Activity,
      isActive: true
    },
    {
      id: 3,
      name: "Lipid Profile",
      description: "Measures cholesterol and triglycerides to assess heart disease risk.",
      price: 1500,
      turnaroundTime: "3 hours",
      icon: TestTube,
      isActive: true
    },
    {
      id: 4,
      name: "Liver Function Test",
      description: "Assesses liver health by measuring enzymes and proteins.",
      price: 2000,
      turnaroundTime: "4 hours",
      icon: Microscope,
      isActive: true
    },
    {
      id: 5,
      name: "COVID-19 PCR Test",
      description: "Detects current infection with SARS-CoV-2 virus.",
      price: 3500,
      turnaroundTime: "24 hours",
      icon: TestTube,
      isActive: true
    }
  ]);

  const appointments: Appointment[] = [

    {
      id: 1,
      patientName: "John Doe",
      patientImage: "https://randomuser.me/api/portraits/men/32.jpg",
      testName: "Complete Blood Count",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "pending",
      paymentStatus: "paid",
      amount: 1200,
      location: "Lab Room 3, East Wing",
      assignedStaff: "Dr. Elizabeth Johnson",
      notes: "Patient should fast for 8 hours before the test. Bring previous lab results if available."
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientImage: "https://randomuser.me/api/portraits/women/44.jpg",
      testName: "Blood Glucose Test",
      date: "2023-06-15",
      time: "11:30 AM",
      status: "completed",
      paymentStatus: "paid",
      amount: 800,
      location: "Lab Room 1, Main Floor",
      assignedStaff: "Dr. Robert Chen",
      notes: "The patient is diabetic. Special care should be taken during sample collection."
    },
    {
      id: 3,
      patientName: "Michael Johnson",
      patientImage: "https://randomuser.me/api/portraits/men/45.jpg",
      testName: "Lipid Profile",
      date: "2023-06-16",
      time: "09:15 AM",
      status: "pending",
      paymentStatus: "unpaid",
      amount: 1500,
      location: "Lab Room 5, Second Floor",
      assignedStaff: "Dr. Lisa Wong",
      notes: "Patient must fast for 12 hours prior to the test. Water is allowed."
    },
    {
      id: 4,
      patientName: "Samantha Williams",
      patientImage: "https://randomuser.me/api/portraits/women/67.jpg",
      testName: "COVID-19 PCR Test",
      date: "2023-06-16",
      time: "02:00 PM",
      status: "In progress",
      paymentStatus: "partial",
      amount: 3500,
      location: "Isolation Room 2, West Wing",
      assignedStaff: "Dr. Michael Omondi",
      notes: "Patient has reported COVID-19 exposure. Follow strict isolation protocols during testing."
    }
  ];

  // Event handlers
  const onTestSubmit = async (data: Omit<LabTest, "id" | "icon" | "isActive">) => {
    if (selectedTest) {
      // Update existing test
      const updatedTests = labTests.map(test => 
        test.id === selectedTest.id ? { ...test, ...data } : test
      );
      setLabTests(updatedTests);
      toast({
        title: "Test Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      // Add new test
      const newTest: LabTest = {
        id: labTests.length + 1,
        ...data,
        icon: TestTube,
        isActive: true
      };
      setLabTests([...labTests, newTest]);
      toast({
        title: "Test Added",
        description: `${data.name} has been added successfully.`,
      });
    }
    setShowTestForm(false);
    setSelectedTest(null);
    testForm.reset();
  };

  const handleEditTest = (test: LabTest) => {
    setSelectedTest(test);
    testForm.reset({
      name: test.name,
      description: test.description,
      price: test.price,
      turnaroundTime: test.turnaroundTime
    });
    setShowTestForm(true);
  };

  const handleAddNewTest = () => {
    setSelectedTest(null);
    testForm.reset({
      name: "",
      description: "",
      price: 0,
      turnaroundTime: ""
    });
    setShowTestForm(!showTestForm);
  };

  const handleToggleTestStatus = (id: number) => {
    const updatedTests = labTests.map(test => 
      test.id === id ? { ...test, isActive: !test.isActive } : test
    );
    setLabTests(updatedTests);
    const test = updatedTests.find(t => t.id === id);
    toast({
      title: test?.isActive ? "Test Activated" : "Test Deactivated",
      description: `${test?.name} has been ${test?.isActive ? "activated" : "deactivated"}.`,
    });
  };
  
  // Profile form handler
  const onProfileSubmit = async (data: LaboratoryProfile) => {
    setLaboratoryProfile(data);
    toast({
      title: "Profile Updated",
      description: "Your laboratory profile has been updated successfully.",
    });
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
        case "pending": return "bg-red-100 text-red-800";
        case "completed": return "bg-green-100 text-green-800";
        case "In progress": return "bg-amber-100 text-amber-800";
        default: return "";
    }
  };

  const getPaymentStatusColor = (status: Appointment["paymentStatus"]) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "unpaid": return "bg-red-100 text-red-800";
      case "partial": return "bg-blue-100 text-blue-800";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-primary-blue">AFYA</span>
              <span className="text-secondary-green"> MAWINGUNI</span>
            </h1>
            <p className="text-gray-600 mt-2">Laboratory Service Provider Dashboard</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-full px-3 py-1.5 border border-gray-200 shadow-sm">
              <span className="text-sm font-medium mr-2">Central Diagnostic Laboratory</span>
              <Avatar className="h-8 w-8 border border-secondary-green/20">
                <AvatarImage src="https://randomuser.me/api/portraits/men/41.jpg" alt="Lab Admin" />
                <AvatarFallback>CDL</AvatarFallback>
              </Avatar>
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="sticky top-0 z-10 bg-white px-6 py-4 border-b flex flex-row justify-between items-center">
                  <DialogTitle className="text-xl font-semibold">Laboratory Profile Settings</DialogTitle>
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogClose>
                </DialogHeader>
                <div className="px-6 py-4">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Profile Image Section */}
                        <div className="lg:w-1/3 flex flex-col items-center">
                          <div className="w-48 h-48 rounded-full mb-6 overflow-hidden border-4 border-primary-blue/20">
                            <img 
                              src={laboratoryProfile.profileImage} 
                              alt="Laboratory Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button variant="outline" className="gap-2 w-full md:w-auto mb-4">
                            <input type="file" className="hidden" id="profile-image" />
                            <label htmlFor="profile-image" className="cursor-pointer flex items-center justify-center gap-2">
                              <Plus className="h-4 w-4" />
                              Change Profile Image
                            </label>
                          </Button>
                          
                          {/* Certifications */}
                          <div className="w-full bg-blue-50 rounded-md p-4 mt-4">
                            <h3 className="font-semibold mb-2">Certifications & Accreditations</h3>
                            <div className="flex flex-wrap gap-2">
                              {laboratoryProfile.certifications.map((cert, index) => (
                                <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                            <div className="mt-4">
                              <div className="flex gap-2">
                                <Input placeholder="Add certification" className="flex-1" id="new-cert" />
                                <Button variant="outline" size="sm" type="button">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Profile Details Form */}
                        <div className="lg:w-2/3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="facilityName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Facility Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Laboratory name" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="contact@example.com" type="email" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <FormField
                              control={profileForm.control}
                              name="phoneNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="+254 7XX XXX XXX" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="website"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Website</FormLabel>
                                  <FormControl>
                                    <Input placeholder="www.example.com" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={profileForm.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="mt-4">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Physical address" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="operatingHours"
                            render={({ field }) => (
                              <FormItem className="mt-4">
                                <FormLabel>Operating Hours</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Mon-Fri: 8AM-5PM" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem className="mt-4">
                                <FormLabel>Laboratory Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your laboratory and services..."
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <div className="mt-4">
                            <FormLabel>Specialties</FormLabel>
                            <div className="flex flex-wrap gap-2 mt-2 mb-2">
                              {laboratoryProfile.specialties.map((specialty, index) => (
                                <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input placeholder="Add specialty" className="flex-1" id="new-specialty" />
                              <Button variant="outline" size="sm" type="button">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <FormField
                              control={profileForm.control}
                              name="contactPersonName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Person</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Full name" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="contactPersonRole"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Role/Position</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Laboratory Director" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button variant="outline" type="button" onClick={() => profileForm.reset()}>Reset Changes</Button>
                        <Button type="submit" className="gap-2" onClick={() => {
                          onProfileSubmit(profileForm.getValues());
                          setShowProfileDialog(false);
                        }}>
                          <Save className="h-4 w-4" />
                          Save Profile
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Tests</p>
                <h3 className="text-2xl font-bold">{labTests.filter(t => t.isActive).length}</h3>
              </div>
              <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center">
                <TestTube className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Tests</p>
                <h3 className="text-2xl font-bold">123</h3>
              </div>
              <div className="h-10 w-10 bg-green-200 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Appointments</p>
                <h3 className="text-2xl font-bold">{appointments.filter(a => a.status === "pending").length}</h3>
              </div>
              <div className="h-10 w-10 bg-amber-200 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <h3 className="text-2xl font-bold">KES 78,500</h3>
              </div>
              <div className="h-10 w-10 bg-purple-200 rounded-full flex items-center justify-center">
                <ChevronDown className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full justify-start overflow-x-auto space-x-2">
            <TabsTrigger value="tests" className="gap-2">
              <TestTube className="h-4 w-4" />
              <span>Lab Tests</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
          </TabsList>

          {/* Tests Tab */}
          <TabsContent value="tests">
            <Card>
              <CardHeader className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Manage Tests</h2>
                  <p className="text-gray-600 text-sm">Add, modify, or deactivate laboratory tests</p>
                </div>
                <Button onClick={handleAddNewTest} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {showTestForm ? "Hide Form" : "Add New Test"}
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                {showTestForm && (
                  <Card className="mb-6 border border-primary-blue/20 bg-blue-50/30">
                    <CardContent className="pt-6">
                      <Form {...testForm}>
                        <form onSubmit={testForm.handleSubmit(onTestSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={testForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Test Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Complete Blood Count" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={testForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price (KES)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="e.g., 1500" 
                                      {...field} 
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={testForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe the test..."
                                    className="min-h-[100px]"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={testForm.control}
                            name="turnaroundTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Turnaround Time</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 2 hours" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-4">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                setShowTestForm(false);
                                setSelectedTest(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" className="gap-2">
                              <Save className="h-4 w-4" />
                              {selectedTest ? "Update Test" : "Add Test"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price (KES)</TableHead>
                        <TableHead>Turnaround Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <test.icon className="h-4 w-4 text-primary-blue" />
                            {test.name}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{test.description}</TableCell>
                          <TableCell>{test.price.toLocaleString()}</TableCell>
                          <TableCell>{test.turnaroundTime}</TableCell>
                          <TableCell>
                            <Badge variant={test.isActive ? "default" : "secondary"} className={test.isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}>
                              {test.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditTest(test)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant={test.isActive ? "destructive" : "outline"} 
                                size="sm"
                                onClick={() => handleToggleTestStatus(test.id)}
                              >
                                {test.isActive ? "Deactivate" : "Activate"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                  <p className="text-gray-600 text-sm">Manage patient test appointments</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input className="pl-10 w-full md:w-64" placeholder="Search appointments..." />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Test</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={appointment.patientImage} alt={appointment.patientName} />
                                <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{appointment.patientName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.testName}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              <span className="text-gray-500 text-xs">{appointment.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPaymentStatusColor(appointment.paymentStatus)}>
                              {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>KES {appointment.amount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {appointment.status === "pending" && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  Complete
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setShowAppointmentDetails(true);
                                }}
                              >
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          

        </Tabs>
      </div>
      
      {/* Appointment Details Dialog */}
      <Dialog open={showAppointmentDetails} onOpenChange={(open) => {
        setShowAppointmentDetails(open);
        if (!open) {
          setIsEditing(false);
        }
      }}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Appointment Details</DialogTitle>
              {selectedAppointment && selectedAppointment.status === "pending" && (
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                      Edit Details
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel Editing
                    </Button>
                  )}
                </div>
              )}
            </div>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Patient Information - Always Read-Only */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Patient Information</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedAppointment.patientImage} alt={selectedAppointment.patientName} />
                    <AvatarFallback>{selectedAppointment.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedAppointment.patientName}</p>
                    <p className="text-sm text-gray-500">Patient ID: PT-{1000 + selectedAppointment.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Test Type:</p>
                    <p>{selectedAppointment.testName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount:</p>
                    <p>KES {selectedAppointment.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Appointment Specifics Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Appointment Specifics</h3>
                
                {/* Date and Time Details */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-500">Date and Time</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Date:</p>
                      <p>{new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Time:</p>
                      <p>{selectedAppointment.time}</p>
                    </div>
                  </div>
                </div>
                
                {/* Location - Editable */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-500">Location</h4>
                  {isEditing ? (
                    <Input 
                      value={selectedAppointment.location} 
                      onChange={(e) => {
                        setSelectedAppointment({
                          ...selectedAppointment,
                          location: e.target.value
                        });
                      }}
                    />
                  ) : (
                    <p>{selectedAppointment.location}</p>
                  )}
                </div>
                
                {/* Assigned Staff - Editable */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-500">Assigned Staff</h4>
                  {isEditing ? (
                    <Input 
                      value={selectedAppointment.assignedStaff} 
                      onChange={(e) => {
                        setSelectedAppointment({
                          ...selectedAppointment,
                          assignedStaff: e.target.value
                        });
                      }}
                    />
                  ) : (
                    <p>{selectedAppointment.assignedStaff}</p>
                  )}
                </div>
                
                {/* Notes & Instructions - Editable */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-500">Notes & Special Instructions</h4>
                  {isEditing ? (
                    <Textarea 
                      value={selectedAppointment.notes} 
                      onChange={(e) => {
                        setSelectedAppointment({
                          ...selectedAppointment,
                          notes: e.target.value
                        });
                      }}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm">{selectedAppointment.notes}</p>
                  )}
                </div>
              </div>
              
              {/* Status Information */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-500">Current Status</h4>
                <div className="flex gap-2 items-center">
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                  </Badge>
                  
                  <Badge className={getPaymentStatusColor(selectedAppointment.paymentStatus)}>
                    {selectedAppointment.paymentStatus.charAt(0).toUpperCase() + selectedAppointment.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  {selectedAppointment.status === "pending" && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        // Update appointment status locally for demo
                        const updatedAppointments = appointments.map(appointment => 
                          appointment.id === selectedAppointment.id 
                            ? { ...appointment, status: "cancelled" as const } 
                            : appointment
                        );
                        // In a real app, you would call an API here
                        toast({
                          title: "Appointment Cancelled",
                          description: `Appointment for ${selectedAppointment.patientName} has been cancelled.`,
                        });
                        setShowAppointmentDetails(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Appointment
                    </Button>
                  )}
                  
                  {selectedAppointment.status === "pending" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowRescheduleDialog(true)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {isEditing && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => {
                        // Save changes in a real app would call API
                        toast({
                          title: "Details Updated",
                          description: `Appointment details for ${selectedAppointment.patientName} have been updated.`,
                        });
                        setIsEditing(false);
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                  
                  {selectedAppointment.status === "pending" && !isEditing && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {
                        // Update appointment status locally for demo
                        const updatedAppointments = appointments.map(appointment => 
                          appointment.id === selectedAppointment.id 
                            ? { ...appointment, status: "completed" as const } 
                            : appointment
                        );
                        // In a real app, you would call an API here
                        toast({
                          title: "Test Completed",
                          description: `The ${selectedAppointment.testName} for ${selectedAppointment.patientName} has been marked as completed.`,
                        });
                        setShowAppointmentDetails(false);
                      }}
                    >
                      Complete Test
                    </Button>
                  )}
                  
                  <Button variant="outline" onClick={() => setShowAppointmentDetails(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6">
              <div>
                <FormLabel>New Date</FormLabel>
                <Input 
                  type="date" 
                  defaultValue={selectedAppointment.date}
                  className="mt-1"
                />
              </div>
              
              <div>
                <FormLabel>New Time</FormLabel>
                <Input 
                  type="time" 
                  defaultValue={selectedAppointment.time.split(' ')[0]}
                  className="mt-1"
                />
              </div>
              
              <div>
                <FormLabel>Reason for Rescheduling</FormLabel>
                <Textarea 
                  placeholder="Provide a reason for rescheduling..."
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRescheduleDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    toast({
                      title: "Appointment Rescheduled",
                      description: `Appointment for ${selectedAppointment.patientName} has been rescheduled.`,
                    });
                    setShowRescheduleDialog(false);
                  }}
                >
                  Confirm Reschedule
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabDashboard;
