import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const { settings } = useStore();
  return (
    <footer className="bg-foreground text-background/80 mt-16">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display font-bold text-xl text-background mb-4">{settings.storeName}</h3>
            <p className="text-sm leading-relaxed mb-4">Your one-stop marketplace for quality products from trusted sellers worldwide.</p>
            <div className="flex gap-3">
              {settings.socialFacebook && <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"><Facebook className="h-4 w-4" /></a>}
              {settings.socialInstagram && <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"><Instagram className="h-4 w-4" /></a>}
              {settings.socialTwitter && <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"><Twitter className="h-4 w-4" /></a>}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/products" className="hover:text-primary transition-colors">All Products</Link>
              <Link to="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link>
              <Link to="/best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link>
              <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Support</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
              <Link to="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link>
              <Link to="/returns" className="hover:text-primary transition-colors">Returns & Refund</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {settings.contactEmail}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {settings.contactPhone}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {settings.contactAddress}</div>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <span>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</span>
          <nav className="flex gap-4">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
