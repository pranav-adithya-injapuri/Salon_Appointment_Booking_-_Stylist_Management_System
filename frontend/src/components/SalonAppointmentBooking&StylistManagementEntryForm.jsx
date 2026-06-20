import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
    const total = 10 * 60 + i * 30; // 10:00 .. 18:00
    const h = String(Math.floor(total / 60)).padStart(2, "0");
    const m = String(total % 60).padStart(2, "0");
    return `${h}:${m}`;
});
function todayISO() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
}
export function SalonAppointmentBookingAndStylistManagementEntryForm({ initialSearch, services, stylists, }) {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loadingSession, setLoadingSession] = useState(true);
    const [serviceId, setServiceId] = useState(initialSearch.serviceId ?? "");
    const [stylistId, setStylistId] = useState(initialSearch.stylistId ?? "");
    const [date, setDate] = useState(todayISO());
    const [time, setTime] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoadingSession(false);
            if (data.session?.user) {
                setEmail(data.session.user.email ?? "");
            }
        });
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
            setSession(s);
            if (s?.user)
                setEmail(s.user.email ?? "");
        });
        return () => sub.subscription.unsubscribe();
    }, []);
    // Prefill profile
    useEffect(() => {
        if (!session?.user)
            return;
        supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", session.user.id)
            .maybeSingle()
            .then(({ data }) => {
            if (data) {
                setName((n) => n || data.full_name || "");
                setPhone((p) => p || data.phone || "");
            }
        });
    }, [session]);
    // Booked slots for selected stylist & date
    const bookedSlotsQuery = useQuery({
        queryKey: ["booked-slots", stylistId, date],
        enabled: Boolean(stylistId && date),
        queryFn: async () => {
            const { data, error } = await supabase
                .from("appointments")
                .select("start_time, status")
                .eq("stylist_id", parseInt(stylistId, 10) || 0)
                .eq("appointment_date", date)
                .neq("status", "cancelled");
            if (error)
                throw error;
            return (data ?? []).map((r) => r.start_time?.slice(0, 5) || "");
        },
    });
    const selectedService = services.find((s) => s.id === serviceId);
    const selectedStylist = stylists.find((s) => s.id === stylistId);
    async function handleSubmit(e) {
        e.preventDefault();
        if (!serviceId || !stylistId || !date || !time || !name || !phone || !email) {
            toast.error("Please fill all required fields");
            return;
        }
        if (date < todayISO()) {
            toast.error("Please pick a future date");
            return;
        }
        const [hours, minutes] = time.split(":").map(Number);
        const duration = selectedService?.duration_minutes || 0;
        const endTotalMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(endTotalMinutes / 60);
        const endMins = endTotalMinutes % 60;
        const end_time = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
        setSubmitting(true);
        try {
            const token = session?.access_token || (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch("http://localhost:3000/api/salon_appointment_booking_stylist_m", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify({
                    customerPayload: {
                        customer_name: name,
                        phone,
                        email,
                        gender: gender || null,
                        Notes: notes || null
                    },
                    appointmentPayload: {
                        service_id: parseInt(serviceId, 10) || 0,
                        stylist_id: parseInt(stylistId, 10) || 0,
                        appointment_date: date,
                        start_time: time,
                        end_time: end_time,
                        status: "confirmed",
                        notes: notes || null,
                    }
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.code === "23505") {
                    throw new Error("That time slot was just taken. Please pick another.");
                }
                else {
                    throw new Error(errorData.error || "An error occurred");
                }
            }
            toast.success("Appointment confirmed!");
            if (session?.user) {
                navigate({ to: "/my-appointments" });
            }
            else {
                navigate({ to: "/" });
            }
        }
        catch (error) {
            toast.error(error.message || "An error occurred");
        }
        finally {
            setSubmitting(false);
        }
    }
    if (loadingSession) {
        return (<div className="grid min-h-screen place-items-center">
                <Loader2 className="h-6 w-6 animate-spin text-gold"/>
            </div>);
    }
    return (<div>
            <section className="bg-onyx pt-20 pb-16 text-background">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">Reservation</p>
                    <h1 className="font-display mt-4 text-4xl font-semibold md:text-6xl">Book your appointment</h1>
                    <p className="mt-4 text-background/70">Pick a service, a stylist, a time. We'll handle the rest.</p>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-6 -mt-12 pb-24">
                <div className="rounded-3xl bg-card p-8 md:p-12 shadow-[var(--shadow-luxe)]">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Field label="Service">
                            <select required value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputCls}>
                                <option value="">Choose a service…</option>
                                {services.map((s) => (<option key={s.id} value={s.id}>{s.name} — ₹{s.price} · {s.duration_minutes}min</option>))}
                            </select>
                        </Field>

                        <Field label="Stylist">
                            <select required value={stylistId} onChange={(e) => { setStylistId(e.target.value); setTime(""); }} className={inputCls}>
                                <option value="">Choose a stylist…</option>
                                {stylists.map((s) => (<option key={s.id} value={s.id}>{s.name} — {s.specialization}</option>))}
                            </select>
                        </Field>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Field label="Date">
                                <div className="relative">
                                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                    <input type="date" required min={todayISO()} value={date} onChange={(e) => { setDate(e.target.value); setTime(""); }} className={`${inputCls} pl-10`}/>
                                </div>
                            </Field>
                            <Field label="Time">
                                <div className="grid grid-cols-4 gap-2">
                                    {TIME_SLOTS.map((slot) => {
            const taken = bookedSlotsQuery.data?.includes(slot);
            const disabled = !stylistId || taken;
            return (<button type="button" key={slot} disabled={disabled} onClick={() => setTime(slot)} className={`rounded-md border px-2 py-2 text-xs font-medium transition-all ${time === slot
                    ? "border-gold bg-gold text-onyx"
                    : disabled
                        ? "border-border bg-muted/40 text-muted-foreground/50 line-through cursor-not-allowed"
                        : "border-border hover:border-gold hover:text-gold"}`}>
                                                {slot}
                                            </button>);
        })}
                                </div>
                                {!stylistId && <p className="mt-2 text-xs text-muted-foreground">Pick a stylist to see availability</p>}
                            </Field>
                        </div>

                        <div className="border-t border-border pt-8">
                            <h3 className="font-display text-xl font-semibold">Your details</h3>
                            <div className="mt-6 grid gap-6 md:grid-cols-2">
                                <Field label="Full name">
                                    <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Jane Doe" maxLength={100}/>
                                </Field>
                                <Field label="Mobile number">
                                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+1 555 000 0000" maxLength={20}/>
                                </Field>
                                <Field label="Email">
                                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="jane@example.com" maxLength={255}/>
                                </Field>
                                <Field label="Gender (optional)">
                                    <div className="flex w-full items-center gap-6 rounded-md border border-border bg-background px-4 py-3 text-sm">
                                        {["Male", "Female", "Other"].map((g) => (<label key={g} className="flex cursor-pointer items-center gap-2">
                                                <input type="radio" name="gender" value={g} checked={gender === g} onChange={(e) => setGender(e.target.value)} className="h-4 w-4 cursor-pointer accent-gold text-gold focus:ring-gold/30"/>
                                                <span className="text-foreground/80">{g}</span>
                                            </label>))}
                                    </div>
                                </Field>
                                <div className="md:col-span-2">
                                    <Field label="Notes (optional)">
                                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputCls} min-h-24`} placeholder="Anything we should know?" maxLength={500}/>
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {selectedService && selectedStylist && (<div className="rounded-2xl bg-muted/60 p-6">
                                <p className="text-xs uppercase tracking-widest text-muted-foreground">Summary</p>
                                <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1">
                                    <p className="font-display text-2xl font-semibold">{selectedService.name}</p>
                                    <p className="text-sm text-muted-foreground">with <span className="font-semibold text-foreground">{selectedStylist.name}</span></p>
                                </div>
                                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5"/> {selectedService.duration_minutes} min</span>
                                    <span className="font-semibold text-foreground">₹{selectedService.price}</span>
                                </div>
                            </div>)}

                        <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-onyx px-8 py-4 text-xs font-bold uppercase tracking-widest text-background transition-all hover:bg-gold hover:text-onyx hover:shadow-[var(--shadow-gold)] disabled:opacity-60">
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle2 className="h-4 w-4"/>}
                            Confirm appointment
                        </button>
                    </form>
                </div>
            </section>
        </div>);
}
const inputCls = "w-full rounded-md border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";
function Field({ label, children }) {
    return (<label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
            {children}
        </label>);
}
