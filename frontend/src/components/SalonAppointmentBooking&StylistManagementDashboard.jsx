import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Calendar, Clock, Loader2, X, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { myAppointmentsQuery } from "@/lib/salon-queries";
const statusStyles = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-rose-100 text-rose-800",
};
export function SalonAppointmentBookingAndStylistManagementDashboard() {
    const qc = useQueryClient();
    const { data, isLoading } = useQuery(myAppointmentsQuery);
    async function cancel(id) {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        const response = await fetch(`http://localhost:3000/api/salon_appointment_booking_stylist_m/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` })
            },
            body: JSON.stringify({ status: "cancelled" })
        });
        if (!response.ok) {
            const err = await response.json();
            return toast.error(err.error || "Failed to cancel");
        }
        toast.success("Appointment cancelled");
        qc.invalidateQueries({ queryKey: ["my-appointments"] });
    }
    const upcoming = data?.filter((a) => a.status !== "cancelled" && a.status !== "completed") ?? [];
    const past = data?.filter((a) => a.status === "completed" || a.status === "cancelled") ?? [];
    return (<div>
            <section className="bg-onyx pt-20 pb-16 text-background">
                <div className="mx-auto max-w-5xl px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">Your account</p>
                    <h1 className="font-display mt-4 text-4xl font-semibold md:text-6xl">My bookings</h1>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 py-16">
                {isLoading ? (<div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold"/></div>) : data && data.length === 0 ? (<div className="rounded-2xl bg-card p-12 text-center shadow-sm">
                        <Calendar className="mx-auto h-10 w-10 text-gold"/>
                        <h3 className="font-display mt-4 text-2xl font-semibold">No appointments yet</h3>
                        <p className="mt-2 text-muted-foreground">Book your first visit — it takes under a minute.</p>
                        <Link to="/book" className="mt-6 inline-flex rounded-full bg-onyx px-8 py-3 text-xs font-bold uppercase tracking-widest text-background hover:bg-gold hover:text-onyx">
                            Book now
                        </Link>
                    </div>) : (<div className="space-y-12">
                        <Section title="Upcoming" items={upcoming} onCancel={cancel}/>
                        <Section title="History" items={past}/>
                    </div>)}
            </section>
        </div>);
}
function Section({ title, items, onCancel }) {
    if (items.length === 0)
        return null;
    return (<div>
            <h2 className="font-display text-2xl font-semibold">{title}</h2>
            <div className="gold-divider my-4"/>
            <ul className="space-y-4">
                {items.map((a) => (<li key={a.id} className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            {a.stylist?.photo_url && (<img src={a.stylist.photo_url} alt={a.stylist.name} className="h-14 w-14 rounded-full object-cover" loading="lazy"/>)}
                            <div>
                                <p className="font-display text-lg font-semibold">{a.service?.name}</p>
                                <p className="text-sm text-muted-foreground">with {a.stylist?.name}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-gold"/>{a.appointment_date}</span>
                            {/* @ts-ignore */}
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-gold"/>{(a.appointment_time || a.start_time)?.slice(0, 5)}</span>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${statusStyles[a.status]}`}>
                                {a.status === "confirmed" && <CheckCircle2 className="mr-1 inline h-3 w-3"/>}
                                {a.status}
                            </span>
                            {onCancel && (<button onClick={() => onCancel(a.id)} className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-rose-600 hover:text-rose-700">
                                    <X className="h-3 w-3"/> Cancel
                                </button>)}
                        </div>
                    </li>))}
            </ul>
        </div>);
}
