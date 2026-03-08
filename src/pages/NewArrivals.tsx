import { mockProducts } from "@/data/mock";
import ProductCard from "@/components/ProductCard";

export default function NewArrivals() {
  const products = [...mockProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return (
    <div className="container mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-8">New Arrivals</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
