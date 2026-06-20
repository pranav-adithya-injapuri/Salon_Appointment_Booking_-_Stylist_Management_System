import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { StylistCard } from "@/components/StylistCard";
import { stylistsQuery } from "@/lib/salon-queries";
export const Route = createFileRoute("/stylists")({
    head: () => ({
        meta: [
            { title: "Stylists — StyleBook" },
            { name: "description", content: "Meet our team of master stylists, colorists, and estheticians. Hand-picked talent for your next visit." },
            { property: "og:title", content: "Stylists — StyleBook" },
            { property: "og:description", content: "Meet our team of master stylists." },
        ],
    }),
    loader: ({ context }) => context.queryClient.ensureQueryData(stylistsQuery),
    component: StylistsPage,
});
function StylistsPage() {
    const { data: stylists } = useSuspenseQuery(stylistsQuery);
    return (<div>
            <section className="bg-black pt-20 pb-20 text-background">
                <div className="mx-auto max-w-7xl px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">The team</p>
                    <h1 className="font-display mt-4 text-5xl font-semibold md:text-7xl">Our stylists</h1>
                    <p className="mt-6 max-w-xl text-background/70">
                        Each artist brings years of specialized training. Pick the one whose work speaks to you.
                    </p>
                </div>
            </section>
            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stylists.map((s) => <StylistCard key={s.id} stylist={s}/>)}
                </div>
            </section>
        </div>);
}
