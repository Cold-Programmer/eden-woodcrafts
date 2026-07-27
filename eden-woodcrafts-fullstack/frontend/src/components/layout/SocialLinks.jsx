// URLs are read from env vars so you can drop in your real profile links
// without touching code. Unset ones simply don't render — no fake/dead
// links to accounts that don't exist. WhatsApp defaults to the business
// number already on file if no override is set.
const SOCIALS = [
    {
        name: "Instagram",
        href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
        icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>)
    },
    {
        name: "Facebook",
        href: process.env.NEXT_PUBLIC_FACEBOOK_URL,
        icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>)
    },
    {
        name: "X (Twitter)",
        href: process.env.NEXT_PUBLIC_X_URL,
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.9 3H21l-6.7 7.6L22.3 21h-6.2l-4.8-6.3L5.7 21H3.6l7.2-8.2L2.6 3h6.3l4.4 5.8zM17.7 19.2h1.2L8.4 4.7H7.1z"/>
      </svg>)
    },
    {
        name: "TikTok",
        href: process.env.NEXT_PUBLIC_TIKTOK_URL,
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M16.5 3c.4 2.2 1.9 3.8 4 4.1v3c-1.5 0-2.9-.5-4-1.3v6.4a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.1a2.8 2.8 0 1 0 2 2.7V3z"/>
      </svg>)
    },
    {
        name: "WhatsApp",
        href: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/254702543867",
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.3.1-.1 0-.3 0-.4L9 8.4c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.6 1.1 2.8c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .2-1.1-.1-.1-.3-.2-.5-.3z"/>
      </svg>)
    }
];
export function SocialLinks() {
    const active = SOCIALS.filter((s) => s.href);
    if (active.length === 0)
        return null;
    return (<div className="flex gap-3">
      {active.map((s) => (<a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#efe9e1]/20 text-[#efe9e1]/80 transition hover:border-gold hover:text-gold">
          {s.icon}
        </a>))}
    </div>);
}
