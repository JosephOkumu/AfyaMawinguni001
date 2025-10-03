import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, 
  Star, 
  Clock, 
  Award, 
  Briefcase, 
  TestTube,
  Stethoscope,
  Heart,
  Loader2,
  AlertCircle,
  Navigation
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import doctorService from "@/services/doctorService";
import nursingService from "@/services/nursingService";
import labService from "@/services/labService";
import { 
  getCurrentLocation, 
  findNearbyProviders, 
  formatDistance,
  type Coordinates 
} from "@/utils/locationUtils";

interface NearbyProvider {
  id: number;
  name: string;
  type: 'doctor' | 'nursing' | 'lab';
  rating?: number;
  specialties?: string[];
  experience?: string;
  location?: string;
  availability?: string;
  distance: number;
  image?: string;
  operating_hours?: string;
}

const NearbyProvidersSection = () => {
  const [nearbyProviders, setNearbyProviders] = useState<NearbyProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get user location and find nearby providers
  const findNearbyProvidersHandler = async () => {
    setIsLoading(true);
    setLocationError(null);
    
    try {
      // Get user's current location
      const location = await getCurrentLocation();
      setUserLocation(location);

      // Fetch all providers
      const [doctors, nursingProviders, labProviders] = await Promise.all([
        doctorService.getAllDoctors(),
        nursingService.getAllNursingProviders(),
        labService.getAllLabProviders(),
      ]);

      // Find nearby providers for each type
      const nearbyDoctors = await findNearbyProviders(
        doctors.map(d => ({ 
          ...d, 
          type: 'doctor' as const,
          name: d.user?.name || 'Unknown Doctor'
        })),
        location,
        50 // 50km radius
      );

      const nearbyNursing = await findNearbyProviders(
        nursingProviders.map(n => ({ 
          ...n, 
          type: 'nursing' as const,
          name: n.provider_name || 'Unknown Provider'
        })),
        location,
        50
      );

      const nearbyLabs = await findNearbyProviders(
        labProviders.map(l => ({ 
          ...l, 
          type: 'lab' as const,
          name: l.lab_name || 'Unknown Lab'
        })),
        location,
        50
      );

      // Combine and sort all nearby providers
      const allNearbyProviders: NearbyProvider[] = [
        ...nearbyDoctors.map(d => ({ ...d, type: 'doctor' as const })),
        ...nearbyNursing.map(n => ({ ...n, type: 'nursing' as const })),
        ...nearbyLabs.map(l => ({ ...l, type: 'lab' as const })),
      ].sort((a, b) => a.distance - b.distance);

      setNearbyProviders(allNearbyProviders);

      if (allNearbyProviders.length === 0) {
        toast({
          title: "No providers found",
          description: "No healthcare providers found within 50km of your location.",
          variant: "default",
        });
      }

    } catch (error) {
      console.error('Error finding nearby providers:', error);
      setLocationError(
        error instanceof GeolocationPositionError 
          ? getLocationErrorMessage(error.code)
          : 'Unable to determine your location. Please enable location services.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return 'Location access denied. Please enable location services to find nearby providers.';
      case 2:
        return 'Location unavailable. Please check your internet connection.';
      case 3:
        return 'Location request timed out. Please try again.';
      default:
        return 'Unable to determine your location.';
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'doctor':
        return <Stethoscope className="h-4 w-4" />;
      case 'nursing':
        return <Heart className="h-4 w-4" />;
      case 'lab':
        return <TestTube className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getProviderRoute = (provider: NearbyProvider): string => {
    switch (provider.type) {
      case 'doctor':
        return `/patient-dashboard/consultation/${provider.id}`;
      case 'nursing':
        return `/patient-dashboard/nursing/${provider.id}`;
      case 'lab':
        return `/patient-dashboard/lab-tests/${provider.id}`;
      default:
        return '#';
    }
  };

  const getProviderTypeLabel = (type: string): string => {
    switch (type) {
      case 'doctor':
        return 'Doctor';
      case 'nursing':
        return 'Nursing Provider';
      case 'lab':
        return 'Lab Provider';
      default:
        return 'Provider';
    }
  };

  const renderProvidersByType = (type: 'doctor' | 'nursing' | 'lab', title: string) => {
    const providers = nearbyProviders.filter(p => p.type === type);
    
    if (providers.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="flex flex-col items-center gap-2">
            {getProviderIcon(type)}
            <p className="text-gray-500 text-sm">
              No {title.toLowerCase()} found near you
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.slice(0, 6).map((provider) => (
          <Card key={`${provider.type}-${provider.id}`} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={provider.image} alt={provider.name} />
                  <AvatarFallback>
                    {provider.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">{provider.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {getProviderIcon(provider.type)}
                      <span className="ml-1">{getProviderTypeLabel(provider.type)}</span>
                    </Badge>
                  </div>
                  
                  {provider.rating && (
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{provider.rating}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Navigation className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">
                      {formatDistance(provider.distance)}
                    </span>
                  </div>

                  {provider.specialties && provider.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {provider.specialties.slice(0, 2).map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Link to={getProviderRoute(provider)}>
                    <Button size="sm" className="w-full text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-blue" />
              Nearby Healthcare Providers
            </h2>
            <p className="text-gray-600 text-sm">
              Find doctors, nursing providers, and labs near your location
            </p>
          </div>
          <Button 
            onClick={findNearbyProvidersHandler}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            {isLoading ? 'Finding...' : 'Find Nearby'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {locationError && (
          <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">{locationError}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
              <p className="text-gray-600">Finding healthcare providers near you...</p>
            </div>
          </div>
        )}

        {!isLoading && nearbyProviders.length === 0 && !locationError && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Find Healthcare Providers Near You
            </h3>
            <p className="text-gray-500 mb-4">
              Click "Find Nearby" to discover doctors, nursing providers, and labs in your area
            </p>
          </div>
        )}

        {!isLoading && nearbyProviders.length > 0 && (
          <div className="space-y-8">
            {/* Doctors Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                Doctors Near You
              </h3>
              {renderProvidersByType('doctor', 'Doctors')}
            </div>

            {/* Nursing Providers Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Nursing Providers Near You
              </h3>
              {renderProvidersByType('nursing', 'Nursing Providers')}
            </div>

            {/* Lab Providers Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TestTube className="h-5 w-5 text-green-600" />
                Lab Providers Near You
              </h3>
              {renderProvidersByType('lab', 'Lab Providers')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearbyProvidersSection;
