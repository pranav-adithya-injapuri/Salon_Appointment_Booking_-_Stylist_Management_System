import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, Sparkles, Star, ChevronRight } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { StylistCard } from "@/components/StylistCard";
import { servicesQuery, stylistsQuery } from "@/lib/salon-queries";

const heroImage = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "StyleBook — Luxury Salon & Stylist Booking" },
            { name: "description", content: "Book hair, color, facial, and bridal services with award-winning stylists. Real-time availability, instant confirmation." },
            { property: "og:title", content: "StyleBook — Luxury Salon & Stylist Booking" },
            { property: "og:description", content: "Book hair, color, facial, and bridal services with award-winning stylists." },
        ],
    }),
    loader: ({ context }) => Promise.all([
        context.queryClient.ensureQueryData(servicesQuery),
        context.queryClient.ensureQueryData(stylistsQuery),
    ]),
    component: Index,
});

function Index() {
    const { data: services } = useSuspenseQuery(servicesQuery);
    const { data: stylists } = useSuspenseQuery(stylistsQuery);

    return (<div>
            {/* HERO */}
            <section className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden">
                <img src={heroImage} alt="Luxury salon interior with gold accents" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover"/>
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/55 to-black/85"/>

                <div className="mx-auto w-full max-w-7xl px-6 pt-32 pb-24 text-background">
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-gold">
                        <Sparkles className="h-3.5 w-3.5"/> Award-winning luxury salon
                    </p>
                    <h1 className="font-display mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] md:text-7xl">
                        Where every detail<br />
                        is <span className="italic text-gold">crafted</span>.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg text-background/80">
                        Book your next cut, color, or signature treatment with master stylists.
                        Instant confirmation, zero waiting room.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-xs font-bold uppercase tracking-widest text-onyx transition-all hover:shadow-[var(--shadow-gold)] hover:scale-[1.02]">
                            <Calendar className="h-4 w-4"/> Book an appointment
                        </Link>
                        <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-background/40 px-8 py-4 text-xs font-bold uppercase tracking-widest text-background transition-all hover:border-gold hover:text-gold">
                            View services <ChevronRight className="h-4 w-4"/>
                        </Link>
                    </div>

                    <dl className="mt-20 grid max-w-2xl grid-cols-3 gap-8 border-t border-background/15 pt-8">
                        {[
            ["12+", "Master stylists"],
            ["8K+", "Happy clients"],
            ["4.9★", "Average rating"],
        ].map(([n, l]) => (<div key={l}>
                                <dt className="font-display text-3xl font-semibold text-gold">{n}</dt>
                                <dd className="mt-1 text-xs uppercase tracking-wider text-background/60">{l}</dd>
                            </div>))}
                    </dl>
                </div>
            </section>

            {/* INTRO */}
            <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
                <div className="grid items-center gap-12 md:grid-cols-2">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-gold">About StyleBook</p>
                        <h2 className="font-display mt-4 text-4xl font-semibold md:text-5xl">
                            A modern sanctuary for hair, skin, and self.
                        </h2>
                        <div className="gold-divider my-6"/>
                        <p className="text-base leading-relaxed text-muted-foreground">
                            StyleBook brings together a curated team of internationally trained stylists,
                            colorists, and estheticians under one roof. Every treatment is tailored —
                            every visit, an experience.
                        </p>
                        <Link to="/stylists" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-onyx hover:text-gold">
                            Meet the team <ChevronRight className="h-4 w-4"/>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {services.slice(0, 4).map((s, i) => (<div key={s.id} className={`overflow-hidden rounded-2xl ${i % 2 ? "translate-y-8" : ""}`}>
                                {s.image_url && <img src={s.image_url} alt={s.name} loading="lazy" className="aspect-[3/4] h-full w-full object-cover"/>}
                            </div>))}
                    </div>
                </div>
            </section>

            {/* FEATURED SERVICES */}
            <section className="bg-muted/40 py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-gold">Featured</p>
                            <h2 className="font-display mt-3 text-4xl font-semibold md:text-5xl">Signature services</h2>
                        </div>
                        <Link to="/services" className="hidden md:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest hover:text-gold">
                            All services <ChevronRight className="h-4 w-4"/>
                        </Link>
                    </div>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {services.slice(0, 4).map((s) => <ServiceCard key={s.id} service={s}/>)}
                    </div>
                </div>
            </section>

            {/* STYLISTS */}
            <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
                <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">The artists</p>
                    <h2 className="font-display mt-3 text-4xl font-semibold md:text-5xl">Meet your stylist</h2>
                    <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                        Hand-picked talent — each specialist trained in a discipline they've perfected over years.
                    </p>
                </div>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stylists.slice(0, 3).map((s) => <StylistCard key={s.id} stylist={s}/>)}
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="bg-onyx py-24 text-background md:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <p className="text-center text-xs uppercase tracking-[0.3em] text-gold">Praise</p>
                    <h2 className="font-display mt-3 text-center text-4xl font-semibold md:text-5xl">Loved by our clients</h2>
                    <div className="mt-14 grid gap-6 md:grid-cols-3">
                        {[
            { name: "Eloise M.", text: "Best balayage I've ever had. Isabella took the time to understand exactly what I wanted." },
            { name: "Daniel R.", text: "Marcus gave me the sharpest cut of my life. The hot towel finish is unreal." },
            { name: "Priya S.", text: "Booked my bridal package with Sophia — flawless from trial to wedding day." },
        ].map((t) => (<figure key={t.name} className="bg-black rounded-2xl p-8 border border-white/5">
                                <div className="flex gap-1 text-gold">
                                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current"/>)}
                                </div>
                                <blockquote className="mt-4 text-background/80 leading-relaxed">"{t.text}"</blockquote>
                                <figcaption className="mt-6 font-display text-sm uppercase tracking-wider text-gold">— {t.name}</figcaption>
                            </figure>))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-7xl px-6 py-24 md:py-32 text-center">
                <h2 className="font-display text-4xl font-semibold md:text-6xl">Ready when you are.</h2>
                <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                    Real-time availability. Instant confirmation. Cancel anytime up to 24 hours before.
                </p>
                <Link to="/book" className="mt-10 inline-flex items-center gap-2 rounded-full bg-onyx px-10 py-5 text-xs font-bold uppercase tracking-widest text-background transition-all hover:bg-gold hover:text-onyx hover:shadow-[var(--shadow-gold)]">
                    <Calendar className="h-4 w-4"/> Book your appointment
                </Link>
            </section>
        </div>);
}
