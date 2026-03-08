import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const [search, setSearch] = useState(searchQuery);
  const [sort, setSort] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryFilter ? [categoryFilter] : []);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const { products, categories, settings } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setSearch(searchQuery); }, [searchQuery]);
  useEffect(() => { if (categoryFilter) setSelectedCategories([categoryFilter]); }, [categoryFilter]);

  // Extract unique brands and product types from real metadata
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.filter(p => p.status === "active" && p.brand).forEach(p => set.add(p.brand!));
    return Array.from(set).sort();
  }, [products]);

  const productTypes = useMemo(() => {
    const set = new Set<string>();
    products.filter(p => p.status === "active" && p.productType).forEach(p => set.add(p.productType!));
    return Array.from(set).sort();
  }, [products]);

  // Price bounds
  const priceBounds = useMemo(() => {
    const active = products.filter(p => p.status === "active");
    if (active.length === 0) return { min: 0, max: 500 };
    const min = Math.floor(Math.min(...active.map(p => p.price)));
    const max = Math.ceil(Math.max(...active.map(p => p.price)));
    return { min, max };
  }, [products]);

  useEffect(() => { setPriceRange([priceBounds.min, priceBounds.max]); }, [priceBounds]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.status === "active");
    if (selectedCategories.length > 0) list = list.filter((p) => selectedCategories.includes(p.categoryId));
    if (search) { const q = search.toLowerCase(); list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)); }
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedBrands.length > 0) list = list.filter(p => selectedBrands.some(b => p.name.startsWith(b)));
    if (selectedRatings.length > 0) list = list.filter(p => selectedRatings.some(r => p.rating >= r && p.rating < r + 1));
    if (onlyOnSale) list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
    if (onlyInStock) list = list.filter(p => p.stock > 0);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "popular": list.sort((a, b) => b.totalSold - a.totalSold); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [search, sort, selectedCategories, products, priceRange, selectedBrands, selectedRatings, onlyOnSale, onlyInStock]);

  const activeFilterCount = (selectedCategories.length > 0 ? 1 : 0) + (selectedBrands.length > 0 ? 1 : 0) + (selectedRatings.length > 0 ? 1 : 0) + (onlyOnSale ? 1 : 0) + (onlyInStock ? 1 : 0) + (priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setOnlyOnSale(false);
    setOnlyInStock(false);
    setPriceRange([priceBounds.min, priceBounds.max]);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings(prev => prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]);
  };

  const scrollCategories = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
    }
  };

  const FilterContent = () => (
    <div className="space-y-5">
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Active Filters ({activeFilterCount})</span>
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-7 text-destructive hover:text-destructive">Clear All</Button>
        </div>
      )}

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold py-1">
          Categories <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox checked={selectedCategories.includes(cat.id)} onCheckedChange={() => toggleCategory(cat.id)} />
              <span>{cat.name}</span>
              <span className="text-muted-foreground text-xs ml-auto">
                ({products.filter(p => p.categoryId === cat.id && p.status === "active").length})
              </span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold py-1">
          Price Range <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-3">
          <Slider
            min={priceBounds.min}
            max={priceBounds.max}
            step={1}
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            className="w-full"
          />
          <div className="flex items-center gap-2 text-sm">
            <div className="flex-1 border rounded px-2 py-1 text-center text-xs">{settings.currency}{priceRange[0]}</div>
            <span className="text-muted-foreground text-xs">to</span>
            <div className="flex-1 border rounded px-2 py-1 text-center text-xs">{settings.currency}{priceRange[1]}</div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold py-1">
          Brands <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2 max-h-40 overflow-y-auto">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox checked={selectedBrands.includes(brand)} onCheckedChange={() => toggleBrand(brand)} />
              <span>{brand}</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold py-1">
          Rating <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox checked={selectedRatings.includes(rating)} onCheckedChange={() => toggleRating(rating)} />
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">& Up</span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Checkbox checked={onlyOnSale} onCheckedChange={(v) => setOnlyOnSale(!!v)} />
          <span>On Sale Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <Checkbox checked={onlyInStock} onCheckedChange={(v) => setOnlyInStock(!!v)} />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 sm:py-8">
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        {search ? `Results for "${search}"` : "All Products"}
      </h1>

      {/* Scrollable Category Bar */}
      <div className="relative mb-5 sm:mb-6">
        <button onClick={() => scrollCategories("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-card border shadow-sm flex items-center justify-center hover:bg-accent transition-colors -ml-1 hidden sm:flex">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-1 snap-x snap-mandatory">
          <button
            onClick={() => setSelectedCategories([])}
            className={`shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedCategories.length === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-accent border-border"}`}
          >
            All
          </button>
          {categories.sort((a, b) => a.sortOrder - b.sortOrder).map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`shrink-0 snap-start flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedCategories.includes(cat.id) ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-accent border-border"}`}
            >
              <img src={cat.image} alt="" className="h-5 w-5 rounded-full object-cover" />
              {cat.name}
            </button>
          ))}
        </div>
        <button onClick={() => scrollCategories("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-card border shadow-sm flex items-center justify-center hover:bg-accent transition-colors -mr-1 hidden sm:flex">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Search + Sort + Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, description, brand..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low → High</SelectItem>
            <SelectItem value="price-desc">Price: High → Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] gradient-primary border-0 text-primary-foreground">{activeFilterCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <h2 className="font-display font-bold text-lg mb-4 mt-4">Filters</h2>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filter tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCategories.map(id => {
            const cat = categories.find(c => c.id === id);
            return cat ? (
              <Badge key={id} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleCategory(id)}>
                {cat.name} <X className="h-3 w-3" />
              </Badge>
            ) : null;
          })}
          {selectedBrands.map(brand => (
            <Badge key={brand} variant="secondary" className="gap-1 cursor-pointer" onClick={() => toggleBrand(brand)}>
              {brand} <X className="h-3 w-3" />
            </Badge>
          ))}
          {(priceRange[0] > priceBounds.min || priceRange[1] < priceBounds.max) && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setPriceRange([priceBounds.min, priceBounds.max])}>
              {settings.currency}{priceRange[0]} - {settings.currency}{priceRange[1]} <X className="h-3 w-3" />
            </Badge>
          )}
          {onlyOnSale && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setOnlyOnSale(false)}>
              On Sale <X className="h-3 w-3" />
            </Badge>
          )}
          {onlyInStock && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setOnlyInStock(false)}>
              In Stock <X className="h-3 w-3" />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-6 text-destructive hover:text-destructive">Clear All</Button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-card border rounded-lg p-4">
            <h2 className="font-display font-bold mb-4">Filters</h2>
            <FilterContent />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-3">No products match your filters.</p>
              <Button variant="outline" onClick={clearAllFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
