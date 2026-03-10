import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { CreditCard, Banknote, Smartphone, Tag } from "lucide-react";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { settings, applyCoupon, addOrder } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState("cod");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const shipping = total >= settings.freeShippingThreshold ? 0 : settings.shippingCost;
  const grandTotal = Math.max(0, total - discount + shipping);

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode, total);
    setDiscount(result.valid ? result.discount : 0);
    setCouponMsg(result.message);
    if (result.valid) toast.success(result.message);
    else toast.error(result.message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      userId: user?.id || "guest",
      items: items.map((item, i) => ({ id: String(i + 1), productId: item.product.id, quantity: item.quantity, price: item.product.price })),
      total: grandTotal,
      status: "pending" as const,
      shippingName: formData.get("name") as string,
      shippingPhone: formData.get("phone") as string,
      shippingAddress: formData.get("address") as string,
      shippingCity: formData.get("city") as string,
      shippingZip: formData.get("zip") as string,
      paymentMethod: payment as any,
      paymentStatus: payment === "cod" ? "unpaid" as const : "paid" as const,
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    toast.success("Order placed successfully!");
    clearCart();
    navigate("/orders");
  };

  if (!user) { navigate("/auth?tab=register&redirect=/checkout"); return null; }
  if (items.length === 0) { navigate("/cart"); return null; }

  return (
    <div className="container mx-auto py-6 sm:py-8 max-w-4xl">
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        <div className="lg:col-span-3 space-y-5 sm:space-y-6">
          <div className="bg-card border rounded-lg p-4 sm:p-6">
            <h2 className="font-display font-bold mb-4">Shipping Information</h2>
            <div className="grid gap-3 sm:gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" name="name" required placeholder="John Doe" /></div>
                <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" required placeholder="+880 1234567890" /></div>
              </div>
              <div><Label htmlFor="address">Address</Label><Input id="address" name="address" required placeholder="123 Main St" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div><Label htmlFor="city">City</Label><Input id="city" name="city" required placeholder="Dhaka" /></div>
                <div><Label htmlFor="zip">ZIP Code</Label><Input id="zip" name="zip" required placeholder="1205" /></div>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4 sm:p-6">
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
          <div className="bg-card border rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-display font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-52 sm:max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <img src={item.product.image} alt="" className="h-11 w-11 sm:h-12 sm:w-12 rounded object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1 text-xs sm:text-sm">{item.product.name}</p>
                    <p className="text-muted-foreground text-xs">{item.quantity} × {settings.currency}{item.product.price.toFixed(2)}</p>
                  </div>
                  <span className="font-medium text-xs sm:text-sm shrink-0">{settings.currency}{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="pl-9 h-9 text-sm" />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleApplyCoupon} className="h-9">Apply</Button>
            </div>
            {couponMsg && <p className={`text-xs mb-3 ${discount > 0 ? "text-success" : "text-destructive"}`}>{couponMsg}</p>}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{settings.currency}{total.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{settings.currency}{discount.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `${settings.currency}${shipping.toFixed(2)}`}</span></div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-display font-bold text-lg mb-6">
              <span>Total</span><span>{settings.currency}{grandTotal.toFixed(2)}</span>
            </div>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Place Order</Button>
          </div>
        </div>
      </form>
    </div>
  );
}