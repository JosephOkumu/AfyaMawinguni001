import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import pesapalService from "@/services/pesapalService";
import appointmentService from "@/services/appointmentService";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Try different parameter names that Pesapal might use
  const merchantReference =
    searchParams.get("merchant_reference") ||
    searchParams.get("OrderMerchantReference") ||
    searchParams.get("merchantReference");
  const orderTrackingId =
    searchParams.get("OrderTrackingId") ||
    searchParams.get("order_tracking_id");

  useEffect(() => {
    // Break out of iframe if we're inside one
    if (window.self !== window.top) {
      window.top!.location.href = window.location.href;
      return;
    }

    const verifyPaymentAndRedirect = async () => {
      console.log("=== PAYMENT SUCCESS DEBUG ===");
      console.log("Current URL:", window.location.href);
      console.log(
        "All URL parameters:",
        Object.fromEntries(searchParams.entries()),
      );

      if (!merchantReference && !orderTrackingId) {
        // Try to get merchant reference from localStorage as fallback
        const keys = Object.keys(localStorage);
        const bookingKey = keys.find(
          (key) =>
            key.startsWith("lab_booking_") ||
            key.startsWith("nursing_booking_") ||
            key.startsWith("doctor_booking_"),
        );

        if (bookingKey) {
          const extractedRef = bookingKey.replace(
            /^(lab|nursing|doctor)_booking_/,
            "",
          );
          console.log(
            "Found merchant reference in localStorage:",
            extractedRef,
          );
          await handleSuccessfulPayment(extractedRef);
          return;
        }

        setError("Payment reference not found");
        setLoading(false);
        return;
      }

      let currentMerchantRef = merchantReference;

      try {
        console.log("Verifying payment with reference:", currentMerchantRef);

        let statusResponse;

        try {
          statusResponse =
            await pesapalService.getPaymentStatus(currentMerchantRef);
        } catch (error) {
          if (orderTrackingId) {
            const response = await fetch(
              `/api/payments/pesapal/status-by-tracking/${orderTrackingId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
              },
            );
            if (response.ok) {
              statusResponse = await response.json();
              if (statusResponse.merchant_reference) {
                currentMerchantRef = statusResponse.merchant_reference;
              }
            } else {
              throw error;
            }
          } else {
            throw error;
          }
        }

        if (pesapalService.isPaymentSuccessful(statusResponse.payment_status)) {
          await handleSuccessfulPayment(currentMerchantRef);
        } else if (
          pesapalService.isPaymentFailed(statusResponse.payment_status)
        ) {
          setError("Payment was not successful. Please try again.");
          setLoading(false);
        } else {
          // Payment still pending, check again in 3 seconds
          setTimeout(verifyPaymentAndRedirect, 3000);
          return;
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setError("Unable to verify payment status. Please contact support.");
        setLoading(false);
      }
    };

    const handleSuccessfulPayment = async (merchantRef: string) => {
      try {
        // Get booking data from localStorage
        const labBookingKey = `lab_booking_${merchantRef}`;
        const nursingBookingKey = `nursing_booking_${merchantRef}`;
        const doctorBookingKey = `doctor_booking_${merchantRef}`;
        const labBookingData = localStorage.getItem(labBookingKey);
        const nursingBookingData = localStorage.getItem(nursingBookingKey);
        const doctorBookingData = localStorage.getItem(doctorBookingKey);

        let bookingType = "";
        let redirectPath = "";

        if (labBookingData) {
          const bookingData = JSON.parse(labBookingData);
          await appointmentService.createLabAppointment({
            patient_id: bookingData.patient_id,
            lab_provider_id: bookingData.lab_provider_id,
            appointment_datetime: bookingData.appointment_datetime,
            test_ids: bookingData.test_ids,
            total_amount: bookingData.total_amount,
            payment_reference: merchantRef,
            notes: `Lab tests booked via Pesapal payment`,
          });
          localStorage.removeItem(labBookingKey);
          bookingType = "lab";
          redirectPath = `/patient-dashboard/lab-provider/${bookingData.lab_provider_id}?booking_success=true`;
        } else if (nursingBookingData) {
          const bookingData = JSON.parse(nursingBookingData);
          await appointmentService.createNursingAppointment({
            patient_id: bookingData.patient_id,
            nursing_provider_id: bookingData.nursing_provider_id,
            service_name: bookingData.service_names || "Home nursing service",
            service_description: `Home nursing services - ${bookingData.service_names}`,
            service_price: bookingData.total_amount,
            scheduled_datetime: bookingData.appointment_datetime,
            end_datetime: bookingData.end_datetime,
            patient_address: "Patient's home address",
            payment_reference: merchantRef,
            care_notes: `Booked via Pesapal payment`,
            is_paid: true,
          });
          localStorage.removeItem(nursingBookingKey);
          bookingType = "nursing";
          redirectPath = `/patient-dashboard/nursing/${bookingData.nursing_provider_id}?booking_success=true`;
        } else if (doctorBookingData) {
          const bookingData = JSON.parse(doctorBookingData);
          await appointmentService.createAppointment({
            patient_id: bookingData.patient_id,
            doctor_id: bookingData.doctor_id,
            appointment_datetime: bookingData.appointment_datetime,
            type: bookingData.consultation_type || "in_person",
            reason_for_visit: "Consultation",
            fee: bookingData.consultation_fee,
            is_paid: true,
            payment_reference: merchantRef,
          });
          localStorage.removeItem(doctorBookingKey);
          bookingType = "doctor";
          redirectPath = `/patient-dashboard/doctor/${bookingData.doctor_id}?booking_success=true`;
        }

        console.log(`${bookingType} appointment created successfully`);

        // Redirect back to the booking page with success parameter
        navigate(redirectPath);
      } catch (appointmentError) {
        console.error("Error creating appointment:", appointmentError);
        // Even if appointment creation fails, payment was successful
        toast({
          title: "Payment Successful",
          description:
            "Payment completed but there was an issue creating the appointment. Please contact support.",
          variant: "default",
        });
        navigate("/patient-dashboard/appointments");
      }
    };

    verifyPaymentAndRedirect();
  }, [merchantReference, orderTrackingId, navigate, toast, searchParams]);

  const handleRetry = () => {
    navigate(-1); // Go back to previous page
  };

  const handleContinue = () => {
    if (user) {
      navigate("/patient-dashboard/appointments");
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Processing Payment...</h2>
              <p className="text-gray-600">
                Please wait while we verify your payment.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-red-600">
                Payment Error
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button onClick={handleContinue}>Continue to Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    );
  }

  // This should not render as we redirect immediately on success
  return null;
};

export default PaymentSuccess;
