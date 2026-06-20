import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ServiceCard } from "@/components/ServiceCard";
import { servicesQuery } from "@/lib/salon-queries";
export const Route = createFileRoute("/services")({
    head: () => ({
        meta: [
            { title: "Services — StyleBook" },
            { name: "description", content: "Hair cuts, coloring, facials, bridal makeup and more. Browse our full menu of luxury salon services." },
            { property: "og:title", content: "Services — StyleBook" },
            { property: "og:description", content: "Browse our full menu of luxury salon services." },
        ],
    }),
    loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
    component: ServicesPage,
});
function ServicesPage() {
    const { data: services } = useSuspenseQuery(servicesQuery);
    return (<div>
            <section className="bg-black pt-20 pb-20 text-background">
                <div className="mx-auto max-w-7xl px-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">The menu</p>
                    <h1 className="font-display mt-4 text-5xl font-semibold md:text-7xl">Our services</h1>
                    <p className="mt-6 max-w-xl text-background/70">
                        From precision cuts to bridal transformations — every service performed by
                        specialists who've mastered their craft.
                    </p>
                </div>
            </section>
            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {services.map((s) => <ServiceCard key={s.id} service={s}/>)}
                </div>
            </section>
        </div>);
}
