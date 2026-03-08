import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const [search, setSearch] = useState(searchQuery);
  const [sort, setSort] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || "all");
  const { products, categories } = useStore();

  useEffect(() => { setSearch(searchQuery); }, [searchQuery]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.status === "active");
    if (selectedCategory !== "all") list = list.filter((p) => p.categoryId === selectedCategory);
    if (search) { const q = search.toLowerCase(); list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)); }
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "popular": list.sort((a, b) => b.totalSold - a.totalSold); break;
      default: list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [search, sort, selectedCategory, products]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-6">{search ? `Results for "${search}"` : "All Products"}</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}><SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All Categories</SelectItem>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
        <Select value={sort} onValueChange={setSort}><SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest</SelectItem><SelectItem value="price-asc">Price: Low → High</SelectItem><SelectItem value="price-desc">Price: High → Low</SelectItem><SelectItem value="popular">Most Popular</SelectItem></SelectContent></Select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No products found.</p>}
    </div>
  );
}
