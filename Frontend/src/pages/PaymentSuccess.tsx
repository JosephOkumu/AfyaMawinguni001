import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import pesapalService from "@/services/pesapalService";
import appointmentService from "@/services/appointmentService";
import { useAuth } from "@/contexts/AuthContext";

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
            key.startsWith("nursing_booking_"),
        );

        if (bookingKey) {
          const extractedRef = bookingKey.replace(
            /^(lab|nursing)_booking_/,
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
        const labBookingData = localStorage.getItem(labBookingKey);
        const nursingBookingData = localStorage.getItem(nursingBookingKey);

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
          });
          localStorage.removeItem(nursingBookingKey);
          bookingType = "nursing";
          redirectPath = `/patient-dashboard/nursing/${bookingData.nursing_provider_id}?booking_success=true`;
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
  }, [merchantReference, orderTrackingId, navigate, toast]);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment and create your
              appointment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col space-y-3">
              <Button onClick={handleRetry} variant="outline">
                Try Again
              </Button>
              <Button onClick={handleContinue}>Continue to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This should not render as we redirect immediately on success
  return null;
};

export default PaymentSuccess;
