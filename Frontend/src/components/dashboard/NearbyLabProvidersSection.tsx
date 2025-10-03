import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Clock, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import labService from "@/services/labService";
import { 
  getCurrentLocation, 
  findNearbyProviders, 
  formatDistance,
  type Coordinates 
} from "@/utils/locationUtils";

interface NearbyLabProvider {
  id: number;
  name: string;
  lab_name: string;
  address: string;
  distance: number;
  profile_image?: string;
  average_rating?: number;
  operating_hours?: string;
  user: {
    name: string;
  };
}

const NearbyLabProvidersSection = () => {
  const [nearbyProviders, setNearbyProviders] = useState<NearbyLabProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const findNearbyLabProviders = async () => {
    setIsLoading(true);
    
    try {
      // Get user's current location
      const location = await getCurrentLocation();

      // Fetch all lab providers
      const providers = await labService.getAllLabProviders();

      // Find nearby providers
      const nearbyProvidersData = await findNearbyProviders(
        providers.map(p => ({ 
          ...p, 
          name: p.lab_name || 'Unknown Lab',
          location: p.address // Use address as location for geocoding
        })),
        location,
        50 // 50km radius
      );

      setNearbyProviders(nearbyProvidersData);
      setHasSearched(true);

      if (nearbyProvidersData.length === 0) {
        toast({
          title: "No lab providers found",
          description: "No lab providers found within 50km of your location.",
          variant: "default",
        });
      }

    } catch (error) {
      console.error('Error finding nearby lab providers:', error);
      toast({
        title: "Location Error",
        description: "Unable to determine your location. Please enable location services.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--dark)]">Lab providers near you</h2>
        <Link to="/patient-dashboard/lab-tests">
          <Button variant="link" className="text-primary-blue p-0">View All</Button>
        </Link>
      </div>
      
      {!hasSearched && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <Navigation className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="mb-4">Click "Find Nearby" to discover lab providers near your location</p>
          <Button 
            onClick={findNearbyLabProviders}
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
          <p className="text-gray-600">Finding lab providers near you...</p>
        </div>
      )}

      {hasSearched && !isLoading && nearbyProviders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No lab providers found within 50km of your location</p>
        </div>
      )}

      {nearbyProviders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyProviders.slice(0, 6).map((provider) => (
            <Card key={provider.id} className="overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                      {provider.profile_image ? (
                        <AvatarImage
                          src={provider.profile_image}
                          alt={provider.lab_name}
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary-blue/10 text-primary-blue">
                        {provider.lab_name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">
                          {provider.lab_name}
                        </h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1 font-medium">
                            {provider.average_rating || 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600 text-sm mt-1 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <div>
                          <p>{provider.address}</p>
                          <p className="text-primary-blue font-medium">{formatDistance(provider.distance)}</p>
                        </div>
                      </div>

                      {provider.operating_hours && (
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <Clock className="h-3 w-3 mr-1" />
                          <p>{provider.operating_hours}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-2 mt-3">
                        <div>
                          <div className="text-gray-500">
                            Patients served
                          </div>
                          <div className="font-medium">
                            {Math.floor(Math.random() * 10000) + 1000}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 flex border-t border-gray-100">
                  <Link to={`/patient-dashboard/lab-provider/${provider.id}`} className="flex-1">
                    <Button variant="ghost" className="w-full rounded-none text-primary-blue hover:text-primary-blue/80 hover:bg-blue-50 py-3 h-auto">
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/patient-dashboard/lab-provider/${provider.id}`} className="flex-1">
                    <Button variant="ghost" className="w-full rounded-none text-secondary-green hover:text-secondary-green/80 hover:bg-green-50 py-3 h-auto border-l border-gray-100">
                      Order Tests
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

export default NearbyLabProvidersSection;
