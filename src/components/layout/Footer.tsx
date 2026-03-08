import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const { settings } = useStore();
  return (
    <footer className="bg-foreground text-background/80 mt-12 sm:mt-16">
      <div className="container mx-auto py-8 sm:py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display font-bold text-lg sm:text-xl text-background mb-3 sm:mb-4">{settings.storeName}</h3>
            <p className="text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{settings.footerDescription}</p>
            <div className="flex gap-3">
              {settings.socialFacebook && <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"><Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></a>}
              {settings.socialInstagram && <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"><Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></a>}
              {settings.socialTwitter && <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"><Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></a>}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background text-sm sm:text-base mb-3 sm:mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Link to="/products" className="hover:text-primary transition-colors">All Products</Link>
              <Link to="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link>
              <Link to="/best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link>
              <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background text-sm sm:text-base mb-3 sm:mb-4">Support</h4>
            <nav className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
              <Link to="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link>
              <Link to="/returns" className="hover:text-primary transition-colors">Returns & Refund</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            </nav>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display font-semibold text-background text-sm sm:text-base mb-3 sm:mb-4">Contact</h4>
            <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" /> <span className="truncate">{settings.contactEmail}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" /> {settings.contactPhone}</div>
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" /> {settings.contactAddress}</div>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
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
