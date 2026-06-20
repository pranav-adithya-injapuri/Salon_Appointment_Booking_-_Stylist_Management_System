import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/admin")({
    ssr: false,
    beforeLoad: async () => {
        if (localStorage.getItem("demo_role") !== "admin") {
            throw redirect({ to: "/auth" });
        }
    },
    component: AdminLayout,
});
function AdminLayout() {
    return (<div className="min-h-screen bg-background">
            <Outlet />
        </div>);
}
