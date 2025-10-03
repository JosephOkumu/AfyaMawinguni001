import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Clock, Award, Briefcase, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import nursingService from "@/services/nursingService";
import reviewService from "@/services/reviewService";
import { 
  getCurrentLocation, 
  findNearbyProviders, 
  formatDistance,
  type Coordinates 
} from "@/utils/locationUtils";

interface NearbyNursingProvider {
  id: number;
  name: string;
  provider_name: string;
  location?: string;
  distance: number;
  rating: number;
  totalReviews: number;
  qualifications?: string;
  services_offered?: string;
  logo?: string;
  user: {
    name: string;
  };
}

const NearbyHomeNursingSection = () => {
  const [nearbyProviders, setNearbyProviders] = useState<NearbyNursingProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const findNearbyNursingProviders = async () => {
    setIsLoading(true);
    
    try {
      // Get user's current location
      const location = await getCurrentLocation();

      // Fetch all nursing providers
      const providers = await nursingService.getAllNursingProviders();

      // Find nearby providers
      const nearbyProvidersData = await findNearbyProviders(
        providers.map(p => ({ 
          ...p, 
          name: p.provider_name || p.user?.name || 'Unknown Provider'
        })),
        location,
        50 // 50km radius
      );

      // Fetch ratings for each nearby provider
      const providersWithRatings = await Promise.all(
        nearbyProvidersData.map(async (provider) => {
          try {
            const reviewsData = await reviewService.getNursingProviderReviews(provider.id);
            return {
              ...provider,
              rating: reviewsData.average_rating || 0,
              totalReviews: reviewsData.total_reviews || 0,
            };
          } catch (error) {
            return {
              ...provider,
              rating: provider.average_rating || 0,
              totalReviews: 0,
            };
          }
        })
      );

      setNearbyProviders(providersWithRatings);
      setHasSearched(true);

      if (providersWithRatings.length === 0) {
        toast({
          title: "No nursing providers found",
          description: "No nursing providers found within 50km of your location.",
          variant: "default",
        });
      }

    } catch (error) {
      console.error('Error finding nearby nursing providers:', error);
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

  // Parse specialties from services_offered or qualifications
  const getSpecialties = (provider: NearbyNursingProvider) => {
    const services = provider.services_offered || provider.qualifications || '';
    return services.split(',').slice(0, 2).map(s => s.trim()).filter(Boolean);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--dark)]">Home Nursing near you</h2>
        <Link to="/patient-dashboard/nursing">
          <Button variant="link" className="text-primary-blue p-0">View All</Button>
        </Link>
      </div>
      
      {!hasSearched && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <Navigation className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="mb-4">Click "Find Nearby" to discover nursing providers near your location</p>
          <Button 
            onClick={findNearbyNursingProviders}
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
          <p className="text-gray-600">Finding nursing providers near you...</p>
        </div>
      )}

      {hasSearched && !isLoading && nearbyProviders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No nursing providers found within 50km of your location</p>
        </div>
      )}

      {nearbyProviders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyProviders.slice(0, 6).map((provider) => (
            <Card key={provider.id} className="overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-3">
                    <Avatar className="h-12 w-12 border-2 border-secondary-green/10">
                      <AvatarImage src={provider.logo} alt={provider.name} />
                      <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-[var(--dark)]">{provider.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-1">
                          {renderStars(provider.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({provider.rating}) • {provider.totalReviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3 flex flex-wrap gap-1">
                    {getSpecialties(provider).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-50 text-secondary-green hover:bg-green-100">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p>{provider.location || "Location not specified"}</p>
                        <p className="text-primary-blue font-medium">{formatDistance(provider.distance)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 flex border-t border-gray-100">
                  <Link to={`/patient-dashboard/nursing/${provider.id}`} className="flex-1">
                    <Button variant="ghost" className="w-full rounded-none text-primary-blue hover:text-primary-blue/80 hover:bg-blue-50 py-3 h-auto">
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/patient-dashboard/nursing/${provider.id}`} className="flex-1">
                    <Button variant="ghost" className="w-full rounded-none text-secondary-green hover:text-secondary-green/80 hover:bg-green-50 py-3 h-auto border-l border-gray-100">
                      Book Service
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

export default NearbyHomeNursingSection;
