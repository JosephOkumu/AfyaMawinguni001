import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Upload,
  Save,
  Image,
  MapPin,
  Clock,
  Star,
  FileText,
  Edit,
  Trash2,
  Search,
  Plus,
  Home,
  ChevronDown,
  ChevronUp,
  Activity,
  Calendar,
  Users,
  Bell,
  Settings,
  TestTube,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

interface ProviderProfileForm {
  name: string;
  phoneNumber: string;
  email: string;
  location: string;
  professionalSummary: string;
  availability: string;
  startingPrice: string;
}

interface NursingServiceForm {
  id?: string;
  name: string;
  description: string;
  location: string;
  availability: string;
  experience: string;
  price: string;
  image: File | null;
}

// Mock data for existing services
const mockServices = [
  {
    id: "1",
    name: "General Nursing Care",
    description:
      "Basic nursing care including medication administration, wound care, and vital signs monitoring.",
    location: "Nairobi Central",
    availability: "24/7",
    experience: "5+ years",
    price: "1500",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "2",
    name: "Specialized Care for Chronic Conditions",
    description:
      "Customized care for patients with diabetes, hypertension, and other chronic conditions.",
    location: "Westlands",
    availability: "Weekdays, 8AM-6PM",
    experience: "8+ years",
    price: "2500",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "3",
    name: "Post-Surgical Care",
    description:
      "Specialized nursing care for patients recovering from surgery, including wound care and medication management.",
    location: "Karen",
    availability: "On demand",
    experience: "10+ years",
    price: "2800",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
  },
];

const HomeNursingDashboard = () => {
  const [services, setServices] = useState(mockServices);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] =
    useState<NursingServiceForm | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("services");

  const profileForm = useForm<ProviderProfileForm>({
    defaultValues: {
      name: "Nairobi Care",
      phoneNumber: "+254712345678",
      email: "nairobi.care@example.com",
      location: "Nairobi, Kenya",
      professionalSummary:
        "Experienced home nursing care provider with over 5 years of experience in patient care.",
      availability: "24/7",
      startingPrice: "1500",
    },
  });

  const form = useForm<NursingServiceForm>({
    defaultValues: {
      name: "",
      description: "",
      location: "",
      availability: "",
      experience: "",
      price: "",
      image: null,
    },
  });

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      location: "",
      availability: "",
      experience: "",
      price: "",
      image: null,
    });
    setIsEditing(false);
    setCurrentService(null);
    setShowAddForm(false);
  };

  const handleAddNewClick = () => {
    setIsEditing(false);
    setCurrentService(null);
    form.reset({
      name: "",
      description: "",
      location: "",
      availability: "",
      experience: "",
      price: "",
      image: null,
    });
    setShowAddForm(!showAddForm);
  };

  const handleEditService = (service) => {
    setIsEditing(true);
    setCurrentService(service);
    form.reset({
      id: service.id,
      name: service.name,
      description: service.description,
      location: service.location,
      availability: service.availability,
      experience: service.experience,
      price: service.price,
      image: null,
    });
    setShowAddForm(true);
  };

  const handleDeleteClick = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      setServices(services.filter((service) => service.id !== serviceToDelete));
      setShowDeleteDialog(false);
      setServiceToDelete(null);
      toast({
        title: "Service Deleted",
        description: "The service has been successfully deleted.",
        variant: "default",
      });
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const onSubmit = async (data: NursingServiceForm) => {
    // In a real app, this would send data to the server
    console.log(data);

    if (isEditing && currentService) {
      // Update existing service
      const updatedServices = services.map((service) =>
        service.id === currentService.id
          ? { ...service, ...data, image: service.image } // Keep the existing image URL
          : service,
      );
      setServices(updatedServices);
      toast({
        title: "Service Updated",
        description: "Your service has been successfully updated.",
        variant: "default",
      });
    } else {
      // Add new service
      const newService = {
        ...data,
        id: Date.now().toString(),
        image: "https://randomuser.me/api/portraits/women/44.jpg", // Placeholder image
      };
      setServices([...services, newService]);
      toast({
        title: "Service Added",
        description: "Your new service has been successfully added.",
        variant: "default",
      });
    }

    resetForm();
  };

  const handleProfileSubmit = (data: ProviderProfileForm) => {
    console.log("Profile data:", data);
    toast({
      title: "Profile Updated",
      description: "Your provider profile has been successfully updated.",
    });
    setShowProfileDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-primary-blue">AFYA</span>
              <span className="text-secondary-green"> MAWINGUNI</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Home Nursing Service Provider Dashboard
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-full px-3 py-1.5 border border-gray-200 shadow-sm">
              <span className="text-sm font-medium mr-2">Nairobi Care</span>
              <Avatar className="h-8 w-8 border border-secondary-green/20">
                <AvatarImage
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Provider"
                />
                <AvatarFallback>NP</AvatarFallback>
              </Avatar>
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Dialog
              open={showProfileDialog}
              onOpenChange={setShowProfileDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="sticky top-0 z-10 bg-white px-6 py-4 border-b flex flex-row justify-between items-center">
                  <DialogTitle className="text-xl font-semibold">
                    Provider Profile Settings
                  </DialogTitle>
                </DialogHeader>
                <div className="px-6 py-4">
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Provider Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter provider name"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter phone number"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Enter email address"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your location"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 24/7, Weekdays 8AM-6PM"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="startingPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Starting Price (KES)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter starting price"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={profileForm.control}
                        name="professionalSummary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional Summary</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your experience, qualifications, and specializations"
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowProfileDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Profile</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-4 space-y-6">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Services</p>
                    <h3 className="text-2xl font-bold">{services.length}</h3>
                  </div>
                  <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <TestTube className="h-5 w-5 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Appointments</p>
                    <h3 className="text-2xl font-bold">12</h3>
                  </div>
                  <div className="h-10 w-10 bg-green-200 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Requests</p>
                    <h3 className="text-2xl font-bold">3</h3>
                  </div>
                  <div className="h-10 w-10 bg-amber-200 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <h3 className="text-2xl font-bold">KES 45,000</h3>
                  </div>
                  <div className="h-10 w-10 bg-purple-200 rounded-full flex items-center justify-center">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 w-full justify-start overflow-x-auto space-x-2">
                <TabsTrigger value="services" className="gap-2">
                  <Home className="h-4 w-4" />
                  <span>My Services</span>
                </TabsTrigger>
                <TabsTrigger value="requests" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Pending Requests</span>
                </TabsTrigger>
                <TabsTrigger value="schedule" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>My Schedule</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Appointment History</span>
                </TabsTrigger>
              </TabsList>

              {/* My Services Tab */}
              <TabsContent value="services">
                <Card className="border-0 shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-blue to-secondary-green p-4 text-white">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">My Services</h2>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white text-primary-blue hover:bg-gray-100 flex items-center gap-1"
                        onClick={handleAddNewClick}
                      >
                        <Plus className="h-4 w-4" />
                        Add Service
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    {showAddForm && (
                      <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {isEditing ? "Edit Service" : "Add New Service"}
                        </h3>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                          >
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Service Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Home Care Package"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Service Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Describe your nursing service..."
                                      className="min-h-[100px]"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Service Area</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <Input
                                          className="pl-10"
                                          placeholder="e.g., Nairobi Central"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Price (KES)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="e.g., 2500"
                                        {...field}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="availability"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Availability</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <Input
                                          className="pl-10"
                                          placeholder="e.g., Monday-Friday, 9AM-5PM"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="experience"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Years of Experience</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Star className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <Input
                                          className="pl-10"
                                          placeholder="e.g., 5 years"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="image"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Service Image</FormLabel>
                                  <FormControl>
                                    <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary-blue transition-colors cursor-pointer">
                                      <Input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) =>
                                          field.onChange(e.target.files?.[0])
                                        }
                                        id="service-image"
                                      />
                                      <label
                                        htmlFor="service-image"
                                        className="cursor-pointer"
                                      >
                                        <div className="flex flex-col items-center gap-2">
                                          <Image className="h-6 w-6 text-gray-400" />
                                          <span className="text-sm text-gray-500">
                                            Click to upload image
                                          </span>
                                          {isEditing && (
                                            <span className="text-xs text-blue-500">
                                              Leave empty to keep current image
                                            </span>
                                          )}
                                        </div>
                                      </label>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <div className="flex justify-end gap-4 pt-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" className="gap-2">
                                <Save className="h-4 w-4" />
                                {isEditing ? "Update Service" : "Save Service"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-600">
                        Manage your nursing services
                      </p>
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="search"
                          placeholder="Search services..."
                          className="pl-10 w-full border-gray-200 focus-visible:ring-secondary-green"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    {filteredServices.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Service</TableHead>
                              <TableHead>Price (KES)</TableHead>
                              <TableHead>Availability</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredServices.map((service) => (
                              <TableRow
                                key={service.id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10 border border-gray-200">
                                      <AvatarImage
                                        src={service.image}
                                        alt={service.name}
                                      />
                                      <AvatarFallback>
                                        {service.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-gray-900 max-w-[200px] truncate">
                                        {service.name}
                                      </div>
                                      <div className="text-xs text-gray-500 max-w-[200px] truncate">
                                        {service.description}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-700 border-green-200"
                                  >
                                    {service.price}
                                  </Badge>
                                </TableCell>
                                <TableCell>{service.availability}</TableCell>
                                <TableCell>{service.location}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                      onClick={() => handleEditService(service)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                      onClick={() =>
                                        handleDeleteClick(service.id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No services match your search criteria.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pending Requests Tab */}
              <TabsContent value="requests">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                        Pending Appointment Requests
                      </h2>
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800"
                      >
                        3 Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="https://randomuser.me/api/portraits/women/25.jpg" />
                              <AvatarFallback>MK</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">Mary Kiprotich</h3>
                              <p className="text-sm text-gray-600">
                                Post-surgical care needed
                              </p>
                              <p className="text-xs text-gray-500">
                                Requested: Dec 15, 2024 at 2:30 PM
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600"
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
                              <AvatarFallback>JM</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">John Mwangi</h3>
                              <p className="text-sm text-gray-600">
                                Chronic condition monitoring
                              </p>
                              <p className="text-xs text-gray-500">
                                Requested: Dec 14, 2024 at 10:15 AM
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600"
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="https://randomuser.me/api/portraits/women/18.jpg" />
                              <AvatarFallback>AN</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">Alice Njeri</h3>
                              <p className="text-sm text-gray-600">
                                General nursing care
                              </p>
                              <p className="text-xs text-gray-500">
                                Requested: Dec 13, 2024 at 4:45 PM
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600"
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* My Schedule Tab */}
              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">My Schedule</h2>
                      <Button size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Availability
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">
                          Today - December 15, 2024
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Clock className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  9:00 AM - 12:00 PM
                                </p>
                                <p className="text-sm text-gray-600">
                                  Post-surgical care - Mary Kiprotich
                                </p>
                                <p className="text-xs text-gray-500">
                                  Karen, Nairobi
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              Confirmed
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Clock className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium">2:00 PM - 4:00 PM</p>
                                <p className="text-sm text-gray-600">
                                  Medication administration - James Ochieng
                                </p>
                                <p className="text-xs text-gray-500">
                                  Westlands, Nairobi
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              In Progress
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 mb-3">
                          Tomorrow - December 16, 2024
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <Clock className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  10:00 AM - 1:00 PM
                                </p>
                                <p className="text-sm text-gray-600">
                                  Chronic condition monitoring - Peter Kamau
                                </p>
                                <p className="text-xs text-gray-500">
                                  Kileleshwa, Nairobi
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">Scheduled</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appointment History Tab */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                        Appointment History
                      </h2>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="search"
                          placeholder="Search appointments..."
                          className="w-64"
                        />
                        <Button variant="outline" size="sm">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
                              <AvatarFallback>SK</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">Sarah Kimani</h3>
                              <p className="text-sm text-gray-600">
                                Wound care and dressing
                              </p>
                              <p className="text-xs text-gray-500">
                                Completed: Dec 12, 2024 • Duration: 2 hours
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800 mb-2">
                              Completed
                            </Badge>
                            <p className="text-sm font-medium">KES 2,500</p>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="https://randomuser.me/api/portraits/men/55.jpg" />
                              <AvatarFallback>DM</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">David Mutua</h3>
                              <p className="text-sm text-gray-600">
                                Medication administration
                              </p>
                              <p className="text-xs text-gray-500">
                                Completed: Dec 10, 2024 • Duration: 1.5 hours
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800 mb-2">
                              Completed
                            </Badge>
                            <p className="text-sm font-medium">KES 1,800</p>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="https://randomuser.me/api/portraits/women/33.jpg" />
                              <AvatarFallback>GW</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">Grace Wanjiku</h3>
                              <p className="text-sm text-gray-600">
                                Physical therapy assistance
                              </p>
                              <p className="text-xs text-gray-500">
                                Cancelled: Dec 8, 2024 • Reason: Patient
                                unavailable
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive" className="mb-2">
                              Cancelled
                            </Badge>
                            <p className="text-sm text-gray-500">KES 2,000</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          Showing 1-3 of 15 appointments
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" disabled>
                            Previous
                          </Button>
                          <Button variant="outline" size="sm">
                            Next
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeNursingDashboard;
