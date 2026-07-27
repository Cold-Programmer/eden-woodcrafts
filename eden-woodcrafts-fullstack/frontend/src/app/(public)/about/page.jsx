import Image from "next/image";
export const metadata = {
    title: "About Us",
    description: "The story behind Eden Woodcrafts — a carpentry workshop in Kasarani, Nairobi."
};
const values = [
    {
        title: "Solid Timber, No Shortcuts",
        body: "We build with solid wood and proper joinery — not veneer over particleboard. Every piece is built to be repaired and refinished for decades, not replaced in five years."
    },
    {
        title: "Made to Your Space",
        body: "Standard sizes rarely fit real Nairobi homes and offices perfectly. Every order — even from the catalog — can be adjusted in size, wood, and finish before it goes into production."
    },
    {
        title: "Quoted Before Committed",
        body: "Custom work gets a written quotation you approve before a single cut is made. No surprise costs partway through a build."
    }
];
export default function AboutPage() {
    return (<div>
      <section className="bg-forest text-warmwhite">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <p className="text-sm uppercase tracking-widest text-gold">Our Story</p>
          <h1 className="mt-2 font-serif text-4xl font-bold">Built in Kasarani, one piece at a time</h1>
          <p className="mt-4 max-w-2xl text-warmwhite/80">
            Eden Woodcrafts is a carpentry workshop run by Samuel Njoroge out of Kasarani Carwash,
            Nairobi. What started as a single workbench making repairs and small commissions for
            neighbors has grown into a full workshop producing beds, seating, dining and office
            furniture, and bespoke pieces for homes and businesses across the city.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl2">
            <Image src="https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=1000&q=80" alt="Carpenter working timber in a workshop" fill className="object-cover"/>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Why we do it this way</h2>
            <p className="mt-3 text-charcoal/80">
              Furniture that's mass-produced is built for a price point, not for your home. We
              work the other way around: we ask what the piece needs to do, what space it lives
              in, and what wood suits it — then we build to that, not to a catalog spec.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-charcoal">What guides the workshop</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {values.map((v) => (<div key={v.title} className="rounded-xl2 border border-wood/10 p-6">
                <h3 className="font-serif text-lg font-semibold text-forest">{v.title}</h3>
                <p className="mt-2 text-sm text-charcoal/70">{v.body}</p>
              </div>))}
          </div>
        </div>
      </section>
    </div>);
}
