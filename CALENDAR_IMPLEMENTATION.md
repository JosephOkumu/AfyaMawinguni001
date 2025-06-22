# Appointment Calendar Implementation Guide

## Overview

This document outlines the complete implementation of an interactive appointment calendar for doctors in the AfyaMawinguni medical platform. The calendar provides a comprehensive view of scheduled appointments with filtering capabilities, detailed appointment information, and support for both virtual and in-person consultations.

## Features Implemented

### 🗓️ Interactive Calendar View
- **Monthly Grid Layout**: Visual calendar with clickable dates
- **Appointment Indicators**: Color-coded badges showing appointment types
- **Date Navigation**: Previous/next month navigation
- **Current Date Highlighting**: Today's date is prominently highlighted
- **Appointment Count**: Visual indicators for dates with multiple appointments

### 📋 List View
- **Chronological Listing**: Appointments sorted by date and time
- **Detailed Information**: Patient names, appointment types, and times
- **Click-to-View**: Click any appointment for detailed information

### 🔍 Smart Filtering
- **Today**: Show only today's appointments
- **Tomorrow**: Show only tomorrow's appointments
- **Next Week**: Show appointments for the next 7 days
- **Next Month**: Show appointments for the next 30 days
- **All Appointments**: Show all scheduled appointments

### 📱 Appointment Details Modal
- **Patient Information**: Name, contact details
- **Appointment Details**: Date, time, type, status
- **Medical Information**: Reason for visit, symptoms
- **Action Buttons**: Start video call or view location
- **Payment Status**: Visual indication of payment status

### 🎨 Visual Design
- **Color Coding**: Green for virtual appointments, orange for in-person
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: ARIA labels and keyboard navigation support
- **Smooth Animations**: Hover effects and transitions

## File Structure

```
AfyaMawinguni001/Frontend/src/
├── components/
│   └── calendar/
│       ├── AppointmentCalendar.tsx    # Main calendar component
│       ├── CalendarDemo.tsx           # Demo component with sample data
│       ├── index.ts                   # Export declarations
│       └── README.md                  # Component documentation
├── services/
│   └── appointmentService.ts          # Updated API service
└── pages/
    └── ProviderDashboard/
        └── DoctorDashboard.tsx        # Updated dashboard with calendar
```

## Database Schema

The implementation works with the following appointment table structure:

```sql
CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_datetime DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show') DEFAULT 'scheduled',
    type ENUM('in_person', 'virtual') DEFAULT 'in_person',
    reason_for_visit TEXT,
    symptoms TEXT,
    doctor_notes TEXT,
    prescription TEXT,
    meeting_link VARCHAR(255),
    fee DECIMAL(10,2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_appointment_datetime (appointment_datetime),
    INDEX idx_status (status),
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
```

## API Integration

### Updated Appointment Service

The appointment service has been updated to work with the new database schema:

```typescript
interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_datetime: string; // ISO datetime string
  status: "scheduled" | "completed" | "cancelled" | "rescheduled" | "no_show";
  type: "in_person" | "virtual";
  reason_for_visit?: string;
  symptoms?: string;
  meeting_link?: string;
  fee: number;
  is_paid: boolean;
  patient?: {
    user: {
      name: string;
      email: string;
      phone_number: string;
    };
  };
}
```

### API Endpoints

- `GET /doctor/appointments` - Fetch doctor's appointments
- `GET /appointments/{id}` - Get specific appointment details
- `POST /appointments` - Create new appointment
- `PUT /appointments/{id}` - Update appointment
- `PUT /appointments/{id}/cancel` - Cancel appointment

## Integration Steps

### 1. Backend Setup

Ensure your Laravel backend has the updated appointment migration and model:

```bash
php artisan migrate
```

### 2. Frontend Dependencies

All required dependencies are already installed:
- `date-fns` for date manipulation
- `@radix-ui/*` components for UI
- `lucide-react` for icons

### 3. Import and Use

```tsx
import { AppointmentCalendar } from '@/components/calendar';

function DoctorSchedule() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    appointmentService.getAppointments('doctor')
      .then(setAppointments)
      .catch(console.error);
  }, []);

  return (
    <AppointmentCalendar
      appointments={appointments}
      onAppointmentClick={(appointment) => {
        // Handle appointment click
        console.log('Selected:', appointment);
      }}
    />
  );
}
```

## Usage in Doctor Dashboard

The calendar is integrated into the doctor dashboard at the route `http://localhost:8080/provider/doctor` in the "My Schedule" tab. The implementation includes:

1. **Loading State**: Shows spinner while fetching appointments
2. **Error Handling**: Graceful handling of API failures with fallback sample data
3. **Click Handlers**: Toast notifications and custom appointment handling
4. **Responsive Layout**: Adapts to different screen sizes

## Customization Options

### Color Themes
Modify appointment colors by updating the `getAppointmentModeColor` function:

```typescript
const getAppointmentModeColor = (appointment: Appointment) => {
  const isVirtual = appointment.type === "virtual";
  return isVirtual
    ? "bg-blue-100 text-blue-800"    // Custom virtual color
    : "bg-red-100 text-red-800";     // Custom in-person color
};
```

### Additional Filters
Add custom filters by extending the `FilterType` union:

```typescript
type FilterType = "all" | "today" | "tomorrow" | "week" | "month" | "unpaid";
```

### Calendar View Options
- Modify `min-h-[100px]` to adjust calendar cell height
- Change grid layout for different calendar sizes
- Add week view or agenda view options

## Performance Considerations

### Optimizations Implemented
- **Efficient Date Filtering**: Uses date-fns utilities for fast date comparisons
- **Memoized Calculations**: Prevents unnecessary recalculations
- **Conditional Rendering**: Only renders visible appointments
- **Lazy Loading**: Modal content loaded on demand

### Recommended Practices
- Implement pagination for large appointment lists
- Cache appointment data with react-query
- Use virtual scrolling for very long lists
- Debounce filter changes

## Testing

### Manual Testing Checklist
- [ ] Calendar displays correctly with sample data
- [ ] Clicking dates shows appointments for that day
- [ ] Filtering works for all time periods
- [ ] Appointment details modal opens and displays correctly
- [ ] Both calendar and list views function properly
- [ ] Virtual vs in-person appointments display differently
- [ ] Mobile responsiveness works correctly

### Demo Component
Use the `CalendarDemo` component to test all features:

```tsx
import CalendarDemo from '@/components/calendar/CalendarDemo';

function TestPage() {
  return <CalendarDemo />;
}
```

## Troubleshooting

### Common Issues

1. **Appointments Not Showing**
   - Check API endpoint is returning data in correct format
   - Verify appointment_datetime field is properly formatted
   - Ensure patient relationship is included in API response

2. **Date Display Issues**
   - Confirm timezone handling in date conversions
   - Check date-fns locale settings
   - Verify ISO datetime string format

3. **Modal Not Opening**
   - Check Dialog component imports
   - Verify state management for modal visibility
   - Ensure appointment data is properly passed

4. **Styling Issues**
   - Confirm Tailwind CSS is properly configured
   - Check for conflicting CSS classes
   - Verify component hierarchy for proper styling

## Future Enhancements

### Planned Features
- **Drag & Drop Rescheduling**: Allow doctors to drag appointments to new times
- **Recurring Appointments**: Support for repeating appointments
- **Time Slot Management**: Visual time slot availability
- **Calendar Export**: Export to Google Calendar, Outlook, etc.
- **Real-time Updates**: WebSocket integration for live updates
- **Notification System**: Appointment reminders and alerts

### Integration Opportunities
- **Video Call Integration**: Direct integration with Zoom, Teams, etc.
- **SMS Notifications**: Automated patient reminders
- **Payment Processing**: Direct payment links in appointment details
- **Electronic Health Records**: Integration with patient medical records

## Security Considerations

- All appointment data is filtered by doctor_id on the backend
- Patient information is only accessible to assigned doctors
- Meeting links are protected and expire appropriately
- HIPAA compliance for patient data handling

## Deployment Notes

1. Ensure all environment variables are set for API endpoints
2. Configure CORS settings for calendar API calls
3. Set up proper error logging for appointment-related issues
4. Test calendar functionality in production environment
5. Monitor API performance for appointment queries

## Support

For technical issues or questions about the calendar implementation:
1. Check the component documentation in `/components/calendar/README.md`
2. Review the demo component for usage examples
3. Verify API integration with appointment service
4. Test with sample data using CalendarDemo component

---

**Implementation Status**: ✅ Complete
**Last Updated**: January 2025
**Version**: 1.0.0