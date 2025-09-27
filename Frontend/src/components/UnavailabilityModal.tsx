import React, { useState, useEffect } from "react";
import { Calendar, Clock, X, Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import nursingService, {
  UnavailableSession,
  UnavailableSessionCreateData,
} from "@/services/nursingService";

interface UnavailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated?: (session: UnavailableSession) => void;
  onSessionDeleted?: (sessionId: number) => void;
}

const UnavailabilityModal: React.FC<UnavailabilityModalProps> = ({
  isOpen,
  onClose,
  onSessionCreated,
  onSessionDeleted,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [existingSessions, setExistingSessions] = useState<
    UnavailableSession[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Generate time options (every 30 minutes)
  const timeOptions = [
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  // Load existing unavailable sessions
  const loadExistingSessions = async () => {
    try {
      console.log("=== LOADING EXISTING UNAVAILABLE SESSIONS ===");
      const sessions = await nursingService.getUnavailableSessions();
      setExistingSessions(sessions);
      console.log("Loaded sessions:", sessions);
    } catch (error) {
      console.error("Failed to load existing sessions:", error);
      setError("Failed to load existing unavailable sessions");
    }
  };

  // Load sessions when modal opens
  useEffect(() => {
    if (isOpen) {
      loadExistingSessions();
      // Clear form
      setSelectedDate(undefined);
      setStartTime("");
      setEndTime("");
      setReason("");
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  // Validate form
  const validateForm = (): string | null => {
    if (!selectedDate) return "Please select a date";
    if (!startTime) return "Please select a start time";
    if (!endTime) return "Please select an end time";

    // Check if end time is after start time
    if (startTime >= endTime) {
      return "End time must be after start time";
    }

    // Check if date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return "Cannot set unavailability for past dates";
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("=== CREATING UNAVAILABLE SESSION ===");

      // Apply the same +1 day offset used by the availability system to ensure consistency
      const adjustedDateForStorage = new Date(selectedDate!);
      adjustedDateForStorage.setDate(adjustedDateForStorage.getDate() + 1);

      const sessionData: UnavailableSessionCreateData = {
        date: adjustedDateForStorage.toISOString().split("T")[0], // Format as YYYY-MM-DD with +1 day offset
        start_time: startTime,
        end_time: endTime,
        reason: reason.trim() || undefined,
      };

      console.log("Session data to create:", sessionData);

      const newSession =
        await nursingService.createUnavailableSession(sessionData);

      console.log("Created session:", newSession);

      setSuccess("Unavailable session created successfully!");

      // Add to existing sessions list
      setExistingSessions((prev) =>
        [...prev, newSession].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
      );

      // Clear form
      setSelectedDate(undefined);
      setStartTime("");
      setEndTime("");
      setReason("");

      // Notify parent component
      if (onSessionCreated) {
        onSessionCreated(newSession);
      }
    } catch (error: unknown) {
      console.error("Failed to create unavailable session:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to create unavailable session";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle session deletion
  const handleDeleteSession = async (sessionId: number) => {
    if (!confirm("Are you sure you want to delete this unavailable session?")) {
      return;
    }

    try {
      console.log("=== DELETING UNAVAILABLE SESSION ===");
      console.log("Session ID:", sessionId);

      await nursingService.deleteUnavailableSession(sessionId);

      console.log("Session deleted successfully");

      // Remove from existing sessions list
      setExistingSessions((prev) =>
        prev.filter((session) => session.id !== sessionId),
      );

      setSuccess("Unavailable session deleted successfully!");

      // Notify parent component
      if (onSessionDeleted) {
        onSessionDeleted(sessionId);
      }
    } catch (error: unknown) {
      console.error("Failed to delete unavailable session:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete unavailable session";
      setError(errorMessage);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-red-600" />
            Set Unavailability
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Add New Unavailable Session Form */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-lg">Add New Unavailable Period</h3>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Select Date</Label>
              <div className="border rounded-md p-3 inline-block">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="rounded-md"
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatTime(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem
                        key={time}
                        value={time}
                        disabled={time <= startTime}
                      >
                        {formatTime(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reason (Optional) */}
            <div className="space-y-2">
              <Label>Reason (Optional)</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Personal appointment, Training session, etc."
                className="resize-none"
                rows={2}
              />
            </div>

            {/* Add Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              {loading ? "Adding..." : "Add Unavailable Period"}
            </Button>
          </div>

          {/* Existing Unavailable Sessions */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Current Unavailable Periods</h3>

            {existingSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No unavailable periods set</p>
                <p className="text-sm">
                  Add periods when you're not available for appointments
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {existingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-grow">
                      <div className="font-medium">
                        {formatDate(session.date)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatTime(session.start_time)} -{" "}
                        {formatTime(session.end_time)}
                      </div>
                      {session.reason && (
                        <div className="text-sm text-gray-500 mt-1">
                          {session.reason}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSession(session.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnavailabilityModal;
