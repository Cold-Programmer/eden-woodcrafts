import { apiFetchServer } from "@/lib/api";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { AppointmentStatusSelect } from "@/components/staff/AppointmentStatusSelect";
const SERVICE_LABELS = {
    CONSULTATION: "Design Consultation",
    REPAIR: "Furniture Repair",
    RESTORATION: "Restoration & Refinishing",
    DELIVERY_ASSEMBLY: "Delivery & Assembly",
    WORKSHOP_VISIT: "Workshop Visit"
};
export default async function StaffAppointmentsPage() {
    const res = await apiFetchServer("/api/admin/appointments");
    const appointments = res.ok ? await res.json() : [];
    const upcoming = appointments.filter((a) => a.status !== "CANCELLED" && a.status !== "COMPLETED");
    return (<div>
      <h1 className="font-serif text-2xl font-bold text-charcoal">Appointments</h1>
      <p className="mt-1 text-sm text-charcoal/60">{upcoming.length} active booking(s)</p>

      {appointments.length === 0 ? (<div className="mt-8">
          <EmptyState title="No appointments booked" description="Customer bookings for repairs, consultations, and visits will appear here."/>
        </div>) : (<div className="mt-6 overflow-x-auto rounded-xl2 border border-wood/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-wood/10 text-charcoal/50">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (<tr key={a.id} className="border-b border-wood/5">
                  <td className="px-4 py-3">
                    {new Date(a.preferredDate).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="gold">{SERVICE_LABELS[a.service] || a.service}</Badge>
                  </td>
                  <td className="px-4 py-3">{a.user.name}</td>
                  <td className="px-4 py-3">{a.phone}</td>
                  <td className="px-4 py-3"><AppointmentStatusSelect id={a.id} status={a.status}/></td>
                </tr>))}
            </tbody>
          </table>
        </div>)}
    </div>);
}
