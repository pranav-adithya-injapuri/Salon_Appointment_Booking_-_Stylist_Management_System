import { createFileRoute } from "@tanstack/react-router";
import { DetailAndHistoryView } from "@/components/Detail&HistoryView";
export const Route = createFileRoute("/detail/$id")({
    head: () => ({ meta: [{ title: "Detail View — Nyckaa 14 Salon" }] }),
    component: DetailPage,
});
function DetailPage() {
    const { id } = Route.useParams();
    return <DetailAndHistoryView id={id}/>;
}
