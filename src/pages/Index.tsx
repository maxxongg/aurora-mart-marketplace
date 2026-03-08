import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Truck, RefreshCw, Headphones, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockProducts, mockCategories, mockBanners, mockSettings } from "@/data/mock";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const banners = mockBanners.filter((b) => b.isActive);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative rounded-xl overflow-hidden aspect-[21/9] md:aspect-[3/1]">
      {banners.map((banner, i) => (
        <Link key={banner.id} to={banner.link} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}>
          <img src={banner.image} alt={banner.altText} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent flex items-center">
            <div className="p-8 md:p-12 max-w-lg">
              <h2 className="font-display text-2xl md:text-4xl font-bold text-background mb-3">{banner.altText}</h2>
              <Button className="gradient-primary border-0 text-primary-foreground">
                Shop Now <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </Link>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-primary" : "w-2 bg-background/50"}`} />
        ))}
      </div>
      <button onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)} className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/20 backdrop-blur flex items-center justify-center hover:bg-background/40 transition"><ChevronLeft className="h-5 w-5 text-background" /></button>
      <button onClick={() => setCurrent((c) => (c + 1) % banners.length)} className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/20 backdrop-blur flex items-center justify-center hover:bg-background/40 transition"><ChevronRight className="h-5 w-5 text-background" /></button>
    </div>
  );
}

function CountdownTimer() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(mockSettings.flashSaleEnd).getTime() - Date.now());
      setTime({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2">
      {[["h", time.h], ["m", time.m], ["s", time.s]].map(([label, val]) => (
        <div key={label as string} className="gradient-primary text-primary-foreground rounded-lg px-3 py-1.5 text-center min-w-[48px]">
          <div className="font-display font-bold text-lg leading-tight">{String(val).padStart(2, "0")}</div>
          <div className="text-[10px] uppercase opacity-80">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const flashSaleProducts = mockProducts.filter((p) => p.isFlashSale);
  const newArrivals = [...mockProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
  const bestSellers = [...mockProducts].sort((a, b) => b.totalSold - a.totalSold).slice(0, 8);

  const trustBadges = [
    { icon: Truck, title: "Free Shipping", desc: "On orders $50+" },
    { icon: Shield, title: "Secure Payment", desc: "100% protected" },
    { icon: RefreshCw, title: "Easy Returns", desc: "30-day policy" },
    { icon: Headphones, title: "24/7 Support", desc: "We're here to help" },
  ];

  return (
    <div className="space-y-12 pb-8">
      {/* Hero */}
      <section className="container mx-auto pt-6">
        <HeroSlider />
      </section>

      {/* Categories */}
      <section className="container mx-auto">
        <h2 className="font-display text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {mockCategories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="group text-center">
              <div className="aspect-square rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors mx-auto mb-2 w-16 h-16 md:w-20 md:h-20">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="text-xs font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl font-bold">Flash Sale</h2>
            </div>
            <CountdownTimer />
          </div>
          <Button variant="ghost" asChild><Link to="/products?flash=true">View All <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flashSaleProducts.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Offer Banner */}
      <section className="container mx-auto">
        <div className="gradient-hero rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Spring Collection 2026</h2>
            <p className="text-muted-foreground mb-4">Discover the latest trends at unbeatable prices</p>
            <Button className="gradient-primary border-0 text-primary-foreground" asChild><Link to="/products">Shop Now <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
          </div>
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop" alt="Spring collection" className="rounded-lg w-full md:w-72 h-48 object-cover" />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">New Arrivals</h2>
          <Button variant="ghost" asChild><Link to="/new-arrivals">View All <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newArrivals.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Trust */}
      <section className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustBadges.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} whileHover={{ y: -2 }} className="flex items-center gap-3 p-4 rounded-lg border bg-card">
              <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Best Sellers</h2>
          <Button variant="ghost" asChild><Link to="/best-sellers">View All <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bestSellers.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
