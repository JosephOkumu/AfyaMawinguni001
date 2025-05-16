
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
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
  Bell
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

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
    description: "Basic nursing care including medication administration, wound care, and vital signs monitoring.",
    location: "Nairobi Central",
    availability: "24/7",
    experience: "5+ years",
    price: "1500",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: "2",
    name: "Specialized Care for Chronic Conditions",
    description: "Customized care for patients with diabetes, hypertension, and other chronic conditions.",
    location: "Westlands",
    availability: "Weekdays, 8AM-6PM",
    experience: "8+ years",
    price: "2500",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: "3",
    name: "Post-Surgical Care",
    description: "Specialized nursing care for patients recovering from surgery, including wound care and medication management.",
    location: "Karen",
    availability: "On demand",
    experience: "10+ years",
    price: "2800",
    image: "https://randomuser.me/api/portraits/women/55.jpg"
  }
];

const HomeNursingDashboard = () => {
  const [services, setServices] = useState(mockServices);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<NursingServiceForm | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const form = useForm<NursingServiceForm>({
    defaultValues: {
      name: "",
      description: "",
      location: "",
      availability: "",
      experience: "",
      price: "",
      image: null
    }
  });

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      location: "",
      availability: "",
      experience: "",
      price: "",
      image: null
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
      image: null
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
      image: null
    });
    setShowAddForm(true);
  };

  const handleDeleteClick = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      setServices(services.filter(service => service.id !== serviceToDelete));
      setShowDeleteDialog(false);
      setServiceToDelete(null);
      toast({
        title: "Service Deleted",
        description: "The service has been successfully deleted.",
        variant: "default"
      });
    }
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: NursingServiceForm) => {
    // In a real app, this would send data to the server
    console.log(data);
    
    if (isEditing && currentService) {
      // Update existing service
      const updatedServices = services.map(service => 
        service.id === currentService.id 
          ? { ...service, ...data, image: service.image } // Keep the existing image URL
          : service
      );
      setServices(updatedServices);
      toast({
        title: "Service Updated",
        description: "Your service has been successfully updated.",
        variant: "default"
      });
    } else {
      // Add new service
      const newService = {
        ...data,
        id: Date.now().toString(),
        image: "https://randomuser.me/api/portraits/women/44.jpg" // Placeholder image
      };
      setServices([...services, newService]);
      toast({
        title: "Service Added",
        description: "Your new service has been successfully added.",
        variant: "default"
      });
    }
    
    resetForm();
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
            <p className="text-gray-600 mt-2">Home Nursing Service Provider Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-secondary-green/20">
              <AvatarImage src="https://randomuser.me/api/portraits/women/68.jpg" alt="Provider" />
              <AvatarFallback>NP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">Nairobi Care</span>
              <span className="text-sm text-gray-500">Provider</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white border-0 shadow-md">
              <CardHeader className="border-b pb-3">
                <h2 className="text-lg font-semibold text-primary-blue">Dashboard Menu</h2>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-secondary-green font-medium">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Appointments
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    Reviews
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Card - Updated to match laboratory dashboard style */}
            <Card className="bg-white border-0 shadow-md">
              <CardHeader className="border-b pb-3">
                <h2 className="text-lg font-semibold text-primary-blue">Service Statistics</h2>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  {/* Active Services Card */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
                    <div className="flex items-center">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white/80">Active Services</p>
                        <p className="text-2xl font-bold">{services.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Appointments Card */}
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
                    <div className="flex items-center">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white/80">Appointments</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Patients Card */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
                    <div className="flex items-center">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white/80">Patients</p>
                        <p className="text-2xl font-bold">18</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notifications Card */}
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-white shadow-lg">
                    <div className="flex items-center">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white/80">Notifications</p>
                        <p className="text-2xl font-bold">7</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating Card */}
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 text-white shadow-lg">
                    <div className="flex items-center">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Star className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white/80">Average Rating</p>
                        <div className="flex items-center">
                          <p className="text-2xl font-bold mr-1">4.8</p>
                          <span className="text-sm">/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Service List */}
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
                    {showAddForm ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide Form
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add New Service
                      </>
                    )}
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
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Home Care Package" {...field} />
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
                                    <Input className="pl-10" placeholder="e.g., Nairobi Central" {...field} />
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
                                  <Input type="number" placeholder="e.g., 2500" {...field} />
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
                                    <Input className="pl-10" placeholder="e.g., Monday-Friday, 9AM-5PM" {...field} />
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
                                    <Input className="pl-10" placeholder="e.g., 5 years" {...field} />
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
                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                    id="service-image"
                                  />
                                  <label htmlFor="service-image" className="cursor-pointer">
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
                  <p className="text-gray-600">Manage your nursing services</p>
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
                          <TableRow key={service.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10 border border-gray-200">
                                  <AvatarImage src={service.image} alt={service.name} />
                                  <AvatarFallback>{service.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-900 max-w-[200px] truncate">{service.name}</div>
                                  <div className="text-xs text-gray-500 max-w-[200px] truncate">{service.description}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
                                  onClick={() => handleDeleteClick(service.id)}
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
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
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
