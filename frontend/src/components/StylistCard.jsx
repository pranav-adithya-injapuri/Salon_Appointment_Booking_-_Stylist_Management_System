import { Link } from "@tanstack/react-router";
import { Star, Award } from "lucide-react";
export function StylistCard({ stylist }) {
    return (<article className="group relative overflow-hidden rounded-2xl bg-black text-background shadow-[var(--shadow-luxe)]">
            <div className="relative aspect-[3/4] overflow-hidden">
                {stylist.photo_url && (<img src={stylist.photo_url} alt={stylist.name} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"/>)}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"/>
                <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold text-onyx">
                    <Star className="h-3 w-3 fill-gold text-gold"/> {stylist.rating.toFixed(1)}
                </div>
            </div>
            <div className="space-y-3 p-6">
                <div>
                    <h3 className="font-display text-2xl font-semibold">{stylist.name}</h3>
                    <p className="mt-1 text-sm uppercase tracking-wider text-gold">{stylist.specialization}</p>
                </div>
                <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-background/60">
                    <Award className="h-3 w-3"/> {stylist.experience_years} years experience
                </p>
                {stylist.bio && (<p className="text-sm leading-relaxed text-background/70 line-clamp-2">{stylist.bio}</p>)}
                <Link to="/book" search={{ stylistId: stylist.id }} className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-onyx transition-all hover:shadow-[var(--shadow-gold)]">
                    Book with {stylist.name.split(" ")[0]}
                </Link>
            </div>
        </article>);
}
