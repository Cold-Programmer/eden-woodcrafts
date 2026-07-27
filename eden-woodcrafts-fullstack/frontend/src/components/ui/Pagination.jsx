import Link from "next/link";
export function Pagination({ page, totalPages, buildHref }) {
    if (totalPages <= 1)
        return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (<nav aria-label="Pagination" className="mt-10 flex justify-center gap-2">
      <Link href={buildHref(Math.max(1, page - 1))} aria-disabled={page === 1} className={`rounded-full px-3 py-1 text-sm ${page === 1 ? "pointer-events-none text-charcoal/30" : "border border-wood/20 text-charcoal"}`}>
        Prev
      </Link>
      {pages.map((p) => (<Link key={p} href={buildHref(p)} aria-current={p === page ? "page" : undefined} className={`rounded-full px-3 py-1 text-sm ${p === page ? "bg-forest text-warmwhite" : "border border-wood/20 text-charcoal"}`}>
          {p}
        </Link>))}
      <Link href={buildHref(Math.min(totalPages, page + 1))} aria-disabled={page === totalPages} className={`rounded-full px-3 py-1 text-sm ${page === totalPages ? "pointer-events-none text-charcoal/30" : "border border-wood/20 text-charcoal"}`}>
        Next
      </Link>
    </nav>);
}
