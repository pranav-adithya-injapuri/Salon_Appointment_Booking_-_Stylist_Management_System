import { Link } from "@tanstack/react-router";
import { Scissors, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
export function Footer() {
    return (<footer className="bg-onyx mt-24">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
                <div className="md:col-span-2">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-onyx">
                            <Scissors className="h-4 w-4"/>
                        </span>
                        <span className="font-display text-2xl font-semibold text-background">
                            Style<span className="text-gold">Book</span>
                        </span>
                    </Link>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-background/60">
                        A modern luxury salon experience. Award-winning stylists, premium products,
                        and bookings that respect your time.
                    </p>
                    <div className="mt-6 flex gap-3">
                        {[Instagram, Facebook, Twitter].map((Icon, i) => (<a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-background/15 text-background/70 transition-colors hover:border-gold hover:text-gold">
                                <Icon className="h-4 w-4"/>
                            </a>))}
                    </div>
                </div>

                <div>
                    <h4 className="font-display text-sm uppercase tracking-widest text-gold">Explore</h4>
                    <ul className="mt-5 space-y-3 text-sm text-background/70">
                        <li><Link to="/services" className="hover:text-gold">Services</Link></li>
                        <li><Link to="/stylists" className="hover:text-gold">Our Stylists</Link></li>
                        <li><Link to="/book" className="hover:text-gold">Book Now</Link></li>
                        <li><Link to="/my-appointments" className="hover:text-gold">My Bookings</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-display text-sm uppercase tracking-widest text-gold">Contact</h4>
                    <ul className="mt-5 space-y-3 text-sm text-background/70">
                        <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-gold"/> 24 Rue Saint-Honoré, Paris</li>
                        <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold"/> +33 1 42 60 00 00</li>
                        <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-gold"/> hello@stylebook.salon</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-background/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-background/40 md:flex-row">
                    <span>© {new Date().getFullYear()} StyleBook. All rights reserved.</span>
                    <span className="uppercase tracking-widest">Crafted with care</span>
                </div>
            </div>
        </footer>);
}
