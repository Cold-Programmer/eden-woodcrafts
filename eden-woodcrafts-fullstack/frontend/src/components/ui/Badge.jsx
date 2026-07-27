import clsx from "clsx";
const TONE_STYLES = {
    neutral: "bg-charcoal/10 text-charcoal",
    success: "bg-forest/10 text-forest",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-600",
    gold: "bg-gold/20 text-wood"
};
export function Badge({ children, tone = "neutral", className }) {
    return (<span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", TONE_STYLES[tone], className)}>
      {children}
    </span>);
}
export function Tag({ children, onRemove }) {
    return (<span className="inline-flex items-center gap-1 rounded-full border border-wood/20 px-3 py-1 text-xs text-charcoal">
      {children}
      {onRemove && (<button onClick={onRemove} aria-label="Remove" className="text-charcoal/40 hover:text-charcoal">
          ×
        </button>)}
    </span>);
}
