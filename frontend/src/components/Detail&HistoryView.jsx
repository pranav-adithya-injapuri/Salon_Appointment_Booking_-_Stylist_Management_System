import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
export function DetailAndHistoryView({ id }) {
    const { data: record, isLoading } = useQuery({
        queryKey: ["salon_appointment_booking_stylist_m_detail", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("salon_appointment_booking_stylist_m")
                .select("*")
                .eq("id", id)
                .single();
            if (error)
                throw error;
            return data;
        },
    });
    return (<div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground mb-8">
                <ArrowLeft className="h-4 w-4"/> Back to Dashboard
            </Link>

            <h1 className="font-display text-4xl font-semibold mb-8">Detail & History View</h1>

            {isLoading ? (<div className="flex justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-gold"/>
                </div>) : !record ? (<div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
                    Record not found.
                </div>) : (<div className="rounded-2xl border border-border bg-card p-8 md:p-12">
                    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-medium uppercase tracking-wider text-muted-foreground">ID</dt>
                            <dd className="mt-1 text-lg text-foreground">{record.id}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Status</dt>
                            <dd className="mt-1">
                                <span className="inline-flex items-center rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
                                    {record.status}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Schedule</dt>
                            <dd className="mt-1 text-lg text-foreground">{record.schedule}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium uppercase tracking-wider text-muted-foreground">No-shows</dt>
                            <dd className="mt-1 text-lg text-foreground">{record["no-shows"]}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Walk-ins from one dashboard</dt>
                            <dd className="mt-1 text-lg text-foreground">{record["walk-ins from one dashboard"]}</dd>
                        </div>
                    </dl>
                </div>)}
        </div>);
}
