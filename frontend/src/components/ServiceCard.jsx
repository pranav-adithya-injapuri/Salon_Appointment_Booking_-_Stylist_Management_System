import { Link } from "@tanstack/react-router";
import { Clock, ArrowRight } from "lucide-react";

export function ServiceCard({ service }) {
    return (
        <article className="group flex flex-col h-full relative overflow-hidden rounded-2xl bg-white border border-black/5 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-[4/3] overflow-hidden">
                {service.image_url && (
                    <img src={service.image_url} alt={service.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-onyx shadow-sm">
                    ₹{service.price}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-background">
                    <h3 className="font-display text-2xl font-semibold">{service.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs uppercase tracking-wider text-background/80">
                        <Clock className="h-3 w-3" /> {service.duration_minutes} min
                    </p>
                </div>
            </div>
            <div className="flex flex-1 flex-col justify-between space-y-6 p-6">
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {service.description}
                </p>
                <Link to="/book" search={{ serviceId: service.id }} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-onyx/5 px-4 py-3 text-xs font-bold uppercase tracking-widest text-onyx transition-all hover:bg-onyx hover:text-gold">
                    Book this service <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </article>
    );
}
