import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

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
          <Badge className="absolute top-2 left-2 gradient-primary border-0 text-primary-foreground text-xs">-{discount}%</Badge>
        )}
        {product.isFlashSale && (
          <Badge className="absolute top-2 right-10 bg-destructive border-0 text-destructive-foreground text-xs">Flash</Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-card/80 backdrop-blur-sm hover:bg-card"
          onClick={() => toggleItem(product)}
        >
          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-destructive text-destructive" : ""}`} />
        </Button>
      </div>
      <div className="p-3">
        <Link to={`/product/${product.id}`} className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">{product.name}</Link>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 fill-warning text-warning" />
          <span className="text-xs text-muted-foreground">{product.rating} ({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="font-display font-bold text-lg">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-1.5">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <Button size="icon" className="h-8 w-8 gradient-primary border-0 text-primary-foreground" onClick={() => addItem(product)}>
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
