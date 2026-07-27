import clsx from "clsx";
export function Button({ variant = "primary", loading, disabled, className, children, ...props }) {
    return (<button disabled={disabled || loading} className={clsx("inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium", "transition-[background-color,color,transform,box-shadow] duration-150 ease-out", "hover:-translate-y-px active:translate-y-0 active:scale-[0.98]", "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0", variant === "primary" && "bg-forest text-warmwhite hover:bg-forest-light hover:shadow-md", variant === "secondary" && "bg-gold text-charcoal hover:brightness-95 hover:shadow-md", variant === "outline" && "border border-forest text-forest hover:bg-forest/5", variant === "danger" && "bg-red-600 text-white hover:bg-red-700 hover:shadow-md", className)} {...props}>
      {loading && (<span aria-hidden="true" className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"/>)}
      {children}
    </button>);
}
