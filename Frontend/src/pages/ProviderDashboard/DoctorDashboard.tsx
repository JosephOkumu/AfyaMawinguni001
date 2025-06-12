import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Save, 
  Image as ImageIcon, 
  MapPin, 
  Clock, 
  Star, 
  FileText, 
  Stethoscope, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar,
  Heart,
  Shield,
  CreditCard
} from "lucide-react";

interface DoctorProfileForm {
  name: string;
  specialty: string;
  description: string;
  location: string;
  availability: string;
  experience: string;
  price: string;
  image: File | null;
  qualifications: string;
  languages: string;
  acceptsInsurance: boolean;
  consultationModes: string[];
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isActive: boolean;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  requiresPrescription: boolean;
}

const DoctorDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isAddingService, setIsAddingService] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  
  // Sample services
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: "1",
      name: "General Consultation",
      description: "Standard medical consultation for general health concerns.",
      price: 2500,
      duration: "30 minutes",
      requiresPrescription: false
    },
    {
      id: "2",
      name: "Specialized Consultation",
      description: "In-depth consultation for specific medical conditions.",
      price: 4500,
      duration: "45 minutes",
      requiresPrescription: false
    }
  ]);

  // Sample subscription plans
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: "1",
      name: "Basic Care",
      price: 1500,
      description: "Monthly subscription for basic healthcare needs",
      features: [
        "10% discount on all consultations",
        "Priority scheduling",
        "24/7 chat support"
      ],
      isActive: true
    },
    {
      id: "2",
      name: "Premium Care",
      price: 4500,
      description: "Comprehensive healthcare subscription with maximum benefits",
      features: [
        "25% discount on all consultations",
        "Same-day appointments",
        "Free medication delivery",
        "Unlimited video consultations"
      ],
      isActive: true
    }
  ]);

  // Form for doctor profile
  const profileForm = useForm<DoctorProfileForm>({
    defaultValues: {
      name: "Dr. John Doe",
      specialty: "Cardiologist",
      description: "Experienced cardiologist specializing in preventive cardiac care and heart disease management.",
      location: "Nairobi Medical Center, 3rd Floor",
      availability: "Mon-Fri, 9AM-5PM",
      experience: "15 years",
      price: "2500",
      image: null,
      qualifications: "MD, Cardiology - University of Nairobi\nFellowship in Interventional Cardiology - Kenyatta National Hospital\nMember of African Cardiology Association",
      languages: "English, Swahili",
      acceptsInsurance: true,
      consultationModes: ["In-person", "Video", "Chat"]
    }
  });

  // Form for service management
  const serviceForm = useForm<ServiceItem>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: "",
      requiresPrescription: false
    }
  });

  // Form for subscription plan
  const subscriptionForm = useForm<SubscriptionPlan>({
    defaultValues: {
      id: "",
      name: "",
      price: 0,
      description: "",
      features: [],
      isActive: true
    }
  });

  const onProfileSubmit = async (data: DoctorProfileForm) => {
    console.log("Profile data:", data);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const onAddService = (data: ServiceItem) => {
    if (isEditingService && currentServiceId) {
      // Update existing service
      setServices(services.map(service => 
        service.id === currentServiceId ? { ...data, id: currentServiceId } : service
      ));
      toast({
        title: "Service updated",
        description: "The service has been updated successfully.",
      });
    } else {
      // Add new service
      const newService = {
        ...data,
        id: Math.random().toString(36).substring(2, 9)
      };
      setServices([...services, newService]);
      toast({
        title: "Service added",
        description: "New service has been added successfully.",
      });
    }
    serviceForm.reset();
    setIsAddingService(false);
    setIsEditingService(false);
    setCurrentServiceId(null);
  };

  const editService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      serviceForm.reset(service);
      setCurrentServiceId(serviceId);
      setIsEditingService(true);
      setIsAddingService(true);
    }
  };

  const deleteService = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
    toast({
      title: "Service deleted",
      description: "The service has been removed.",
    });
  };

  const onAddSubscriptionPlan = (data: SubscriptionPlan) => {
    const newPlan = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      features: data.description.split('\n').filter(item => item.trim() !== '')
    };
    setSubscriptionPlans([...subscriptionPlans, newPlan]);
    toast({
      title: "Subscription plan added",
      description: "New subscription plan has been added successfully.",
    });
    subscriptionForm.reset();
    setShowSubscriptionForm(false);
  };

  const toggleSubscriptionStatus = (planId: string) => {
    setSubscriptionPlans(
      subscriptionPlans.map(plan => 
        plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan
      )
    );
    toast({
      title: "Plan status updated",
      description: `The plan has been ${subscriptionPlans.find(p => p.id === planId)?.isActive ? 'deactivated' : 'activated'}.`,
    });
  };

  const deleteSubscriptionPlan = (planId: string) => {
    setSubscriptionPlans(subscriptionPlans.filter(plan => plan.id !== planId));
    toast({
      title: "Subscription plan deleted",
      description: "The subscription plan has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-primary-blue">AFYA</span>
            <span className="text-secondary-green"> MAWINGUNI</span>
          </h1>
          <p className="text-gray-600 mt-2">Doctor's Dashboard</p>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span>My Profile</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>My Services</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Update Form */}
              <Card className="md:col-span-2">
                <CardHeader className="border-b pb-4">
                  <h2 className="text-xl font-semibold">Update Profile</h2>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Dr. John Doe" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="specialty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specialty</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                  <Input className="pl-10" placeholder="e.g., Cardiologist" {...field} />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professional Summary</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Brief description of your medical practice..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="qualifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qualifications</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List your medical qualifications and certifications..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Practice Location</FormLabel>
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
                          control={profileForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Consultation Fee (KES)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g., 2500" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                  <Input className="pl-10" placeholder="e.g., Mon-Fri, 9AM-5PM" {...field} />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years of Experience</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Star className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                  <Input className="pl-10" placeholder="e.g., 15 years" {...field} />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="languages"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Languages Spoken</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., English, Swahili" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="acceptsInsurance"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Accept Insurance</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Enable this if you accept health insurance payments.
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Photo</FormLabel>
                            <FormControl>
                              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary-blue transition-colors">
                                <Input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => field.onChange(e.target.files?.[0])}
                                  id="profile-photo"
                                />
                                <label htmlFor="profile-photo" className="cursor-pointer block">
                                  <div className="flex flex-col items-center gap-2">
                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                      Drop an image here or click to upload
                                    </span>
                                  </div>
                                </label>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-4">
                        <Button type="submit" className="gap-2">
                          <Save className="h-4 w-4" />
                          Save Profile
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Stats and Quick Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="border-b pb-4">
                    <h2 className="text-lg font-semibold">Practice Statistics</h2>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Patients</span>
                        <span className="font-semibold">142</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Rating</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold ml-1">4.9</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Reviews</span>
                        <span className="font-semibold">98</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Appointments</span>
                        <span className="font-semibold">24 upcoming</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="border-b pb-4">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Calendar className="h-4 w-4" />
                        View Appointments
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Star className="h-4 w-4" />
                        View Reviews
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setActiveTab("services")}>
                        <FileText className="h-4 w-4" />
                        Manage Services
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-xl font-semibold">My Services</h2>
                  <Button 
                    onClick={() => {
                      if (isAddingService) {
                        setIsAddingService(false);
                        setIsEditingService(false);
                        serviceForm.reset();
                      } else {
                        setIsAddingService(true);
                        setIsEditingService(false);
                        serviceForm.reset({
                          name: "",
                          description: "",
                          price: 0,
                          duration: "",
                          requiresPrescription: false
                        });
                      }
                    }}
                    className="gap-2"
                  >
                    {isAddingService ? (
                      <>Hide Form</>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add New Service
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  {isAddingService && (
                    <div className="mb-8 bg-gray-50 p-4 rounded-lg border">
                      <h3 className="font-medium mb-4">
                        {isEditingService ? "Edit Service" : "Add New Service"}
                      </h3>
                      <Form {...serviceForm}>
                        <form onSubmit={serviceForm.handleSubmit(onAddService)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={serviceForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Service Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., General Consultation" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={serviceForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price (KES)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="e.g., 2500" 
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={serviceForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe the service..." 
                                    className="h-24"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={serviceForm.control}
                              name="duration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duration</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., 30 minutes" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={serviceForm.control}
                              name="requiresPrescription"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 space-y-0">
                                  <div className="space-y-0.5">
                                    <FormLabel>Requires Prescription</FormLabel>
                                    <p className="text-xs text-muted-foreground">
                                      Patient will need to upload a prescription
                                    </p>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                setIsAddingService(false);
                                setIsEditingService(false);
                                serviceForm.reset();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              {isEditingService ? "Update Service" : "Add Service"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  )}

                  {/* Services List */}
                  <div className="space-y-4">
                    {services.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No services added yet. Click the button above to add a new service.
                      </div>
                    ) : (
                      services.map((service) => (
                        <div 
                          key={service.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{service.name}</h3>
                              {service.requiresPrescription && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  Requires Prescription
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-green-600 font-medium">KES {service.price.toLocaleString()}</span>
                              <span className="text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {service.duration}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-end md:self-center">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => editService(service.id)}
                              className="h-8 gap-1"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => deleteService(service.id)}
                              className="h-8 gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample appointments - would be dynamic in a real application */}
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">John Doe</h3>
                          <p className="text-sm text-gray-600">General Consultation</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="h-3.5 w-3.5 text-gray-500" />
                            <span className="text-sm">Today, 2:30 PM</span>
                          </div>
                        </div>
                      </div>
                      <Badge>Upcoming</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
                          <AvatarFallback>MW</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">Mary Wilson</h3>
                          <p className="text-sm text-gray-600">General Consultation</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="h-3.5 w-3.5 text-gray-500" />
                            <span className="text-sm">Tomorrow, 10:00 AM</span>
                          </div>
                        </div>
                      </div>
                      <Badge>Upcoming</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
