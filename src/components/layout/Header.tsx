import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, Search, Menu, ChevronDown, Moon, Sun, SlidersHorizontal, X, Star } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

function SearchBox({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { products, categories, settings } = useStore();

  const priceBounds = useMemo(() => {
    const active = products.filter(p => p.status === "active");
    if (active.length === 0) return { min: 0, max: 500 };
    return { min: Math.floor(Math.min(...active.map(p => p.price))), max: Math.ceil(Math.max(...active.map(p => p.price))) };
  }, [products]);

  useEffect(() => { setPriceRange([priceBounds.min, priceBounds.max]); }, [priceBounds]);

  const results = useMemo(() => {
    if (!query.trim()) return { products: [], categories: [] };
    const q = query.toLowerCase();
    let matchedProducts = products.filter((p) => p.status === "active" && (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)));
    if (selectedCategory !== "all") matchedProducts = matchedProducts.filter(p => p.categoryId === selectedCategory);
    matchedProducts = matchedProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0) matchedProducts = matchedProducts.filter(p => p.rating >= minRating);
    if (onlyOnSale) matchedProducts = matchedProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
    const matchedCategories = categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3);
    return { products: matchedProducts.slice(0, 5), categories: matchedCategories };
  }, [query, products, categories, selectedCategory, priceRange, minRating, onlyOnSale]);

  const hasResults = results.products.length > 0 || results.categories.length > 0;
  const activeFilterCount = (selectedCategory !== "all" ? 1 : 0) + (minRating > 0 ? 1 : 0) + (onlyOnSale ? 1 : 0) + (priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max ? 1 : 0);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (priceRange[0] > priceBounds.min) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] < priceBounds.max) params.set("maxPrice", String(priceRange[1]));
    if (minRating > 0) params.set("minRating", String(minRating));
    if (onlyOnSale) params.set("sale", "true");
    return `/products?${params.toString()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(buildSearchUrl());
    setOpen(false);
    setQuery("");
  };

  const handleSelect = (productId: string) => { setOpen(false); setQuery(""); navigate(`/product/${productId}`); };
  const handleCategorySelect = (catId: string) => { setOpen(false); setQuery(""); navigate(`/products?category=${catId}`); };

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange([priceBounds.min, priceBounds.max]);
    setMinRating(0);
    setOnlyOnSale(false);
  };

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      <form onSubmit={handleSubmit} className="flex items-center gap-0 bg-secondary rounded-lg overflow-hidden border border-transparent focus-within:border-primary/50 transition-colors">
        {/* Category Selector - hidden on very small screens */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-auto min-w-[80px] max-w-[120px] sm:min-w-[100px] sm:max-w-[140px] border-0 bg-transparent rounded-none border-r border-border/50 text-[11px] sm:text-xs h-9 sm:h-10 px-2 sm:px-2.5 focus:ring-0 shrink-0 hidden xs:flex">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => query && setOpen(true)}
            className="pl-8 sm:pl-10 border-0 bg-transparent rounded-none h-9 sm:h-10 text-sm focus-visible:ring-0"
          />
        </div>

        {/* Filter Button */}
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="rounded-none h-9 sm:h-10 px-2.5 sm:px-3 border-l border-border/50 relative shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full gradient-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">{activeFilterCount}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="end">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Filters</h3>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-6 text-destructive hover:text-destructive px-2">Clear</Button>
              )}
            </div>

            {/* Price Range */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-medium text-muted-foreground">Price Range</label>
              <Slider min={priceBounds.min} max={priceBounds.max} step={1} value={priceRange} onValueChange={(v) => setPriceRange(v as [number, number])} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{settings.currency}{priceRange[0]}</span>
                <span>{settings.currency}{priceRange[1]}</span>
              </div>
            </div>

            <Separator className="my-3" />

            {/* Rating */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-medium text-muted-foreground">Minimum Rating</label>
              <div className="space-y-1.5">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox checked={minRating === rating} onCheckedChange={(v) => setMinRating(v ? rating : 0)} />
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">& up</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator className="my-3" />

            {/* On Sale */}
            <label className="flex items-center gap-2 cursor-pointer text-sm mb-4">
              <Checkbox checked={onlyOnSale} onCheckedChange={(v) => setOnlyOnSale(!!v)} />
              <span>On Sale Only</span>
            </label>

            <Button onClick={(e) => { e.preventDefault(); setFiltersOpen(false); handleSubmit(e as any); }} className="w-full gradient-primary border-0 text-primary-foreground text-sm h-9">
              Apply Filters
            </Button>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <Button type="submit" size="sm" className="rounded-none rounded-r-lg h-10 px-4 gradient-primary border-0 text-primary-foreground shrink-0">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Dropdown Results */}
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
