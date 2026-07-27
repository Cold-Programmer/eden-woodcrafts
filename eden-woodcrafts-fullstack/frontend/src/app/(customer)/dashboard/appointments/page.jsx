import Link from "next/link";
import { apiFetchServer } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { CancelAppointmentButton } from "@/components/appointments/CancelAppointmentButton";
const SERVICE_LABELS = {
    CONSULTATION: "Design Consultation",
    REPAIR: "Furniture Repair",
    RESTORATION: "Restoration & Refinishing",
    DELIVERY_ASSEMBLY: "Delivery & Assembly",
    WORKSHOP_VISIT: "Workshop Visit"
};
const STATUS_TONE = {
    REQUESTED: "warning",
    CONFIRMED: "success",
    COMPLETED: "neutral",
    CANCELLED: "danger"
};
export default async function CustomerAppointmentsPage() {
    const res = await apiFetchServer("/api/appointments");
    const appointments = res.ok ? await res.json() : [];
    return (<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-charcoal">My Appointments</h1>
        <Link href="/book-appointment" className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-warmwhite">
          + Book New
        </Link>
      </div>

      {appointments.length === 0 ? (<div className="mt-8">
          <EmptyState title="No appointments yet" description="Book a repair, consultation, or workshop visit whenever you need one."/>
        </div>) : (<ul className="mt-8 space-y-3">
          {appointments.map((a) => (<li key={a.id} className="rounded-xl2 border border-wood/10 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-charcoal">{SERVICE_LABELS[a.service] || a.service}</span>
                    <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-charcoal/70">
                    {new Date(a.preferredDate).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  {a.address && <p className="text-sm text-charcoal/50">{a.address}</p>}
                  {a.notes && <p className="mt-2 text-sm text-charcoal/70">{a.notes}</p>}
                  {a.staffNotes && (<p className="mt-2 rounded-lg bg-gold/10 px-3 py-2 text-sm text-wood">
                      From the workshop: {a.staffNotes}
                    </p>)}
                </div>
                {a.status === "REQUESTED" && <CancelAppointmentButton id={a.id}/>}
              </div>
            </li>))}
        </ul>)}
    </div>);
}
