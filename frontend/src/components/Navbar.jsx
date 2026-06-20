import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Scissors } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/stylists", label: "Stylists" },
];

const customerLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/stylists", label: "Stylists" },
    { to: "/book", label: "Bookings" },
];

const adminLinks = [
    { to: "/admin", label: "Entry Form", exact: true },
    { to: "/admin/services", label: "Services" },
    { to: "/admin/stylist", label: "Stylist" },
    { to: "/admin/reports", label: "Reports" },
];

export function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [session, setSession] = useState(null);
    const [role, setRole] = useState(null);
    const router = useRouter();
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    useEffect(() => setOpen(false), [pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const demoUser = localStorage.getItem("demo_user");
        const demoRole = localStorage.getItem("demo_role");
        setRole(demoRole);
        if (demoUser) {
            setSession({ user: { email: demoUser } });
        }
        else {
            supabase.auth.getSession().then(({ data }) => setSession(data.session));
        }
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
            if (!localStorage.getItem("demo_user"))
                setSession(s);
        });
        return () => sub.subscription.unsubscribe();
    }, []);

    async function signOut() {
        localStorage.removeItem("demo_user");
        localStorage.removeItem("demo_role");
        setSession(null);
        setRole(null);
        await supabase.auth.signOut();
        router.navigate({ to: "/" });
    }

    let navLinks = publicLinks;
    if (role === "admin")
        navLinks = adminLinks;
    else if (role === "customer")
        navLinks = customerLinks;

    return (
        <header className={cn("sticky top-0 z-50 bg-white transition-all duration-300", scrolled && "border-b border-border shadow-sm")}>
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-gold transition-transform group-hover:rotate-12">
                        <Scissors className="h-4 w-4"/>
                    </span>
                    <span className="font-display text-2xl font-semibold tracking-tight">
                        Style<span className="text-gold">Book</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-10 md:flex">
                    {navLinks.map((l) => (
                        <Link key={l.to} to={l.to} className="text-sm font-medium uppercase tracking-wider text-foreground/80 transition-colors hover:text-gold" activeProps={{ className: "!text-gold" }} activeOptions={{ exact: l.exact ?? l.to === "/" }}>
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    {session ? (
                        <>
                            {role === "customer" && (
                                <Link to="/my-appointments" className="text-sm font-medium uppercase tracking-wider text-foreground/80 hover:text-gold">
                                    My Bookings
                                </Link>
                            )}
                            <button onClick={signOut} className="rounded-full bg-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background transition-all hover:bg-foreground hover:shadow-[var(--shadow-gold)]">
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" className="rounded-full bg-black px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background transition-all hover:bg-foreground hover:shadow-[var(--shadow-gold)]">
                                Sign in
                            </Link>
                        </>
                    )}
                </div>

                <button aria-label="Toggle menu" className="md:hidden p-2 -mr-2" onClick={() => setOpen((v) => !v)}>
                    {open ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                </button>
            </div>

            {open && (
                <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
                    <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
                        {navLinks.map((l) => (
                            <Link key={l.to} to={l.to} className="rounded-md px-3 py-3 text-sm font-medium uppercase tracking-wider hover:bg-muted" activeProps={{ className: "!text-gold bg-muted" }} activeOptions={{ exact: l.exact ?? l.to === "/" }}>
                                {l.label}
                            </Link>
                        ))}
                        <div className="mt-2 border-t border-border pt-3">
                            {session ? (
                                <>
                                    {role === "customer" && (
                                        <Link to="/my-appointments" className="block rounded-md px-3 py-3 text-sm font-medium uppercase tracking-wider hover:bg-muted">
                                            My Bookings
                                        </Link>
                                    )}
                                    <button onClick={signOut} className="mt-2 block w-full rounded-md bg-black px-3 py-3 text-center text-sm font-semibold uppercase tracking-wider text-background transition-all hover:bg-foreground hover:shadow-[var(--shadow-gold)]">
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/auth" className="block rounded-md bg-black px-3 py-3 text-center text-sm font-semibold uppercase tracking-wider text-background mt-2">
                                        Sign in
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
