import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
export const Route = createFileRoute("/admin/reports")({
    head: () => ({ meta: [{ title: "Reports — Admin" }] }),
    component: AdminWip,
});
function AdminWip() {
    return (<div>
            <section className="bg-onyx pt-20 pb-16 text-background">
                <div className="mx-auto max-w-5xl px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">Admin</p>
                    <h1 className="font-display mt-4 text-4xl font-semibold md:text-5xl">Reports</h1>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-6 py-32 text-center">
                <div className="rounded-2xl bg-card p-12 shadow-sm inline-block">
                    <Settings className="mx-auto h-12 w-12 text-gold animate-[spin_4s_linear_infinite]"/>
                    <h3 className="font-display mt-6 text-3xl font-semibold">Work in Progress</h3>
                    <p className="mt-4 max-w-md text-muted-foreground text-lg">
                        The Reports panel is currently under development. Check back later!
                    </p>
                </div>
            </section>
        </div>);
}
