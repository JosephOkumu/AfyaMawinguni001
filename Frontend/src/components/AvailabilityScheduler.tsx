import React, { useState, useEffect } from "react";
import { Clock, Plus, X, Calendar, Save, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import DoctorUnavailabilityModal from "@/components/DoctorUnavailabilityModal";

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  available: boolean;
  times: TimeSlot[];
}

export interface WeeklySchedule {
  Sun: DaySchedule;
  Mon: DaySchedule;
  Tue: DaySchedule;
  Wed: DaySchedule;
  Thu: DaySchedule;
  Fri: DaySchedule;
  Sat: DaySchedule;
}

interface AvailabilitySchedulerProps {
  currentSchedule?: WeeklySchedule;
  onSave: (
    schedule: WeeklySchedule,
    appointmentDurationMinutes?: number,
    repeatWeekly?: boolean,
  ) => void;
  trigger?: React.ReactNode;
  initialAppointmentDuration?: number;
  initialRepeatWeekly?: boolean;
}

const AvailabilityScheduler: React.FC<AvailabilitySchedulerProps> = ({
  currentSchedule,
  onSave,
  trigger,
  initialAppointmentDuration = 30,
  initialRepeatWeekly = true,
}) => {
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    Sun: { available: false, times: [] },
    Mon: { available: true, times: [{ start: "9:00am", end: "5:00pm" }] },
    Tue: { available: true, times: [{ start: "9:00am", end: "5:00pm" }] },
    Wed: { available: true, times: [{ start: "9:00am", end: "5:00pm" }] },
    Thu: { available: true, times: [{ start: "9:00am", end: "5:00pm" }] },
    Fri: { available: true, times: [{ start: "9:00am", end: "5:00pm" }] },
    Sat: { available: false, times: [] },
  });

  const [repeatWeekly, setRepeatWeekly] = useState(initialRepeatWeekly);
  const [isOpen, setIsOpen] = useState(false);
  const [appointmentDuration, setAppointmentDuration] = useState(
    initialAppointmentDuration.toString(),
  );
  const [customDuration, setCustomDuration] = useState(30);
  const [customTimeUnit, setCustomTimeUnit] = useState<"minutes" | "hours">(
    "minutes",
  );
  const [showUnavailabilityModal, setShowUnavailabilityModal] = useState(false);

  // Initialize component state based on props
  useEffect(() => {
    if (currentSchedule) {
      setSchedule(currentSchedule);
    }
  }, [currentSchedule]);

  useEffect(() => {
    // Check if the initial duration is a standard option or custom
    const standardOptions = ["15", "30", "45", "60", "90", "120"];
    const durationStr = initialAppointmentDuration.toString();

    if (standardOptions.includes(durationStr)) {
      setAppointmentDuration(durationStr);
    } else {
      // It's a custom duration
      setAppointmentDuration("custom");

      // Determine if it should be displayed in hours or minutes
      if (
        initialAppointmentDuration >= 60 &&
        initialAppointmentDuration % 60 === 0
      ) {
        // Can be displayed in hours
        setCustomDuration(initialAppointmentDuration / 60);
        setCustomTimeUnit("hours");
      } else {
        // Display in minutes
        setCustomDuration(initialAppointmentDuration);
        setCustomTimeUnit("minutes");
      }
    }

    setRepeatWeekly(initialRepeatWeekly);
    console.log("=== AVAILABILITY SCHEDULER INITIALIZED ===");
    console.log("Initial appointment duration:", initialAppointmentDuration);
    console.log(
      "Duration type:",
      standardOptions.includes(durationStr) ? "standard" : "custom",
    );
    console.log("Initial repeat weekly:", initialRepeatWeekly);
  }, [initialAppointmentDuration, initialRepeatWeekly]);

  const toggleDayAvailability = (day: keyof WeeklySchedule) => {
    // Define different default times for each day
    const defaultTimes: Record<
      keyof WeeklySchedule,
      { start: string; end: string }
    > = {
      Sun: { start: "10:00am", end: "4:00pm" },
      Mon: { start: "8:00am", end: "6:00pm" },
      Tue: { start: "8:00am", end: "6:00pm" },
      Wed: { start: "8:00am", end: "6:00pm" },
      Thu: { start: "8:00am", end: "6:00pm" },
      Fri: { start: "8:00am", end: "5:00pm" },
      Sat: { start: "9:00am", end: "3:00pm" },
    };

    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
        times: !prev[day].available ? [defaultTimes[day]] : [],
      },
    }));
  };

  const addTimeSlot = (day: keyof WeeklySchedule) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        times: [...prev[day].times, { start: "9:00am", end: "5:00pm" }],
      },
    }));
  };

  const removeTimeSlot = (day: keyof WeeklySchedule, index: number) => {
    setSchedule((prev) => {
      const updatedTimes = prev[day].times.filter((_, i) => i !== index);

      // If no times left, mark day as unavailable
      if (updatedTimes.length === 0) {
        return {
          ...prev,
          [day]: {
            available: false,
            times: [],
          },
        };
      }

      return {
        ...prev,
        [day]: {
          ...prev[day],
          times: updatedTimes,
        },
      };
    });
  };

  const updateTime = (
    day: keyof WeeklySchedule,
    index: number,
    field: "start" | "end",
    value: string,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        times: prev[day].times.map((time, i) =>
          i === index ? { ...time, [field]: value } : time,
        ),
      },
    }));
  };

  const handleSave = () => {
    // Calculate appointment duration in minutes
    let durationMinutes = 30; // default
    if (appointmentDuration === "custom") {
      durationMinutes =
        customTimeUnit === "hours" ? customDuration * 60 : customDuration;

      // Validate duration is within backend limits (15-480 minutes)
      if (durationMinutes < 15 || durationMinutes > 480) {
        console.error(
          "Invalid duration:",
          durationMinutes,
          "minutes. Must be between 15-480 minutes.",
        );
        alert(
          `Invalid duration: ${durationMinutes} minutes. Duration must be between 15 minutes and 8 hours (480 minutes).`,
        );
        return;
      }
    } else {
      durationMinutes = parseInt(appointmentDuration);
    }

    console.log("=== AVAILABILITY SCHEDULER SAVE ===");
    console.log("Schedule:", schedule);
    console.log("Appointment Duration (minutes):", durationMinutes);
    console.log("Repeat Weekly:", repeatWeekly);

    onSave(schedule, durationMinutes, repeatWeekly);
    setIsOpen(false);
  };

  const handleCustomDurationChange = (value: number) => {
    // Backend validation: min:15 max:480 minutes
    // For hours: max 8 hours (480 minutes)
    // For minutes: max 480 minutes
    const maxValue = customTimeUnit === "hours" ? 8 : 480;
    const minValue = customTimeUnit === "hours" ? 1 : 15;

    if (value >= minValue && value <= maxValue) {
      setCustomDuration(value);
    }
  };

  const timeOptions = [
    "12:00am",
    "12:30am",
    "1:00am",
    "1:30am",
    "2:00am",
    "2:30am",
    "3:00am",
    "3:30am",
    "4:00am",
    "4:30am",
    "5:00am",
    "5:30am",
    "6:00am",
    "6:30am",
    "7:00am",
    "7:30am",
    "8:00am",
    "8:30am",
    "9:00am",
    "9:30am",
    "10:00am",
    "10:30am",
    "11:00am",
    "11:30am",
    "12:00pm",
    "12:30pm",
    "1:00pm",
    "1:30pm",
    "2:00pm",
    "2:30pm",
    "3:00pm",
    "3:30pm",
    "4:00pm",
    "4:30pm",
    "5:00pm",
    "5:30pm",
    "6:00pm",
    "6:30pm",
    "7:00pm",
    "7:30pm",
    "8:00pm",
    "8:30pm",
    "9:00pm",
    "9:30pm",
    "10:00pm",
    "10:30pm",
    "11:00pm",
    "11:30pm",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Clock className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-600" />
            General availability
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Set when you're regularly available for appointments.
          </p>

          {/* Repeat Weekly Toggle */}
          <div className="mb-6">
            <select
              value={repeatWeekly ? "weekly" : "once"}
              onChange={(e) => setRepeatWeekly(e.target.value === "weekly")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="weekly">Repeat weekly</option>
              <option value="once">One time only</option>
            </select>
          </div>

          {/* Appointment Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Duration
            </label>
            <select
              value={appointmentDuration}
              onChange={(e) => setAppointmentDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
              <option value="custom">Custom duration</option>
            </select>

            {/* Custom Duration Input */}
            {appointmentDuration === "custom" && (
              <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex items-center gap-3">
                  {/* Number Input */}
                  <div className="flex-1">
                    <input
                      type="number"
                      min={customTimeUnit === "hours" ? "1" : "15"}
                      max={customTimeUnit === "hours" ? "8" : "480"}
                      value={customDuration}
                      onChange={(e) =>
                        handleCustomDurationChange(
                          parseInt(e.target.value) ||
                            (customTimeUnit === "hours" ? 1 : 15),
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Time Unit Toggle */}
                  <div className="flex-1">
                    <select
                      value={customTimeUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value as "minutes" | "hours";
                        setCustomTimeUnit(newUnit);
                        // Reset to valid default value for the new unit
                        if (newUnit === "hours") {
                          setCustomDuration(1); // 1 hour
                        } else {
                          setCustomDuration(30); // 30 minutes
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Days Schedule */}
          <div className="space-y-1 mb-6">
            {Object.entries(schedule).map(([day, config]) => (
              <div key={day} className="py-2">
                {!config.available ? (
                  <div className="flex items-center gap-3">
                    {/* Day name */}
                    <div className="w-10 text-sm font-medium text-gray-700">
                      {day}
                    </div>
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-sm text-gray-500">Unavailable</span>
                      <button
                        onClick={() =>
                          toggleDayAvailability(day as keyof WeeklySchedule)
                        }
                        className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-400 hover:text-blue-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Day name */}
                    <div className="w-10 text-sm font-medium text-gray-700">
                      {day}
                    </div>

                    <div className="flex items-center gap-2 flex-1">
                      {/* Start time */}
                      <select
                        value={config.times[0]?.start || "9:00am"}
                        onChange={(e) =>
                          updateTime(
                            day as keyof WeeklySchedule,
                            0,
                            "start",
                            e.target.value,
                          )
                        }
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>

                      <span className="text-gray-400">–</span>

                      {/* End time */}
                      <select
                        value={config.times[0]?.end || "5:00pm"}
                        onChange={(e) =>
                          updateTime(
                            day as keyof WeeklySchedule,
                            0,
                            "end",
                            e.target.value,
                          )
                        }
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>

                      {/* Remove day availability button */}
                      <button
                        onClick={() =>
                          toggleDayAvailability(day as keyof WeeklySchedule)
                        }
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center hover:border-red-500 relative">
                          <div className="w-2 h-0.5 bg-gray-400 hover:bg-red-500"></div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Unavailability Button */}
          <div className="border-t pt-4 mb-6">
            <Button
              onClick={() => setShowUnavailabilityModal(true)}
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            >
              <CalendarX className="w-4 h-4" />
              Set Unavailability
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start items-center gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Schedule
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Unavailability Modal */}
      <DoctorUnavailabilityModal
        isOpen={showUnavailabilityModal}
        onClose={() => setShowUnavailabilityModal(false)}
        onSessionCreated={(session) => {
          console.log("New unavailable session created:", session);
          // You can add additional logic here if needed
        }}
        onSessionDeleted={(sessionId) => {
          console.log("Unavailable session deleted:", sessionId);
          // You can add additional logic here if needed
        }}
      />
    </Dialog>
  );
};

export default AvailabilityScheduler;
