import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export const getServiceImage = (name) => {
    const map = {
        "Beard Trim": "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400",
        "Hair Cut": "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400",
        "Hair Styling": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400",
        "Hair Spa": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400",
        "Signature Facial": "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=400",
        "Hair Coloring": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=400",
        "Skin Treatment": "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=400",
        "Bridal Makeup": "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=400"
    };
    return map[name] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400";
};
export const getStylistImage = (name) => {
    const map = {
        "Sophia Laurent": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=400",
        "Isabella Romano": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        "Layla Hassan": "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400",
        "Marcus Chen": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
        "Daniel Park": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
        "Aarav Mehta": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    };
    return map[name] || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400";
};
export const servicesQuery = queryOptions({
    queryKey: ["services"],
    queryFn: async () => {
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .order("price", { ascending: true });
        if (error)
            throw error;
        return (data ?? []).map((s) => ({
            id: s.service_id?.toString() || s.id?.toString() || Math.random().toString(),
            name: s.service_name,
            description: s.description,
            price: s.price,
            duration_minutes: s.duration_minutes,
            image_url: getServiceImage(s.service_name),
            active: true
        }));
    },
});
export const stylistsQuery = queryOptions({
    queryKey: ["stylists"],
    queryFn: async () => {
        const { data, error } = await supabase
            .from("stylists")
            .select("*");
        if (error)
            throw error;
        return (data ?? []).map((s) => ({
            id: s.stylist_id?.toString() || s.id?.toString() || Math.random().toString(),
            name: s.stylist_name || 'Stylist',
            specialization: "",
            experience_years: s.experience_years,
            bio: null,
            photo_url: getStylistImage(s.stylist_name),
            rating: 5,
            available: s.availability_status === "Available"
        }));
    },
});
export const myAppointmentsQuery = queryOptions({
    queryKey: ["my-appointments"],
    queryFn: async () => {
        const { data, error } = await supabase
            .from("appointments")
            .select("*, service:services(service_name, price, duration_minutes), stylist:stylists(stylist_name)")
            .order("appointment_date", { ascending: false })
            .order("start_time", { ascending: false });
        if (error)
            throw error;
        return (data ?? []).map((a) => ({
            id: a.appointment_id?.toString() || a.id?.toString(),
            customer_id: a.customer_id?.toString(),
            stylist_id: a.stylist_id?.toString(),
            service_id: a.service_id?.toString(),
            appointment_date: a.appointment_date,
            appointment_time: a.start_time,
            status: a.status,
            notes: a.notes,
            customer_name: "",
            customer_phone: "",
            customer_email: "",
            created_at: a.created_at,
            service: a.service ? {
                name: a.service.service_name,
                price: a.service.price,
                duration_minutes: a.service.duration_minutes
            } : undefined,
            stylist: a.stylist ? {
                name: a.stylist.stylist_name,
                photo_url: getStylistImage(a.stylist.stylist_name)
            } : undefined
        }));
    },
});
