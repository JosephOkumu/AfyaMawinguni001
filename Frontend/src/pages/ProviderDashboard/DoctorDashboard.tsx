import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
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
  CreditCard,
  Activity,
  Users,
  Bell,
  CheckCircle,
  Settings,
  X,
} from "lucide-react";

interface DoctorProfileForm {
  name: string;
  specialty: string;
  description: string;
  location: string;
  availability: string;
  experience: string;
  physicalPrice: string;
  onlinePrice: string;
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
}

const DoctorDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("services");
  const [isAddingService, setIsAddingService] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  // Sample services
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: "1",
      name: "General Consultation",
      description: "Standard medical consultation for general health concerns.",
      price: 2500,
      duration: "30 minutes"
    },
    {
      id: "2",
      name: "Specialized Consultation",
      description: "In-depth consultation for specific medical conditions.",
      price: 4500,
      duration: "45 minutes"
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
      physicalPrice: "2500",
      onlinePrice: "2000",
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
      duration: ""
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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-primary-blue">AFYA</span>
              <span className="text-secondary-green"> MAWINGUNI</span>
            </h1>
            <p className="text-gray-600 mt-2">Doctor's Dashboard</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-full px-3 py-1.5 border border-gray-200 shadow-sm">
              <span className="text-sm font-medium mr-2">Dr. Medical Center</span>
              <Avatar className="h-8 w-8 border border-secondary-green/20">
                <AvatarImage src="https://randomuser.me/api/portraits/men/45.jpg" alt="Doctor" />
                <AvatarFallback>DR</AvatarFallback>
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
                  <DialogTitle className="text-xl font-semibold">Doctor Profile Settings</DialogTitle>
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogClose>
                </DialogHeader>
<div className="px-6 py-4">
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
                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                  <Input className="pl-10" placeholder="e.g., Nairobi Medical Center" {...field} />
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
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 15 years" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="qualifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Education</FormLabel>
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
                          name="physicalPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Physical Consultation Fee (KES)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g., 2500" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="onlinePrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Online Consultation Fee (KES)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g., 2000" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
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
                                  id="profile-photo-modal"
                                />
                                <label htmlFor="profile-photo-modal" className="cursor-pointer block">
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
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Service Statistics Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pending Appointments Card */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-white/80">Pending</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </div>

            {/* Completed Appointments Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-white/80">Completed</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </div>
            
            {/* Active Services Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-white/80">Active Services</p>
                  <p className="text-2xl font-bold">{services.length}</p>
                </div>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-white shadow-lg">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-lg">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-white/80">Total Revenue (KES)</p>
                  <p className="text-2xl font-bold">125,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              My Schedule
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <div className="space-y-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Today</h3>
                    <Badge variant="secondary" className="ml-2">3 appointments</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-blue-600">10:00 AM</div>
                      <div className="text-sm text-gray-700">John Doe</div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-blue-600">2:00 PM</div>
                      <div className="text-sm text-gray-700">Jane Smith</div>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                      Physical
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-blue-600">4:30 PM</div>
                      <div className="text-sm text-gray-700">Mike Johnson</div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Tomorrow's Schedule */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Tomorrow</h3>
                    <Badge variant="secondary" className="ml-2">2 appointments</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-blue-600">9:00 AM</div>
                      <div className="text-sm text-gray-700">Sarah Wilson</div>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                      Physical
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-blue-600">3:00 PM</div>
                      <div className="text-sm text-gray-700">David Brown</div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* This Week */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">This Week</h3>
                    <Badge variant="secondary" className="ml-2">5 more appointments</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-blue-600">Wed 11:00 AM</div>
                      <div className="text-sm text-gray-700">Emma Davis</div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-blue-600">Thu 1:30 PM</div>
                      <div className="text-sm text-gray-700">Robert Miller</div>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                      Physical
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-blue-600">Fri 10:00 AM</div>
                      <div className="text-sm text-gray-700">Lisa Anderson</div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      View 2 more appointments
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Next Week */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Next Week</h3>
                    <Badge variant="secondary" className="ml-2">8 appointments</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">8 appointments scheduled</p>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                      View Next Week Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Next Two Weeks */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Next Two Weeks</h3>
                    <Badge variant="secondary" className="ml-2">12 appointments</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">12 appointments scheduled</p>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                      View Extended Schedule
                    </Button>
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
