import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { settings } = useStore();
  const navigate = useNavigate();
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const c = settings.currency;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Please register or log in to add items to cart");
      navigate(`/auth?tab=register&redirect=/product/${product.id}`);
      return;
    }
    addItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-card rounded-lg border shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </Link>
        {discount > 0 && (
          <Badge className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 gradient-primary border-0 text-primary-foreground text-[10px] sm:text-xs px-1.5 sm:px-2">-{discount}%</Badge>
        )}
        {product.isFlashSale && (
          <Badge className="absolute top-1.5 right-8 sm:top-2 sm:right-10 bg-destructive border-0 text-destructive-foreground text-[10px] sm:text-xs px-1.5 sm:px-2">Flash</Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-7 w-7 sm:h-8 sm:w-8 bg-card/80 backdrop-blur-sm hover:bg-card"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!isAuthenticated) { toast.info("Please sign in to use wishlist"); navigate("/auth"); return; } toggleItem(product); }}
        >
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isInWishlist(product.id) ? "fill-destructive text-destructive" : ""}`} />
        </Button>
      </div>
      <div className="p-2.5 sm:p-3">
        <Link to={`/product/${product.id}`} className="font-medium text-xs sm:text-sm line-clamp-2 hover:text-primary transition-colors leading-tight">{product.name}</Link>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 fill-warning text-warning" />
          <span className="text-[10px] sm:text-xs text-muted-foreground">{product.rating} ({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-1.5 sm:mt-2">
          <div className="min-w-0">
            <span className="font-display font-bold text-sm sm:text-lg">{c}{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through ml-1 sm:ml-1.5">{c}{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <Button size="icon" className="h-7 w-7 sm:h-8 sm:w-8 gradient-primary border-0 text-primary-foreground shrink-0" onClick={handleAddToCart}>
            <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}