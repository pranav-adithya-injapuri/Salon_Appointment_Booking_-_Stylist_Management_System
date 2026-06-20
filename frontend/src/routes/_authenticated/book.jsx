import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { servicesQuery, stylistsQuery } from "@/lib/salon-queries";
const searchSchema = z.object({
    serviceId: z.string().optional(),
    stylistId: z.string().optional(),
});
export const Route = createFileRoute("/_authenticated/book")({
    head: () => ({
        meta: [
            { title: "Book an Appointment — StyleBook" },
            { name: "description", content: "Real-time availability and instant confirmation. Book your next salon appointment in under a minute." },
            { property: "og:title", content: "Book an Appointment — StyleBook" },
            { property: "og:description", content: "Real-time availability and instant confirmation." },
        ],
    }),
    validateSearch: searchSchema,
    loader: ({ context }) => Promise.all([
        context.queryClient.ensureQueryData(servicesQuery),
        context.queryClient.ensureQueryData(stylistsQuery),
    ]),
    component: BookPage,
});
import { SalonAppointmentBookingAndStylistManagementEntryForm } from "@/components/SalonAppointmentBooking&StylistManagementEntryForm";
function BookPage() {
    const search = Route.useSearch();
    const { data: services } = useSuspenseQuery(servicesQuery);
    const { data: stylists } = useSuspenseQuery(stylistsQuery);
    return (<SalonAppointmentBookingAndStylistManagementEntryForm initialSearch={search} services={services} stylists={stylists}/>);
}
