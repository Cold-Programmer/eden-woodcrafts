import clsx from "clsx";
export function Skeleton({ className }) {
    return (<div className={clsx("rounded-md bg-wood/10", className)} style={{ animation: "skeleton-pulse 1.4s ease-in-out infinite" }} aria-hidden="true"/>);
}
export function ProductCardSkeleton() {
    return (<div className="overflow-hidden rounded-xl2 border border-wood/10 bg-white">
      <Skeleton className="aspect-square w-full"/>
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-1/3"/>
        <Skeleton className="h-4 w-3/4"/>
        <Skeleton className="h-4 w-1/2"/>
      </div>
    </div>);
}
