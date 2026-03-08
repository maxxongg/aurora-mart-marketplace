import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types";
import { toast } from "sonner";

interface WishlistContextType {
  items: Product[];
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType>({} as WishlistContextType);

export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const toggleItem = (product: Product) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        toast.info("Removed from wishlist");
        return prev.filter((p) => p.id !== product.id);
      }
      toast.success("Added to wishlist");
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => items.some((p) => p.id === productId);
  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, toggleItem, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
