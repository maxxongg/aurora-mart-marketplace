import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Truck, RefreshCw, Headphones, Zap, Heart, Star, Clock, Award, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const { banners } = useStore();
  const activeBanners = banners.filter((b) => b.isActive);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % activeBanners.length), 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  return (
    <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[21/9] md:aspect-[3/1]">
      {activeBanners.map((banner, i) => (
        <Link key={banner.id} to={banner.link} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}>
          <img src={banner.image} alt={banner.altText} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent flex items-end sm:items-center">
            <div className="p-5 sm:p-8 md:p-12 max-w-lg">
              <h2 className="font-display text-xl sm:text-2xl md:text-4xl font-bold text-background mb-1 sm:mb-2">{banner.altText}</h2>
              {banner.subtitle && <p className="text-background/80 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">{banner.subtitle}</p>}
              <Button size="sm" className="gradient-primary border-0 text-primary-foreground sm:h-10 sm:px-4 sm:text-sm">{banner.ctaText || "Shop Now"} <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </div>
        </Link>
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {activeBanners.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? "w-6 sm:w-8 bg-primary" : "w-2 bg-background/50"}`} />))}
      </div>
      {activeBanners.length > 1 && <>
        <button onClick={() => setCurrent((c) => (c - 1 + activeBanners.length) % activeBanners.length)} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-background/20 backdrop-blur flex items-center justify-center hover:bg-background/40 transition"><ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-background" /></button>
        <button onClick={() => setCurrent((c) => (c + 1) % activeBanners.length)} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-background/20 backdrop-blur flex items-center justify-center hover:bg-background/40 transition"><ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-background" /></button>
      </>}
    </div>
  );
}

function CountdownTimer() {
  const { settings } = useStore();
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(settings.flashSaleEnd).getTime() - Date.now());
      setTime({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [settings.flashSaleEnd]);

  return (
    <div className="flex gap-1.5 sm:gap-2">
      {[["h", time.h], ["m", time.m], ["s", time.s]].map(([label, val]) => (
        <div key={label as string} className="gradient-primary text-primary-foreground rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-center min-w-[36px] sm:min-w-[48px]">
          <div className="font-display font-bold text-sm sm:text-lg leading-tight">{String(val).padStart(2, "0")}</div>
          <div className="text-[8px] sm:text-[10px] uppercase opacity-80">{label}</div>
        </div>
      ))}
    </div>
  );
}

const iconMap: Record<string, LucideIcon> = { Truck, Shield, RefreshCw, Headphones, Heart, Star, Clock, Award, Zap };

export default function Index() {
  const { products, categories, offerBanners, settings } = useStore();
  const flashSaleProducts = products.filter((p) => p.isFlashSale && p.status === "active");
  const newArrivals = [...products].filter((p) => p.status === "active").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
  const bestSellers = [...products].filter((p) => p.status === "active").sort((a, b) => b.totalSold - a.totalSold).slice(0, 8);
  const activeOffer = offerBanners.find((o) => o.isActive);

  const trustBadges = settings.trustBadges.map((b) => ({ ...b, Icon: iconMap[b.icon] || Shield }));

  return (
    <div className="space-y-8 sm:space-y-12 pb-8">
      <section className="container mx-auto pt-4 sm:pt-6"><HeroSlider /></section>

      <section className="container mx-auto">
        <h2 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Shop by Category</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-8 md:overflow-visible md:pb-0 scrollbar-hide">
          {categories.sort((a, b) => a.sortOrder - b.sortOrder).map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="group text-center shrink-0 snap-start">
              <div className="aspect-square rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors mx-auto mb-2 w-16 h-16 md:w-20 md:h-20">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {flashSaleProducts.length > 0 && (
        <section className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2"><Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" /><h2 className="font-display text-xl sm:text-2xl font-bold">Flash Sale</h2></div>
              <CountdownTimer />
            </div>
            <Button variant="ghost" size="sm" asChild><Link to="/products?flash=true">View All <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {flashSaleProducts.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {activeOffer && (
        <section className="container mx-auto">
          <Link to={activeOffer.link} className="gradient-hero rounded-xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 block">
            <div className="text-center md:text-left">
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-2">{activeOffer.title}</h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-4">{activeOffer.subtitle}</p>
              <Button className="gradient-primary border-0 text-primary-foreground">Shop Now <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </div>
            <img src={activeOffer.image} alt={activeOffer.title} className="rounded-lg w-full md:w-72 h-40 sm:h-48 object-cover" />
          </Link>
        </section>
      )}

      <section className="container mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6"><h2 className="font-display text-xl sm:text-2xl font-bold">New Arrivals</h2><Button variant="ghost" size="sm" asChild><Link to="/new-arrivals">View All <ArrowRight className="h-4 w-4 ml-1" /></Link></Button></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">{newArrivals.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {trustBadges.map(({ Icon, title, desc }) => (
            <motion.div key={title} whileHover={{ y: -2 }} className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border bg-card text-center sm:text-left">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full gradient-primary flex items-center justify-center shrink-0"><Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" /></div>
              <div><p className="font-medium text-xs sm:text-sm">{title}</p><p className="text-[10px] sm:text-xs text-muted-foreground">{desc}</p></div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6"><h2 className="font-display text-xl sm:text-2xl font-bold">Best Sellers</h2><Button variant="ghost" size="sm" asChild><Link to="/best-sellers">View All <ArrowRight className="h-4 w-4 ml-1" /></Link></Button></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">{bestSellers.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>
    </div>
  );
}
