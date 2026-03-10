import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Minus, Plus, ArrowLeft, Truck, Shield, RefreshCw, Zap, User, X, MessageSquare } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/types";

// Demo reviews data
const demoReviews: Review[] = [
  { id: "1", userId: "demo1", userName: "Sarah K.", rating: 5, createdAt: "2026-02-15", comment: "Absolutely love this product! Quality is amazing and it arrived quickly." },
  { id: "2", userId: "demo2", userName: "Mike R.", rating: 4, createdAt: "2026-01-28", comment: "Great value for money. Would recommend to friends and family." },
  { id: "3", userId: "demo3", userName: "Aisha M.", rating: 5, createdAt: "2026-01-10", comment: "Exceeded my expectations. The material is premium and durable." },
  { id: "4", userId: "demo4", userName: "John D.", rating: 3, createdAt: "2025-12-20", comment: "Decent product but packaging could be improved." },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, settings, updateProduct } = useStore();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  if (!product) return <div className="container mx-auto py-20 text-center"><h1 className="text-2xl font-bold mb-4">Product not found</h1><Button asChild><Link to="/products">Browse Products</Link></Button></div>;

  const category = categories.find((c) => c.id === product.categoryId);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const images = product.images?.length ? product.images : [product.image];
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.status === "active").slice(0, 4);
  const c = settings.currency;

  const allReviews = [...demoReviews, ...(product.reviews || [])];
  const avgRating = allReviews.length > 0 ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Please register or log in to add items to cart");
      navigate(`/auth?tab=register&redirect=/product/${product.id}`);
      return;
    }
    addItem(product, qty);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.info("Please register or log in to purchase");
      navigate(`/auth?tab=register&redirect=/product/${product.id}`);
      return;
    }
    addItem(product, qty);
    navigate("/checkout");
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to use wishlist");
      navigate(`/auth?tab=register&redirect=/product/${product.id}`);
      return;
    }
    toggleItem(product);
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to write a review");
      navigate(`/auth?tab=register&redirect=/product/${product.id}`);
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    const newReview: Review = {
      id: Date.now().toString(),
      userId: user!.id,
      userName: user!.name,
      rating: reviewRating,
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString(),
    };
    updateProduct(product.id, {
      reviews: [...(product.reviews || []), newReview],
      reviewCount: product.reviewCount + 1,
      rating: Math.round(((product.rating * product.reviewCount + reviewRating) / (product.reviewCount + 1)) * 10) / 10,
    });
    setReviewComment("");
    setReviewRating(5);
    toast.success("Review submitted!");
  };

  return (
    <div className="container mx-auto py-4 sm:py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 sm:mb-6"><ArrowLeft className="h-4 w-4" /> Back to products</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-3 sm:mb-4"><img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" /></div>
          {images.length > 1 && (<div className="flex gap-2">{images.map((img, i) => (<button key={i} onClick={() => setSelectedImage(i)} className={`h-14 w-14 sm:h-16 sm:w-16 rounded-lg overflow-hidden border-2 transition ${i === selectedImage ? "border-primary" : "border-transparent"}`}><img src={img} alt="" className="w-full h-full object-cover" /></button>))}</div>)}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">{category && <Badge variant="secondary">{category.name}</Badge>}{product.isFlashSale && <Badge className="bg-destructive border-0 text-destructive-foreground">Flash Sale</Badge>}</div>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">{product.name}</h1>
          <div className="flex items-center gap-2 mb-3 sm:mb-4"><div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-warning text-warning" : "text-muted"}`} />)}</div><span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span></div>
          <div className="flex items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6"><span className="font-display text-2xl sm:text-3xl font-bold">{c}{product.price.toFixed(2)}</span>{product.originalPrice && <span className="text-base sm:text-lg text-muted-foreground line-through">{c}{product.originalPrice.toFixed(2)}</span>}{discount > 0 && <Badge className="gradient-primary border-0 text-primary-foreground">{discount}% OFF</Badge>}</div>
          <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">{product.description}</p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-medium mb-2 block">Size</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`px-3 py-1.5 rounded-md border text-sm font-medium transition ${selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{size}</button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-medium mb-2 block">Color{selectedColor && `: ${selectedColor}`}</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={`px-3 py-1.5 rounded-md border text-sm font-medium transition ${selectedColor === color ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{color}</button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="flex items-center border rounded-lg"><Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></Button><span className="w-10 sm:w-12 text-center font-medium">{qty}</span><Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></Button></div>
            <span className="text-sm text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          </div>
          <div className="flex gap-3 mb-4">
            <Button className="flex-1 gradient-primary border-0 text-primary-foreground" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleBuyNow} disabled={product.stock === 0}>
              <Zap className="h-4 w-4 mr-2" /> Buy Now
            </Button>
            <Button variant="outline" size="icon" onClick={handleWishlistToggle}>
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-destructive text-destructive" : ""}`} />
            </Button>
          </div>

          {/* Reviews Button */}
          <Button variant="outline" className="w-full mb-6 sm:mb-8" onClick={() => setReviewOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-2" /> Reviews ({allReviews.length})
          </Button>

          <div className="space-y-2.5 sm:space-y-3 text-sm">
            <div className="flex items-center gap-3"><Truck className="h-4 w-4 text-primary shrink-0" /> Free shipping on orders over {c}{settings.freeShippingThreshold}</div>
            <div className="flex items-center gap-3"><Shield className="h-4 w-4 text-primary shrink-0" /> Secure checkout</div>
            <div className="flex items-center gap-3"><RefreshCw className="h-4 w-4 text-primary shrink-0" /> 30-day return policy</div>
          </div>
        </div>
      </div>

      {/* Reviews Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Customer Reviews
              <span className="text-sm font-normal text-muted-foreground">({allReviews.length})</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-5 w-5 ${i < Math.round(avgRating) ? "fill-warning text-warning" : "text-muted"}`} />)}</div>
            <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)} out of 5</span>
          </div>

          {/* Review Form for logged-in users */}
          {isAuthenticated ? (
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold mb-2">Write a Review</h3>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setReviewRating(i + 1)}>
                    <Star className={`h-5 w-5 transition ${i < reviewRating ? "fill-warning text-warning" : "text-muted-foreground/40 hover:text-warning/60"}`} />
                  </button>
                ))}
              </div>
              <Textarea placeholder="Share your experience..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} className="mb-3" />
              <Button size="sm" className="gradient-primary border-0 text-primary-foreground" onClick={handleSubmitReview}>Submit Review</Button>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 mb-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Sign in to write a review</p>
              <Button size="sm" variant="outline" onClick={() => navigate(`/auth?tab=register&redirect=/product/${product.id}`)}>Sign In</Button>
            </div>
          )}

          <div className="space-y-4">
            {allReviews.map((review) => (
              <div key={review.id} className="bg-card border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{review.userName}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-warning text-warning" : "text-muted"}`} />)}</div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {related.length > 0 && (<section className="mt-12 sm:mt-16"><h2 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Related Products</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div></section>)}
    </div>
  );
}
