import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Search,
  Bell,
  MessageSquare,
  Calendar,
  Package,
  LogOut,
  ShoppingCart,
  ChevronLeft,
  Star,
  Plus,
  Minus,
  ShieldCheck,
  CreditCard,
  Info,
} from "lucide-react";
import usePesapalPayment from "@/hooks/usePesapalPayment";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

interface MedicineType {
  id: number;
  name: string;
  price: number;
  pharmacy: string;
  pharmacyLogo: string;
  pharmacyInitials: string;
  rating: number;
  category: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  description: string;
  dosageAdult: string;
  dosageChildren: string;
  sideEffects: string[];
  form: string;
  manufacturer: string;
  imagePath: string;
}

// Use the pill image provided by the user
const commonMedicineImg =
  "/lovable-uploads/a05b3053-380f-4711-b032-bc48d1c082f0.png";

// Mock data for the medicine details
const medicineData: MedicineType[] = [
  {
    id: 1,
    name: "Turmeric Capsules",
    price: 250,
    pharmacy: "Natural Health Store",
    pharmacyLogo: "https://randomuser.me/api/portraits/women/2.jpg",
    pharmacyInitials: "NHS",
    rating: 4.8,
    category: "Anti-inflammatory",
    status: "In Stock",
    description:
      "Turmeric capsules contain curcumin, a powerful natural anti-inflammatory compound. Known for its potent antioxidant properties, turmeric has been used for centuries in traditional medicine to support joint health, reduce inflammation, and boost immune function. Our premium turmeric extract is standardized to contain 95% curcuminoids for maximum potency.",
    dosageAdult:
      "Take 1-2 capsules daily with meals, or as directed by your healthcare provider. For enhanced absorption, take with black pepper or a fat-containing meal.",
    dosageChildren:
      "Not recommended for children under 12 years. For children 12+ years, consult with a healthcare provider for appropriate dosage.",
    sideEffects: ["Mild stomach upset (rare)", "May interact with blood thinners", "Avoid during pregnancy"],
    form: "Capsules",
    manufacturer: "Natural Wellness Co.",
    imagePath: commonMedicineImg,
  },
  {
    id: 2,
    name: "Ginger Root Extract",
    price: 450,
    pharmacy: "Herbal Wellness",
    pharmacyLogo: "",
    pharmacyInitials: "HW",
    rating: 4.7,
    category: "Digestive Support",
    status: "In Stock",
    description:
      "Ginger root extract is a natural digestive aid with powerful anti-nausea properties. This concentrated extract supports healthy digestion, reduces motion sickness, and helps alleviate morning sickness. Rich in gingerols and shogaols, our ginger extract provides therapeutic benefits in an easy-to-take capsule form.",
    dosageAdult:
      "Take 1 capsule 2-3 times daily with meals. For motion sickness, take 1 capsule 30 minutes before travel.",
    dosageChildren:
      "For children 6+ years: 1/2 capsule daily with food. Consult healthcare provider before use in children.",
    sideEffects: ["Mild heartburn (rare)", "May interact with blood thinners", "Avoid with gallstones"],
    form: "Capsules",
    manufacturer: "Herbal Remedies Ltd.",
    imagePath: commonMedicineImg,
  },
  {
    id: 3,
    name: "Aloe Vera Gel Capsules",
    price: 350,
    pharmacy: "Natural Health Store",
    pharmacyLogo: "https://randomuser.me/api/portraits/women/2.jpg",
    pharmacyInitials: "NHS",
    rating: 4.5,
    category: "Skin Health",
    status: "Low Stock",
    description:
      "Aloe Vera gel capsules provide the healing benefits of pure aloe vera in convenient capsule form. Known for its soothing and healing properties, aloe vera supports digestive health, promotes skin healing from within, and provides natural anti-inflammatory benefits. Our capsules contain 100% pure inner leaf aloe vera gel.",
    dosageAdult:
      "Take 1-2 capsules daily with water, preferably on an empty stomach. For digestive support, take 30 minutes before meals.",
    dosageChildren:
      "For children 8+ years: 1 capsule daily with plenty of water. Not recommended for children under 8 years.",
    sideEffects: ["Mild laxative effect", "Stomach cramps (if taken in excess)", "Avoid during pregnancy"],
    form: "Capsules",
    manufacturer: "Pure Botanicals",
    imagePath: commonMedicineImg,
  },
  {
    id: 4,
    name: "Echinacea Immune Support",
    price: 550,
    pharmacy: "Organic Remedies",
    pharmacyLogo: "",
    pharmacyInitials: "OR",
    rating: 4.9,
    category: "Immune Support",
    status: "In Stock",
    description:
      "Echinacea immune support capsules contain premium purple coneflower extract, traditionally used to strengthen the immune system. This powerful herb helps the body's natural defenses against seasonal challenges and supports overall wellness. Our standardized extract ensures consistent potency and effectiveness.",
    dosageAdult: "Take 2 capsules daily with meals during seasonal challenges, or 1 capsule daily for maintenance.",
    dosageChildren:
      "For children 6+ years: 1 capsule daily with food. For children 2-5 years: consult healthcare provider.",
    sideEffects: ["Mild stomach upset (rare)", "Allergic reactions in sensitive individuals", "Avoid with autoimmune conditions"],
    form: "Capsules",
    manufacturer: "Immune Botanicals",
    imagePath: commonMedicineImg,
  },
  {
    id: 5,
    name: "Moringa Leaf Powder",
    price: 650,
    pharmacy: "Herbal Wellness",
    pharmacyLogo: "",
    pharmacyInitials: "HW",
    rating: 4.6,
    category: "Nutritional Support",
    status: "In Stock",
    description:
      "Moringa leaf powder is a nutrient-dense superfood packed with vitamins, minerals, and antioxidants. Known as the 'miracle tree,' moringa provides natural energy, supports immune function, and promotes overall wellness. Rich in vitamin C, iron, calcium, and protein, it's an excellent nutritional supplement for daily health maintenance.",
    dosageAdult:
      "Mix 1-2 teaspoons in water, juice, or smoothies daily. Can be taken with or without food.",
    dosageChildren:
      "For children 5+ years: 1/2 teaspoon daily mixed in food or drinks. Start with smaller amounts.",
    sideEffects: ["Mild laxative effect initially", "May lower blood pressure", "Generally well tolerated"],
    form: "Powder",
    manufacturer: "Superfood Naturals",
    imagePath: commonMedicineImg,
  },
  {
    id: 6,
    name: "Neem Leaf Extract",
    price: 450,
    pharmacy: "Natural Health Store",
    pharmacyLogo: "https://randomuser.me/api/portraits/women/2.jpg",
    pharmacyInitials: "NHS",
    rating: 4.7,
    category: "Blood Purifier",
    status: "In Stock",
    description:
      "Neem leaf extract is a traditional Ayurvedic herb known for its blood purifying and detoxifying properties. This powerful botanical supports healthy skin from within, promotes liver function, and helps maintain balanced blood sugar levels. Our standardized extract provides consistent therapeutic benefits.",
    dosageAdult: "Take 1-2 capsules daily with meals, or as directed by healthcare provider.",
    dosageChildren:
      "For children 10+ years: 1 capsule daily with food. Not recommended for children under 10 years.",
    sideEffects: ["Mild stomach upset if taken on empty stomach", "May lower blood sugar", "Avoid during pregnancy"],
    form: "Capsules",
    manufacturer: "Ayurvedic Botanicals",
    imagePath: commonMedicineImg,
  },
];

const MedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [medicine, setMedicine] = useState<MedicineType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("+254");

  // Pesapal payment hook
  const {
    initiatePayment: initiatePesapalPayment,
    isProcessing: pesapalProcessing,
    paymentStatus: pesapalPaymentStatus,
    resetPayment: resetPesapalPayment,
  } = usePesapalPayment({
    onSuccess: async (result) => {
      setIsProcessing(false);
      setIsPaymentSuccess(true);

      toast({
        title: "Order Placed Successfully!",
        description: "Your medicine order has been confirmed.",
        variant: "default",
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/patient-dashboard/orders");
      }, 2000);
    },
    onError: (error) => {
      setIsProcessing(false);
      console.error("Payment failed:", error);
    },
  });

  useEffect(() => {
    // Find the medicine by ID
    const foundMedicine = medicineData.find((med) => med.id === Number(id));
    if (foundMedicine) {
      setMedicine(foundMedicine);
    } else {
      // Redirect if medicine not found
      navigate("/patient-dashboard/medicines");
    }
  }, [id, navigate]);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} x ${medicine?.name} added to your cart.`,
    });
    // In a real application, you would update a cart state or context here
  };

  const proceedToCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const processPayment = async () => {
    // Validate phone number
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number for payment.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !medicine) {
      toast({
        title: "Missing Information",
        description: "User or medicine information is not available.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Both M-Pesa and Card options use Pesapal
      await initiatePesapalPayment({
        amount: medicine.price * quantity,
        email: user.email || "patient@example.com",
        phone_number: phoneNumber,
        first_name: user.name?.split(" ")[0] || "Patient",
        last_name: user.name?.split(" ").slice(1).join(" ") || "User",
        description: `Medicine order: ${medicine.name} x ${quantity}`,
        lab_provider_id: medicine.id, // Using medicine.id as reference
        patient_id: user.id,
      });
    } catch (error) {
      setIsProcessing(false);
      console.error("Pesapal payment initiation failed:", error);
    }
  };

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Navigation items for the horizontal navbar
  const navItems = [
    {
      icon: Calendar,
      label: "Appointments",
      path: "/patient-dashboard/appointments",
    },
    { icon: Package, label: "Orders", path: "/patient-dashboard/orders" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo & User Profile */}
          <div className="flex items-center gap-2">
            <Link to="/patient-dashboard">
              <div className="h-10 w-10 rounded-full bg-secondary-green/80 flex items-center justify-center text-white font-bold">
                AM
              </div>
            </Link>
            <Link to="/patient-dashboard">
              <span className="text-xl font-bold">
                <span className="text-primary-blue">ACESO</span>
                <span className="text-secondary-green"> HEALTH SOLUTIONS</span>
              </span>
            </Link>
          </div>


          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full border-none hover:bg-green-50"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full border-none hover:bg-green-50"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </Button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="font-medium text-sm">John Doe</span>
                <span className="text-xs text-gray-500">Patient</span>
              </div>
              <Avatar className="h-9 w-9 border-2 border-secondary-green/20">
                <AvatarImage
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-600"
            onClick={() => navigate("/patient-dashboard/medicines")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Medicines
          </Button>
        </div>

        {/* Medicine Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Medicine Image */}
          <Card className="md:col-span-1 bg-white overflow-hidden">
            <div className="h-64 bg-white flex items-center justify-center p-4">
              {medicine && (
                <img
                  src={medicine.imagePath}
                  alt={medicine.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110"
                />
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant={
                    medicine?.status === "In Stock"
                      ? "outline"
                      : medicine?.status === "Low Stock"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {medicine?.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Avatar className="h-8 w-8">
                  {medicine?.pharmacyLogo ? (
                    <AvatarImage
                      src={medicine.pharmacyLogo}
                      alt={medicine.pharmacy}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary-blue/10 text-primary-blue">
                    {medicine?.pharmacyInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-sm font-medium">
                    {medicine?.pharmacy}
                  </span>
                  <p className="text-xs text-gray-500">Verified Seller</p>
                </div>
                <ShieldCheck className="h-5 w-5 ml-auto text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Middle Column - Medicine Info */}
          <Card className="md:col-span-1 bg-white">
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 mb-4">
                Category: {medicine?.category}
              </div>
              <div className="text-2xl font-bold text-green-600 mb-6">
                KSh {medicine?.price}
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700 text-sm">{medicine?.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Form</p>
                    <p className="font-medium">{medicine?.form}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Manufacturer</p>
                    <p className="font-medium">{medicine?.manufacturer}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Dosage and Actions */}
          <Card className="md:col-span-1 bg-white">
            <CardContent className="p-6">
              <Tabs defaultValue="dosage">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="dosage">Dosage</TabsTrigger>
                  <TabsTrigger value="side-effects">Side Effects</TabsTrigger>
                </TabsList>
                <TabsContent value="dosage" className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">For Adults</h3>
                    <p className="text-sm text-gray-700">
                      {medicine?.dosageAdult}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">For Children</h3>
                    <p className="text-sm text-gray-700">
                      {medicine?.dosageChildren}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="side-effects">
                  <h3 className="font-medium mb-2">Possible Side Effects</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {medicine?.sideEffects.map((effect, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {effect}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-green-500 text-white hover:bg-green-600 border-none"
                    onClick={addToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>

                  {/* Quantity section moved here */}
                  <div className="flex items-center flex-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-md"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="h-8 px-4 flex items-center justify-center border-y border-input bg-white min-w-12 text-center">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-md"
                      onClick={increaseQuantity}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-md"
                  onClick={proceedToCheckout}
                >
                  Buy Now
                </Button>
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center">
                Use as directed. Consult a healthcare professional before use.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Payment Modal - Using the consistent payment style like doctor consultation page */}
      {isPaymentModalOpen && !isPaymentSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md mx-auto shadow-xl overflow-hidden border-none">
            <div className="bg-gradient-to-r from-primary-blue to-secondary-green text-white p-5">
              <h2 className="text-xl font-bold font-playfair">Checkout</h2>
              <p className="text-sm opacity-90">
                Complete your purchase securely
              </p>
            </div>
            <CardContent className="p-6">
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Product</span>
                  <span className="font-medium">{medicine?.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Quantity</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price</span>
                  <span>
                    KSh {medicine?.price} x {quantity}
                  </span>
                </div>
                <div className="flex justify-between font-bold mt-4 text-lg">
                  <span>Total</span>
                  <span className="text-green-600">
                    KSh {medicine?.price ? medicine.price * quantity : 0}
                  </span>
                </div>
              </div>

              <h3 className="font-medium mb-3">Select Payment Method</h3>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-2"
              >
                <div className="border rounded-lg p-4 flex items-center space-x-2">
                  <RadioGroupItem value="mpesa" id="mpesa" />
                  <Label
                    htmlFor="mpesa"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="bg-green-100 rounded-full p-1 mr-2">
                      <span className="text-green-600 font-bold text-xs">
                        M
                      </span>
                    </div>
                    M-Pesa
                  </Label>
                </div>
                <div className="border rounded-lg p-4 flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label
                    htmlFor="card"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="bg-blue-100 rounded-full p-1 mr-2">
                      <span className="text-blue-600 font-bold text-xs">C</span>
                    </div>
                    Credit/Debit Card
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "mpesa" && (
                <div className="mb-6">
                  <Label htmlFor="phone" className="mb-2 block font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+254722549387"
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    You will receive an M-Pesa prompt to complete the payment.
                  </p>
                  {pesapalPaymentStatus && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                      {pesapalPaymentStatus}
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="mb-6 space-y-4">
                  <div>
                    <Label
                      htmlFor="cardPhone"
                      className="mb-2 block font-medium"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="cardPhone"
                      type="tel"
                      placeholder="+254722549387"
                      value={phoneNumber || "+254722549387"}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-500">
                      Required for payment confirmation and notifications.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Secure Card Payment
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      You will be redirected to a secure payment page to
                      complete your card payment.
                    </p>
                    {pesapalPaymentStatus && (
                      <div className="mt-2 p-2 bg-white rounded text-sm text-blue-700">
                        {pesapalPaymentStatus}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary-blue to-secondary-green hover:brightness-90 text-white"
                  onClick={processPayment}
                  disabled={
                    isProcessing || pesapalProcessing || !phoneNumber.trim()
                  }
                >
                  {isProcessing || pesapalProcessing
                    ? "Processing..."
                    : "Make Payment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Success Modal */}
      {isPaymentSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md mx-auto shadow-xl overflow-hidden border-none">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2 font-playfair">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your order has been placed successfully.
              </p>

              <div className="bg-gray-50 p-5 rounded-lg mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-medium">
                    AM{Math.floor(10000 + Math.random() * 90000)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-medium text-green-600">
                    KSh {medicine?.price ? medicine.price * quantity : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium">Pesapal</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsPaymentSuccess(false);
                    setIsPaymentModalOpen(false);
                    navigate("/patient-dashboard/medicines");
                  }}
                >
                  Continue Shopping
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary-blue to-secondary-green hover:brightness-90 text-white"
                  onClick={() => {
                    setIsPaymentSuccess(false);
                    setIsPaymentModalOpen(false);
                    navigate("/patient-dashboard/orders");
                  }}
                >
                  View Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MedicineDetails;
