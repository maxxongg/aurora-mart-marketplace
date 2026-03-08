import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [payment, setPayment] = useState("cod");
  const shipping = total >= 50 ? 0 : 5.99;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Order placed successfully!");
    clearCart();
    navigate("/orders");
  };

  if (items.length === 0) { navigate("/cart"); return null; }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="font-display font-bold mb-4">Shipping Information</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" required placeholder="John Doe" /></div>
                <div><Label htmlFor="phone">Phone</Label><Input id="phone" required placeholder="+880 1234567890" /></div>
              </div>
              <div><Label htmlFor="address">Address</Label><Input id="address" required placeholder="123 Main St" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="city">City</Label><Input id="city" required placeholder="Dhaka" /></div>
                <div><Label htmlFor="zip">ZIP Code</Label><Input id="zip" required placeholder="1205" /></div>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h2 className="font-display font-bold mb-4">Payment Method</h2>
            <RadioGroup value={payment} onValueChange={setPayment} className="space-y-3">
              {[
                { value: "cod", icon: Banknote, label: "Cash on Delivery" },
                { value: "bkash", icon: Smartphone, label: "bKash" },
                { value: "stripe", icon: CreditCard, label: "Credit/Debit Card" },
              ].map(({ value, icon: Icon, label }) => (
                <label key={value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${payment === value ? "border-primary bg-accent" : ""}`}>
                  <RadioGroupItem value={value} />
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-lg p-6 sticky top-24">
            <h2 className="font-display font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <img src={item.product.image} alt="" className="h-12 w-12 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1">{item.product.name}</p>
                    <p className="text-muted-foreground">{item.quantity} × ${item.product.price.toFixed(2)}</p>
                  </div>
                  <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-display font-bold text-lg mb-6">
              <span>Total</span><span>${(total + shipping).toFixed(2)}</span>
            </div>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Place Order</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
