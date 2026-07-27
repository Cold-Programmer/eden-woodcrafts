import Link from "next/link";
import { SocialLinks } from "./SocialLinks";
export function Footer() {
    return (<footer className="border-t border-wood/10 bg-[#1c1815] text-[#efe9e1]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-gold">Eden Woodcrafts</h3>
          <p className="mt-3 text-sm text-[#efe9e1]/70">
            Handcrafted furniture from a Nairobi workshop — Kasarani Carwash.
          </p>
          <div className="mt-4">
            <SocialLinks />
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">Shop</h4>
          <ul className="space-y-2 text-sm text-[#efe9e1]/70">
            <li><Link href="/shop">All Products</Link></li>
            <li><Link href="/custom-order">Custom Furniture</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/book-appointment">Book Appointment</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">Company</h4>
          <ul className="space-y-2 text-sm text-[#efe9e1]/70">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">Contact</h4>
          <ul className="space-y-2 text-sm text-[#efe9e1]/70">
            <li>Nairobi, Kasarani Carwash</li>
            <li>+254 702 543 867</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#efe9e1]/10 py-4 text-center text-xs text-[#efe9e1]/50">
        © {new Date().getFullYear()} Eden Woodcrafts. All rights reserved.
      </div>
    </footer>);
}
