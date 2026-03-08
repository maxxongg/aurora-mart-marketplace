import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 sm:py-20 text-center px-4">
        <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-xl sm:text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground text-sm sm:text-base mb-6">Looks like you haven't added anything yet.</p>
        <Button asChild className="gradient-primary border-0 text-primary-foreground"><Link to="/products">Start Shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-8">
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart ({itemCount})</h1>
      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-card">
              <Link to={`/product/${item.product.id}`} className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden shrink-0">
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`} className="font-medium text-sm sm:text-base hover:text-primary transition-colors line-clamp-1">{item.product.name}</Link>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">${item.product.price.toFixed(2)} each</p>
                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <div className="flex items-center border rounded-lg">
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-7 sm:w-8 text-center text-xs sm:text-sm">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-display font-bold text-sm sm:text-base">${(item.product.price * item.quantity).toFixed(2)}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}><Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card border rounded-lg p-5 sm:p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{total >= 50 ? "Free" : "$5.99"}</span></div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-display font-bold text-lg mb-6">
            <span>Total</span><span>${(total >= 50 ? total : total + 5.99).toFixed(2)}</span>
          </div>
          <Button asChild className="w-full gradient-primary border-0 text-primary-foreground">
            <Link to="/checkout">Proceed to Checkout <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
