import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Clock, Award, Briefcase, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import doctorService from "@/services/doctorService";
import reviewService from "@/services/reviewService";
import { 
  getCurrentLocation, 
  findNearbyProviders, 
  formatDistance,
  type Coordinates 
} from "@/utils/locationUtils";

interface NearbyDoctor {
  id: number;
  name: string;
  specialty: string;
  location?: string;
  distance: number;
  rating: number;
  totalReviews: number;
  experience?: string;
  profile_image?: string;
  user: {
    name: string;
  };
}

const NearbyDoctorsSection = () => {
  const [nearbyDoctors, setNearbyDoctors] = useState<NearbyDoctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const findNearbyDoctors = async () => {
    setIsLoading(true);
    
    try {
      // Get user's current location
      const location = await getCurrentLocation();

      // Fetch all doctors
      const doctors = await doctorService.getAllDoctors();

      // Find nearby doctors
      const nearbyDoctorsData = await findNearbyProviders(
        doctors.map(d => ({ 
          ...d, 
          name: d.user?.name || 'Unknown Doctor'
        })),
        location,
        50 // 50km radius
      );

      // Fetch ratings for each nearby doctor
      const doctorsWithRatings = await Promise.all(
        nearbyDoctorsData.map(async (doctor) => {
          try {
            const reviewsData = await reviewService.getDoctorReviews(doctor.id);
            return {
              ...doctor,
              rating: reviewsData.average_rating || 0,
              totalReviews: reviewsData.total_reviews || 0,
            };
          } catch (error) {
            return {
              ...doctor,
              rating: 0,
              totalReviews: 0,
            };
          }
        })
      );

      setNearbyDoctors(doctorsWithRatings);
      setHasSearched(true);

      if (doctorsWithRatings.length === 0) {
        toast({
          title: "No doctors found",
          description: "No doctors found within 50km of your location.",
          variant: "default",
        });
      }

    } catch (error) {
      console.error('Error finding nearby doctors:', error);
      toast({
        title: "Location Error",
        description: "Unable to determine your location. Please enable location services.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--dark)]">Doctors near you</h2>
        <Link to="/patient-dashboard/consultation">
          <Button variant="link" className="text-primary-blue p-0">View All</Button>
        </Link>
      </div>
      
      {!hasSearched && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <Navigation className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="mb-4">Click "Find Nearby" to discover doctors near your location</p>
          <Button 
            onClick={findNearbyDoctors}
            disabled={isLoading}
            className="gap-2 bg-secondary-green hover:bg-secondary-green/80 text-white"
          >
            <Navigation className="h-4 w-4" />
            Find Nearby
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-blue" />
          <p className="text-gray-600">Finding doctors near you...</p>
        </div>
      )}

      {hasSearched && !isLoading && nearbyDoctors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No doctors found within 50km of your location</p>
        </div>
      )}

      {nearbyDoctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyDoctors.slice(0, 6).map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-3">
                    <Avatar className="h-12 w-12 border-2 border-primary-blue/10">
                      <AvatarImage src={doctor.profile_image} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-[var(--dark)]">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-1">
                          {renderStars(doctor.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({doctor.rating}) • {doctor.totalReviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {doctor.experience && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <p>{doctor.experience}</p>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p>{doctor.location || "Location not specified"}</p>
                        <p className="text-primary-blue font-medium">{formatDistance(doctor.distance)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 flex border-t border-gray-100">
                  <Link to={`/patient-dashboard/doctor/${doctor.id}`} className="flex-1">
                    <Button variant="ghost" className="w-full rounded-none text-primary-blue hover:text-primary-blue/80 hover:bg-blue-50 py-3 h-auto">
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/patient-dashboard/doctor/${doctor.id}`} className="flex-1">
                    <Button variant="ghost" className="w-full rounded-none text-secondary-green hover:text-secondary-green/80 hover:bg-green-50 py-3 h-auto border-l border-gray-100">
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyDoctorsSection;
