export function EmptyState({ title, description, action }) {
    return (<div className="flex flex-col items-center rounded-xl2 border border-dashed border-wood/20 px-6 py-14 text-center">
      <h3 className="font-serif text-lg font-semibold text-charcoal">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-charcoal/60">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>);
}
