import { useStore } from "@/context/StoreContext";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrackOrderButton } from "@/components/OrderTracking";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-primary/10 text-primary border-primary/20",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function OrderHistory() {
  const { orders, products, settings } = useStore();
  const c = settings.currency;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-16 sm:py-20 text-center px-4">
        <Package className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-xl sm:text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-muted-foreground text-sm sm:text-base mb-6">Start shopping to see your orders here.</p>
        <Button asChild className="gradient-primary border-0 text-primary-foreground"><Link to="/products">Start Shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4">
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Orders</h1>
      <div className="space-y-3 sm:space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div>
                <span className="font-display font-bold text-base sm:text-lg">{order.id}</span>
                <span className="text-xs sm:text-sm text-muted-foreground ml-2 sm:ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusColors[order.status]}>{order.status}</Badge>
                <Badge variant="outline" className="text-xs">{order.paymentMethod.toUpperCase()}</Badge>
                <TrackOrderButton order={order} products={products} currency={c} />
              </div>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <div key={item.id} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    {product && <img src={product.image} alt="" className="h-9 w-9 sm:h-10 sm:w-10 rounded object-cover shrink-0" />}
                    <span className="flex-1 min-w-0 truncate">{product?.name || "Product"}</span>
                    <span className="text-muted-foreground shrink-0">×{item.quantity}</span>
                    <span className="font-medium shrink-0">{c}{item.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t gap-1">
              <span className="text-xs sm:text-sm text-muted-foreground">Shipping: {order.shippingCity}</span>
              <span className="font-display font-bold text-sm sm:text-base">Total: {c}{order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
