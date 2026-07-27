import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
export const metadata = {
    title: "Services",
    description: "Beyond furniture sales — repairs, restoration, consultations, and delivery/assembly from Eden Woodcrafts."
};
const services = [
    {
        title: "Custom Furniture",
        description: "Bespoke pieces built to your measurements, material, and finish — from a single chair to a full room.",
        image: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=900&q=80",
        cta: { label: "Request a quote", href: "/custom-order" }
    },
    {
        title: "Furniture Repair",
        description: "Broken joints, wobbly legs, worn hinges, cracked panels — we repair solid wood furniture rather than replace it.",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&q=80",
        cta: { label: "Book a repair", href: "/book-appointment?service=REPAIR" }
    },
    {
        title: "Restoration & Refinishing",
        description: "Strip, sand, and refinish older or inherited pieces — bring worn or dated furniture back to daily use.",
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80",
        cta: { label: "Book restoration", href: "/book-appointment?service=RESTORATION" }
    },
    {
        title: "Design Consultation",
        description: "Not sure what would fit your space? Sit down with us — in the workshop or at your home — before committing to anything.",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900&q=80",
        cta: { label: "Book a consultation", href: "/book-appointment?service=CONSULTATION" }
    },
    {
        title: "Delivery & Assembly",
        description: "Careful delivery and on-site assembly across Nairobi, scheduled around you.",
        image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&q=80",
        cta: { label: "Schedule delivery", href: "/book-appointment?service=DELIVERY_ASSEMBLY" }
    },
    {
        title: "Workshop Visits",
        description: "Come see the workshop in Kasarani, meet the team, and look at timber and finishes in person before you order.",
        image: "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=900&q=80",
        cta: { label: "Book a visit", href: "/book-appointment?service=WORKSHOP_VISIT" }
    }
];
export default function ServicesPage() {
    return (<div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-widest text-wood">What We Offer</p>
      <h1 className="mt-2 font-serif text-4xl font-bold text-charcoal">Services</h1>
      <p className="mt-4 max-w-2xl text-charcoal/70">
        Eden Woodcrafts isn't just a shop — it's a workshop. Beyond selling furniture, we repair,
        restore, and consult on pieces you already own, and we'll come to you for delivery,
        assembly, or a first look at your space.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (<div key={s.title} className="overflow-hidden rounded-xl2 border border-wood/10 bg-white shadow-sm">
            <div className="relative aspect-[4/3] w-full">
              <Image src={s.image} alt={s.title} fill className="object-cover"/>
            </div>
            <div className="p-5">
              <h2 className="font-serif text-lg font-semibold text-charcoal">{s.title}</h2>
              <p className="mt-2 text-sm text-charcoal/70">{s.description}</p>
              <Link href={s.cta.href} className="mt-4 inline-block text-sm font-medium text-forest hover:underline">
                {s.cta.label} →
              </Link>
            </div>
          </div>))}
      </div>

      <div className="mt-14 rounded-xl2 border border-wood/10 bg-forest/5 p-8 text-center">
        <h2 className="font-serif text-xl font-bold text-charcoal">Not sure which one you need?</h2>
        <p className="mt-2 text-charcoal/70">Book a consultation and we'll figure it out together.</p>
        <Link href="/book-appointment" className="mt-4 inline-block">
          <Button>Book an Appointment</Button>
        </Link>
      </div>
    </div>);
}
