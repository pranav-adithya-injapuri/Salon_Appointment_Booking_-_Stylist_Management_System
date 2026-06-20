import { createFileRoute } from "@tanstack/react-router";
import { SalonAppointmentBookingAndStylistManagementDashboard } from "@/components/SalonAppointmentBooking&StylistManagementDashboard";
export const Route = createFileRoute("/_authenticated/my-appointments")({
    head: () => ({ meta: [{ title: "My Bookings — StyleBook" }] }),
    component: SalonAppointmentBookingAndStylistManagementDashboard,
});
