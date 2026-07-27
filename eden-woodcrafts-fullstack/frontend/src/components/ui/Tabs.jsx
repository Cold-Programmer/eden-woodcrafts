"use client";
import { useState } from "react";
export function Tabs({ tabs }) {
    const [active, setActive] = useState(0);
    return (<div>
      <div role="tablist" className="flex gap-1 border-b border-wood/10">
        {tabs.map((tab, i) => (<button key={tab.label} role="tab" aria-selected={active === i} onClick={() => setActive(i)} className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${active === i ? "border-forest text-forest" : "border-transparent text-charcoal/50 hover:text-charcoal"}`}>
            {tab.label}
          </button>))}
      </div>
      <div role="tabpanel" className="pt-4">
        {tabs[active]?.content}
      </div>
    </div>);
}
