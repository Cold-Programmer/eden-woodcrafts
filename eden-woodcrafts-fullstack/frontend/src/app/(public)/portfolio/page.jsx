import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio",
  description: "Completed carpentry projects by Eden Woodcrafts — custom builds and installations across Nairobi."
};

async function getProjects() {
  const res = await fetch(`${API_BASE_URL}/api/projects`, { next: { revalidate: 30 } });
  if (!res.ok) return [];
  return res.json();
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-sm uppercase tracking-widest text-wood">Completed Work</p>
      <h1 className="mt-2 font-serif text-4xl font-bold text-charcoal">Portfolio</h1>
      <p className="mt-4 max-w-2xl text-charcoal/70">
        A selection of custom commissions completed for homes, offices, and commercial spaces
        around Nairobi. Every project below started as a conversation about the space, not a
        catalog order.
      </p>

      {projects.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No projects published yet"
            description="Check back soon — completed commissions will appear here as they're added."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl2 border border-wood/10 bg-white shadow-sm">
              <div className="relative aspect-[4/3] w-full">
                <Image src={p.image} alt={p.title} fill className="object-cover" />
                {p.status === "IN_PROGRESS" && (
                  <span className="absolute left-3 top-3">
                    <Badge tone="gold">In Progress</Badge>
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-wood">{p.location}</p>
                <h2 className="mt-1 font-serif text-lg font-semibold text-charcoal">{p.title}</h2>
                <p className="mt-2 text-sm text-charcoal/70">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-14 rounded-xl2 border border-wood/10 bg-forest/5 p-8 text-center">
        <h2 className="font-serif text-xl font-bold text-charcoal">Have a similar project in mind?</h2>
        <p className="mt-2 text-charcoal/70">Tell us about your space and we'll send a quotation.</p>
        <Link href="/custom-order" className="mt-4 inline-block rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-warmwhite hover:bg-forest-light">
          Request Custom Furniture
        </Link>
      </div>
    </div>
  );
}
