import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, Search, Menu, ChevronDown, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useStore } from "@/context/StoreContext";
import { useState, useEffect, useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function SearchBox({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { products, categories, settings } = useStore();

  const results = useMemo(() => {
    if (!query.trim()) return { products: [], categories: [] };
    const q = query.toLowerCase();
    const matchedProducts = products.filter((p) => p.status === "active" && (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))).slice(0, 5);
    const matchedCategories = categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3);
    return { products: matchedProducts, categories: matchedCategories };
  }, [query, products, categories]);

  const hasResults = results.products.length > 0 || results.categories.length > 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (query.trim()) { navigate(`/products?search=${encodeURIComponent(query.trim())}`); setOpen(false); setQuery(""); } };
  const handleSelect = (productId: string) => { setOpen(false); setQuery(""); navigate(`/product/${productId}`); };
  const handleCategorySelect = (catId: string) => { setOpen(false); setQuery(""); navigate(`/products?category=${catId}`); };

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      <form onSubmit={handleSubmit}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input placeholder="Search products, categories..." value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} onFocus={() => query && setOpen(true)} className="pl-10 bg-secondary border-0" />
      </form>
      {open && hasResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-elevated z-50 overflow-hidden max-h-96 overflow-y-auto">
          {results.categories.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50">Categories</div>
              {results.categories.map((c) => (
                <button key={c.id} onClick={() => handleCategorySelect(c.id)} className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-accent transition-colors text-left">
                  <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <span className="text-sm font-medium text-popover-foreground">{c.name}</span>
                </button>
              ))}
            </>
          )}
          {results.products.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50">Products</div>
              {results.products.map((p) => (
                <button key={p.id} onClick={() => handleSelect(p.id)} className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-accent transition-colors text-left">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-md object-cover shrink-0" />
                  <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate text-popover-foreground">{p.name}</p><p className="text-xs text-muted-foreground">{settings.currency}{p.price.toFixed(2)}</p></div>
                </button>
              ))}
            </>
          )}
          <button onClick={handleSubmit as any} className="w-full px-3 py-2 text-sm text-primary font-medium hover:bg-accent transition-colors border-t">View all results for "{query}"</button>
        </div>
      )}
      {open && query.trim() && !hasResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-elevated z-50 p-4 text-center text-sm text-muted-foreground">No products found for "{query}"</div>
      )}
    </div>
  );
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { settings, categories } = useStore();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => { document.documentElement.classList.toggle("dark", isDark); localStorage.setItem("theme", isDark ? "dark" : "light"); }, [isDark]);

  const getDashboardLink = () => { if (!user) return "/auth"; if (user.role === "admin") return "/admin"; if (user.role === "seller") return "/seller"; return "/profile"; };

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <Link to={settings.announcementLink || "/products"} className="block gradient-primary text-primary-foreground text-center py-1.5 text-sm font-medium hover:opacity-90 transition-opacity">
        {settings.announcementText}
      </Link>
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 gap-4">
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button></SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-display font-bold text-gradient">{settings.storeName}</Link>
                <Link to="/products" className="py-2 hover:text-primary transition-colors">All Products</Link>
                <Link to="/new-arrivals" className="py-2 hover:text-primary transition-colors">New Arrivals</Link>
                <Link to="/best-sellers" className="py-2 hover:text-primary transition-colors">Best Sellers</Link>
                {categories.map((cat) => (<Link key={cat.id} to={`/products?category=${cat.id}`} className="py-2 hover:text-primary transition-colors pl-2 text-sm text-muted-foreground">{cat.name}</Link>))}
                <div className="border-t pt-4 mt-2"><Link to="/faq" className="py-2 block hover:text-primary">FAQ</Link><Link to="/contact" className="py-2 block hover:text-primary">Contact</Link></div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="font-display font-bold text-xl md:text-2xl shrink-0">
            {settings.storeLogo ? <img src={settings.storeLogo} alt={settings.storeName} className="h-8" /> : <><span className="text-gradient">{settings.storeName.split(" ")[0]}</span> {settings.storeName.split(" ").slice(1).join(" ")}</>}
          </Link>
          <SearchBox className="hidden md:block flex-1 max-w-xl" />
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors">Categories <ChevronDown className="h-3 w-3" /></DropdownMenuTrigger>
              <DropdownMenuContent>{categories.map((cat) => (<DropdownMenuItem key={cat.id} asChild><Link to={`/products?category=${cat.id}`}>{cat.name}</Link></DropdownMenuItem>))}</DropdownMenuContent>
            </DropdownMenu>
            <Link to="/new-arrivals" className="hover:text-primary transition-colors">New</Link>
            <Link to="/best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link>
          </nav>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</Button>
            <Button variant="ghost" size="icon" asChild className="relative"><Link to="/wishlist"><Heart className="h-5 w-5" />{wishlistItems.length > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] gradient-primary border-0">{wishlistItems.length}</Badge>}</Link></Button>
            <Button variant="ghost" size="icon" asChild className="relative"><Link to="/cart"><ShoppingCart className="h-5 w-5" />{itemCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] gradient-primary border-0">{itemCount}</Badge>}</Link></Button>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">{user?.name}</div>
                  <div className="px-2 pb-1.5 text-xs text-muted-foreground">{user?.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to={getDashboardLink()}>Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/orders">My Orders</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="gradient-primary border-0 text-primary-foreground ml-1"><Link to="/auth">Sign In</Link></Button>
            )}
          </div>
        </div>
        <div className="md:hidden pb-3"><SearchBox /></div>
      </div>
    </header>
  );
}
