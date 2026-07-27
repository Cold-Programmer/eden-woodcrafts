export default function ContactPage() {
    return (<div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-charcoal">Contact Us</h1>
      <p className="mt-3 text-charcoal/70">
        Visit our workshop or reach out directly — we're happy to talk through your project.
      </p>
      <div className="mt-8 space-y-2 text-charcoal">
        <p><strong>Location:</strong> Nairobi, Kasarani Carwash</p>
        <p><strong>Phone:</strong> +254 702 543 867</p>
        <p><strong>Business name:</strong> Eden Woodcrafts</p>
      </div>
      <p className="mt-8 text-sm text-charcoal/50">
        A contact form with server-side email delivery is on the roadmap for the next iteration —
        for now, please call or WhatsApp us directly.
      </p>
    </div>);
}
