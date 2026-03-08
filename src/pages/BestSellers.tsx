import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

export default function BestSellers() {
  const { products } = useStore();
  const sorted = [...products].filter(p => p.status === "active").sort((a, b) => b.totalSold - a.totalSold);
  return (
    <div className="container mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Best Sellers</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
