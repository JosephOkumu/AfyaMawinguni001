import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import doctorService, { Doctor } from "@/services/doctorService";
import reviewService from "@/services/reviewService";

const defaultDoctorImage = "/lovable-uploads/a05b3053-380f-4711-b032-bc48d1c082f0.png";

const DoctorCard = ({ 
  doctor, 
  rating 
}: { 
  doctor: Doctor; 
  rating: number;
}) => {
  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-3 w-3 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-3 w-3 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
    }

    return stars;
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img 
          src={doctor.profile_image || defaultDoctorImage} 
          alt={doctor.user.name} 
          className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center text-xs font-medium">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
          {rating.toFixed(1)}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-primary-blue">{doctor.user.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
        
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <MapPin className="h-3 w-3 mr-1" />
          {doctor.location || "Location not specified"}
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex mr-1">
            {renderStars(rating)}
          </div>
          <span className="text-sm text-gray-600">
            ({rating.toFixed(1)})
          </span>
        </div>
        
        <Link to={`/patient-dashboard/doctor/${doctor.id}`}>
          <Button variant="outline" size="sm" className="w-full border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white">
            Book Appointment
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const TopDoctorsSection = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorRatings, setDoctorRatings] = useState<{[key: number]: {average_rating: number, total_reviews: number}}>({});
  const [loading, setLoading] = useState(true);

  // Fetch doctors and their ratings from backend
  useEffect(() => {
    const fetchDoctorsAndRatings = async () => {
      try {
        setLoading(true);
        const doctorsData = await doctorService.getAllDoctors();
        
        // Fetch ratings for each doctor
        const ratingsPromises = doctorsData.map(async (doctor) => {
          try {
            const reviewsData = await reviewService.getDoctorReviews(doctor.id);
            return {
              doctorId: doctor.id,
              average_rating: reviewsData.average_rating,
              total_reviews: reviewsData.total_reviews
            };
          } catch (error) {
            return {
              doctorId: doctor.id,
              average_rating: 0,
              total_reviews: 0
            };
          }
        });
        
        const ratingsResults = await Promise.all(ratingsPromises);
        const ratingsMap = ratingsResults.reduce((acc, rating) => {
          acc[rating.doctorId] = {
            average_rating: rating.average_rating,
            total_reviews: rating.total_reviews
          };
          return acc;
        }, {} as {[key: number]: {average_rating: number, total_reviews: number}});
        
        setDoctorRatings(ratingsMap);
        
        // Sort doctors by rating (highest first) and take top 4
        const sortedDoctors = doctorsData
          .sort((a, b) => {
            const ratingA = ratingsMap[a.id]?.average_rating || 0;
            const ratingB = ratingsMap[b.id]?.average_rating || 0;
            return ratingB - ratingA;
          })
          .slice(0, 4);
        
        setDoctors(sortedDoctors);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorsAndRatings();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[var(--dark)]">Top Rated Doctors</h2>
          <Link to="/patient-dashboard/consultation">
            <Button variant="link" className="text-primary-blue p-0">View All</Button>
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading top doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--dark)]">Top Rated Doctors</h2>
        <Link to="/patient-dashboard/consultation">
          <Button variant="link" className="text-primary-blue p-0">View All</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard 
            key={doctor.id}
            doctor={doctor}
            rating={doctorRatings[doctor.id]?.average_rating || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default TopDoctorsSection;
