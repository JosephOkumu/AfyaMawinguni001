import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Activity,
  Plus,
  FileText,
  Home,
  TestTube,
  Star,
  X,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import appointmentService, {
  Appointment,
  LabAppointment,
  NursingAppointment,
} from "@/services/appointmentService";
import reviewService from "@/services/reviewService";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { VideoCall } from "@/components/VideoCall";

interface AppointmentsSectionProps {
  searchQuery?: string;
}

const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({ searchQuery = "" }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>(
    [],
  );
  const [labAppointments, setLabAppointments] = useState<LabAppointment[]>([]);
  const [nursingAppointments, setNursingAppointments] = useState<
    NursingAppointment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | LabAppointment | NursingAppointment | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallAppointment, setVideoCallAppointment] = useState<Appointment | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportAppointment, setSelectedReportAppointment] = useState<LabAppointment | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        // Fetch doctor, lab, and nursing appointments
        const [doctorAppts, labAppts, nursingAppts] = await Promise.all([
          appointmentService.getAppointments("patient"),
          appointmentService.getLabAppointments(),
          appointmentService.getNursingAppointments(),
        ]);

        setDoctorAppointments(doctorAppts);
        setLabAppointments(labAppts);
        setNursingAppointments(nursingAppts);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const getUpcomingAppointments = () => {
    const now = new Date();

    const upcomingDoctor = doctorAppointments.filter(
      (appt) =>
        new Date(appt.appointment_datetime) > now &&
        appt.status !== "cancelled",
    );

    const upcomingLab = labAppointments.filter(
      (appt) =>
        new Date(appt.appointment_datetime) > now &&
        appt.status !== "cancelled",
    );

    const upcomingNursing = nursingAppointments.filter(
      (appt) =>
        new Date(appt.scheduled_datetime) > now && appt.status !== "cancelled",
    );

    return [...upcomingDoctor, ...upcomingLab, ...upcomingNursing].sort(
      (a, b) => {
        const dateA = new Date(
          "scheduled_datetime" in a
            ? a.scheduled_datetime
            : a.appointment_datetime,
        );
        const dateB = new Date(
          "scheduled_datetime" in b
            ? b.scheduled_datetime
            : b.appointment_datetime,
        );
        return dateA.getTime() - dateB.getTime();
      },
    );
  };

  const getPastAppointments = () => {
    const now = new Date();

    const pastDoctor = doctorAppointments.filter(
      (appt) =>
        new Date(appt.appointment_datetime) <= now ||
        appt.status === "completed",
    );

    const pastLab = labAppointments.filter(
      (appt) =>
        new Date(appt.appointment_datetime) <= now ||
        appt.status === "completed",
    );

    const pastNursing = nursingAppointments.filter(
      (appt) =>
        new Date(appt.scheduled_datetime) <= now || appt.status === "completed",
    );

    return [...pastDoctor, ...pastLab, ...pastNursing].sort((a, b) => {
      const dateA = new Date(
        "scheduled_datetime" in a
          ? a.scheduled_datetime
          : a.appointment_datetime,
      );
      const dateB = new Date(
        "scheduled_datetime" in b
          ? b.scheduled_datetime
          : b.appointment_datetime,
      );
      return dateB.getTime() - dateA.getTime();
    });
  };

  const filterAppointments = (appointments: (Appointment | LabAppointment | NursingAppointment)[]) => {
    if (!searchQuery.trim()) {
      return appointments;
    }

    const query = searchQuery.toLowerCase().trim();

    return appointments.filter((appointment) => {
      // Search in appointment title
      const title = getAppointmentTitle(appointment).toLowerCase();
      if (title.includes(query)) return true;

      // Search in provider name and specialty
      const provider = getAppointmentProvider(appointment);
      const providerName = provider.name.toLowerCase();
      const providerSpecialty = provider.specialty.toLowerCase();
      if (providerName.includes(query) || providerSpecialty.includes(query)) return true;

      // Search in appointment status
      const status = appointment.status.toLowerCase();
      if (status.includes(query)) return true;

      // Search in appointment type for doctor appointments
      if ("doctor_id" in appointment && "type" in appointment) {
        const type = appointment.type.toLowerCase();
        if (type.includes(query) || (type === "virtual" && "online".includes(query))) return true;
      }

      // Search in reason for visit or symptoms for doctor appointments
      if ("doctor_id" in appointment) {
        const reason = (appointment.reason_for_visit || "").toLowerCase();
        const symptoms = (appointment.symptoms || "").toLowerCase();
        if (reason.includes(query) || symptoms.includes(query)) return true;
      }

      // Search in service name for nursing appointments
      if ("service_name" in appointment) {
        const serviceName = appointment.service_name.toLowerCase();
        if (serviceName.includes(query)) return true;
      }

      return false;
    });
  };

  const getAppointmentIcon = (
    appointment: Appointment | LabAppointment | NursingAppointment,
  ) => {
    if ("doctor_id" in appointment) {
      return <Activity className="h-6 w-6" />;
    } else if ("lab_provider_id" in appointment) {
      return <TestTube className="h-6 w-6" />;
    } else {
      return <Home className="h-6 w-6" />;
    }
  };

  const getAppointmentTitle = (
    appointment: Appointment | LabAppointment | NursingAppointment,
  ) => {
    if ("doctor_id" in appointment) {
      return appointment.reason_for_visit || "Doctor Consultation";
    } else if ("lab_provider_id" in appointment) {
      const labTests = appointment.labTests || appointment.lab_tests;
      const testCount = labTests?.length || appointment.test_ids?.length || 0;
      return `Lab Tests (${testCount} test${testCount !== 1 ? "s" : ""})`;
    } else {
      return appointment.service_name || "Home Nursing Service";
    }
  };

  const getAppointmentProvider = (
    appointment: Appointment | LabAppointment | NursingAppointment,
  ) => {
    if ("doctor_id" in appointment) {
      return {
        name: appointment.doctor?.user?.name || "Doctor",
        specialty: appointment.doctor?.specialty || "Doctor",
        image:
          appointment.doctor?.profile_image ||
          "https://randomuser.me/api/portraits/men/36.jpg",
      };
    } else if ("lab_provider_id" in appointment) {
      // Handle both camelCase and snake_case from Laravel
      const labProvider = appointment.labProvider || appointment.lab_provider;
      return {
        name:
          labProvider?.lab_name || labProvider?.user?.name || "Lab Provider",
        specialty: "Laboratory",
        image:
          labProvider?.profile_image ||
          "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=100&h=100&fit=crop&crop=center",
      };
    } else {
      // Handle nursing appointments
      const nursingProvider =
        appointment.nursingProvider || appointment.nursing_provider;
      return {
        name:
          nursingProvider?.provider_name ||
          nursingProvider?.user?.name ||
          "Nursing Provider",
        specialty: "Home Nursing",
        image:
          nursingProvider?.logo ||
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=center",
      };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "scheduled":
        return "text-black bg-green-100";
      case "pending":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-gray-600 bg-gray-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDisplayStatus = (status: string) => {
    const displayStatus = status === "scheduled" ? "confirmed" : status;
    return displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1);
  };

  const handleAppointmentClick = (appointment: Appointment | LabAppointment | NursingAppointment) => {
    // Only handle clicks for virtual doctor appointments with confirmed or pending status
    const isVirtualAppointment = "doctor_id" in appointment && "type" in appointment && appointment.type === "virtual";
    const hasValidStatus = appointment.status === "confirmed" || appointment.status === "pending" || appointment.status === "scheduled";
    
    if (isVirtualAppointment && hasValidStatus) {
      navigate(`/patient-dashboard/appointments/${appointment.id}`);
    }
  };

  const renderAppointmentCard = (
    appointment: Appointment | LabAppointment | NursingAppointment,
    isUpcoming: boolean = true,
    index: number = 0,
  ) => {
    const provider = getAppointmentProvider(appointment);
    const appointmentDate = new Date(
      "scheduled_datetime" in appointment
        ? appointment.scheduled_datetime
        : appointment.appointment_datetime,
    );

    const isClickable = "doctor_id" in appointment && 
                       appointment.type === "virtual" && 
                       (appointment.status === "confirmed" || appointment.status === "pending");
    
    // Debug log for isClickable
    if ("doctor_id" in appointment && appointment.type === "virtual") {
      console.log("Checking isClickable for appointment:", {
        id: appointment.id,
        doctor_id: appointment.doctor_id,
        type: appointment.type,
        status: appointment.status,
        isClickable: isClickable,
        isUpcoming: isUpcoming
      });
    }

    // Generate unique key based on appointment type and ID
    const getAppointmentType = () => {
      if ("doctor_id" in appointment) return "doctor";
      if ("lab_provider_id" in appointment) return "lab";
      return "nursing";
    };

    const uniqueKey = `${getAppointmentType()}-${appointment.id}-${appointmentDate.getTime()}-${index}`;

    return (
      <div
        key={uniqueKey}
        className={`border border-gray-200 rounded-lg p-4 flex items-start space-x-4 ${
          isClickable ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""
        }`}
        onClick={() => isClickable && handleAppointmentClick(appointment)}
      >
        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          {getAppointmentIcon(appointment)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="font-semibold">
              {getAppointmentTitle(appointment)}
            </h4>
            <span
              className={`text-sm font-medium px-2 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}
            >
              {getDisplayStatus(appointment.status)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {format(appointmentDate, "MMMM dd, yyyy")}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {format(appointmentDate, "h:mm a")}
          </p>
          <div className="mt-3 flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-100 mr-2 flex items-center justify-center text-white text-xs overflow-hidden">
              <img
                src={provider.image}
                alt={provider.name}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{provider.name}</p>
              <p className="text-xs text-gray-500">{provider.specialty}</p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex space-x-2">
          {isUpcoming ? (
            <>
              {/* Show View call button for virtual appointments with confirmed/pending status - regardless of upcoming status */}
              {(() => {
                const isVirtualAppointment = "doctor_id" in appointment && "type" in appointment && appointment.type === "virtual";
                const hasValidStatus = appointment.status === "confirmed" || appointment.status === "pending" || appointment.status === "scheduled";
                const shouldShowViewCall = isVirtualAppointment && hasValidStatus;
                
                return shouldShowViewCall ? (
                  <Button 
                    size="sm" 
                    className="text-xs bg-green-600 hover:bg-green-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Start Call clicked for appointment:", appointment);
                      setVideoCallAppointment(appointment as Appointment);
                      setShowVideoCall(true);
                      console.log("Video call state set:", { showVideoCall: true, appointmentId: appointment.id });
                    }}
                  >
                    <Video className="h-3 w-3 mr-1" />
                    View Call
                  </Button>
                ) : null;
              })()}
            </>
          ) : (
            <>
              {appointment.status === "completed" ? (
                <Button 
                  size="sm" 
                  className="text-xs bg-primary-blue hover:bg-secondary-green hover:text-white text-white border border-gray-300"
                  onClick={async () => {
                    setSelectedAppointment(appointment);
                    
                    // Check if user has already reviewed this provider
                    if ("doctor_id" in appointment) {
                      try {
                        const reviewsData = await reviewService.getDoctorReviews(appointment.doctor_id);
                        setHasAlreadyReviewed(reviewsData.current_user_reviewed);
                      } catch (error) {
                        setHasAlreadyReviewed(false);
                      }
                    } else if ("nursing_provider_id" in appointment) {
                      try {
                        const reviewsData = await reviewService.getNursingProviderReviews(appointment.nursing_provider_id);
                        setHasAlreadyReviewed(reviewsData.current_user_reviewed);
                      } catch (error) {
                        setHasAlreadyReviewed(false);
                      }
                    }
                    
                    setShowReviewModal(true);
                  }}
                >
                  Review
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className={`text-xs ${
                    "doctor_id" in appointment && 
                    "type" in appointment && appointment.type === "virtual" && 
                    (appointment.status === "confirmed" || appointment.status === "pending" || appointment.status === "scheduled")
                      ? "bg-primary-blue hover:bg-secondary-green hover:text-white text-white border border-gray-300"
                      : ""
                  }`}
                  variant={
                    "doctor_id" in appointment && 
                    "type" in appointment && appointment.type === "virtual" && 
                    (appointment.status === "confirmed" || appointment.status === "pending" || appointment.status === "scheduled")
                      ? undefined
                      : "outline"
                  }
                  onClick={(e) => {
                    // For virtual appointments with confirmed/pending status, navigate to video call
                    if ("doctor_id" in appointment && 
                        "type" in appointment && appointment.type === "virtual" && 
                        (appointment.status === "confirmed" || appointment.status === "pending" || appointment.status === "scheduled")) {
                      e.stopPropagation();
                      navigate(`/patient-dashboard/appointments/${appointment.id}`);
                    }
                    // For completed lab appointments, show report modal
                    else if ("lab_provider_id" in appointment && appointment.status === "completed") {
                      e.stopPropagation();
                      setSelectedReportAppointment(appointment as LabAppointment);
                      setShowReportModal(true);
                    }
                  }}
                >
                  {(() => {
                    const isVirtualAppointment = "doctor_id" in appointment && "type" in appointment && appointment.type === "virtual";
                    const hasValidStatus = appointment.status === "confirmed" || appointment.status === "pending" || appointment.status === "scheduled";
                    const shouldShowViewCall = isVirtualAppointment && hasValidStatus;
                    
                    return shouldShowViewCall ? "View call" :
                           "doctor_id" in appointment ? "View Report" :
                           "lab_provider_id" in appointment ? "View Report" : "View Care Notes";
                  })()}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin h-8 w-8 border border-gray-300 border-t-transparent rounded-full"></div>
          <span className="ml-2 text-gray-500">Loading appointments...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <Activity className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Error Loading Appointments</p>
            <p className="text-sm text-gray-600 mt-1">{error}</p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();

  const allAppointments = [...getUpcomingAppointments(), ...getPastAppointments()].sort((a, b) => {
    const dateA = new Date(
      "scheduled_datetime" in a
        ? a.scheduled_datetime
        : a.appointment_datetime,
    );
    const dateB = new Date(
      "scheduled_datetime" in b
        ? b.scheduled_datetime
        : b.appointment_datetime,
    );
    return dateB.getTime() - dateA.getTime();
  });

  const filteredAppointments = filterAppointments(allAppointments);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--dark)]">
          My Appointments
        </h2>
      </div>

      <div className="space-y-4">
        {searchQuery && (
          <div className="text-sm text-gray-600 mb-2">
            {filteredAppointments.length === 0 
              ? `No appointments found for "${searchQuery}"` 
              : `Found ${filteredAppointments.length} appointment${filteredAppointments.length !== 1 ? 's' : ''} for "${searchQuery}"`
            }
          </div>
        )}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No matching appointments" : "No appointments"}
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No appointments match your search for "${searchQuery}".`
                : "You don't have any appointments scheduled."
              }
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment, index) => {
            const now = new Date();
            const appointmentDate = new Date(
              "scheduled_datetime" in appointment
                ? appointment.scheduled_datetime
                : appointment.appointment_datetime,
            );
            const isUpcoming = appointmentDate > now && appointment.status !== "cancelled" && appointment.status !== "completed";
            
            // Debug log for virtual appointments
            if ("doctor_id" in appointment && appointment.type === "virtual") {
              console.log("Virtual appointment found:", {
                id: appointment.id,
                status: appointment.status,
                type: appointment.type,
                isUpcoming: isUpcoming,
                appointmentDate: appointmentDate,
                now: now
              });
            }
            return renderAppointmentCard(appointment, isUpcoming, index);
          })
        )}

        <div className="flex justify-center">
          <Link to="/patient-dashboard">
            <Button className="bg-primary-blue hover:bg-primary-blue/90">
              <Home className="h-4 w-4 mr-2" /> Go back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rate Your Experience</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedAppointment(null);
                  setRating(0);
                  setReviewText("");
                  setHasAlreadyReviewed(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Star Rating */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Rating</p>
              {hasAlreadyReviewed ? (
                <div className="text-red-600 text-sm font-medium">
                  You have already reviewed this {
                    "doctor_id" in selectedAppointment ? "doctor" : "nursing provider"
                  }. Only one review per {
                    "doctor_id" in selectedAppointment ? "doctor" : "nursing provider"
                  } is allowed.
                </div>
              ) : (
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Review (Optional)</p>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={hasAlreadyReviewed ? "Review already submitted" : "Share your experience..."}
                className={`w-full p-3 border rounded-lg resize-none focus:outline-none ${
                  hasAlreadyReviewed 
                    ? "border-red-300 bg-red-50 text-red-400 cursor-not-allowed" 
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                }`}
                rows={4}
                disabled={hasAlreadyReviewed}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedAppointment(null);
                  setRating(0);
                  setReviewText("");
                  setHasAlreadyReviewed(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedAppointment) return;
                  
                  setIsSubmittingReview(true);
                  try {
                    const reviewData: any = {
                      rating: rating,
                      review_text: reviewText || undefined
                    };

                    // Determine if it's a doctor appointment or nursing service
                    if ("doctor_id" in selectedAppointment) {
                      reviewData.appointment_id = selectedAppointment.id;
                    } else if ("nursing_provider_id" in selectedAppointment) {
                      reviewData.nursing_service_id = selectedAppointment.id;
                    }

                    await reviewService.submitReview(reviewData);
                    
                    // Close modal and reset form
                    setShowReviewModal(false);
                    setSelectedAppointment(null);
                    setRating(0);
                    setReviewText("");
                    setHasAlreadyReviewed(false);
                    
                    // Show success message (optional)
                    alert("Review submitted successfully!");
                  } catch (error: any) {
                    alert(error.message || "Failed to submit review");
                  } finally {
                    setIsSubmittingReview(false);
                  }
                }}
                disabled={rating === 0 || isSubmittingReview || hasAlreadyReviewed}
                className={`${
                  hasAlreadyReviewed 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-primary-blue hover:bg-primary-blue/90"
                }`}
              >
                {hasAlreadyReviewed 
                  ? "Already Reviewed" 
                  : isSubmittingReview 
                    ? "Submitting..." 
                    : "Submit Review"
                }
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Interface */}
      {videoCallAppointment && (
        <VideoCall
          isOpen={showVideoCall}
          onClose={() => {
            console.log("Closing video call");
            setShowVideoCall(false);
            setVideoCallAppointment(null);
          }}
          appointmentId={videoCallAppointment.id.toString()}
        />
      )}

      {/* Lab Report Modal */}
      {showReportModal && selectedReportAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Lab Test Report</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowReportModal(false);
                  setSelectedReportAppointment(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p><strong>Test:</strong> {selectedReportAppointment.reason_for_visit || "Laboratory Test"}</p>
                <p><strong>Date:</strong> {format(new Date(selectedReportAppointment.appointment_datetime), "MMM dd, yyyy")}</p>
                <p><strong>Status:</strong> <span className="text-green-600 font-medium">Completed</span></p>
              </div>

              {/* Report Preview Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Lab Test Report</p>
                <p className="text-xs text-gray-500">
                  {/* TODO: Replace with actual report filename from backend */}
                  Report_Lab_Test_{selectedReportAppointment.id}.pdf
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // TODO: Implement report preview functionality
                    alert("Report preview functionality will be implemented with backend integration");
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => {
                    // TODO: Implement report download functionality
                    alert("Report download functionality will be implemented with backend integration");
                  }}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default AppointmentsSection;
