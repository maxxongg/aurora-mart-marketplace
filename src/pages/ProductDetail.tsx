import { useParams, Link } from "react-router-dom";
import { mockProducts, mockCategories } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Minus, Plus, ArrowLeft, Truck, Shield, RefreshCw } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const product = mockProducts.find((p) => p.id === id);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return <div className="container mx-auto py-20 text-center"><h1 className="text-2xl font-bold mb-4">Product not found</h1><Button asChild><Link to="/products">Browse Products</Link></Button></div>;

  const category = mockCategories.find((c) => c.id === product.categoryId);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const images = product.images?.length ? product.images : [product.image];
  const related = mockProducts.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="container mx-auto py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" /> Back to products</Link>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-4">
            <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition ${i === selectedImage ? "border-primary" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            {category && <Badge variant="secondary">{category.name}</Badge>}
            {product.isFlashSale && <Badge className="bg-destructive border-0 text-destructive-foreground">Flash Sale</Badge>}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-warning text-warning" : "text-muted"}`} />)}</div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>}
            {discount > 0 && <Badge className="gradient-primary border-0 text-primary-foreground">{discount}% OFF</Badge>}
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="icon" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <Button variant="ghost" size="icon" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
            <span className="text-sm text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          </div>
          <div className="flex gap-3 mb-8">
            <Button className="flex-1 gradient-primary border-0 text-primary-foreground" onClick={() => addItem(product, qty)} disabled={product.stock === 0}>
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button variant="outline" size="icon" onClick={() => toggleItem(product)}>
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-destructive text-destructive" : ""}`} />
            </Button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><Truck className="h-4 w-4 text-primary" /> Free shipping on orders over $50</div>
            <div className="flex items-center gap-3"><Shield className="h-4 w-4 text-primary" /> Secure checkout</div>
            <div className="flex items-center gap-3"><RefreshCw className="h-4 w-4 text-primary" /> 30-day return policy</div>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
