import { useStore } from "@/context/StoreContext";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-primary/10 text-primary border-primary/20",
  shipped: "bg-blue-100 text-blue-700 border-blue-200",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function OrderHistory() {
  const { orders, products } = useStore();
  return (
    <div className="container mx-auto py-8">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border rounded-lg p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <span className="font-display font-bold text-lg">{order.id}</span>
                <span className="text-sm text-muted-foreground ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <Badge className={statusColors[order.status]}>{order.status}</Badge>
                <Badge variant="outline">{order.paymentMethod.toUpperCase()}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => {
                const product = mockProducts.find((p) => p.id === item.productId);
                return (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    {product && <img src={product.image} alt="" className="h-10 w-10 rounded object-cover" />}
                    <span className="flex-1">{product?.name || "Product"}</span>
                    <span className="text-muted-foreground">×{item.quantity}</span>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Shipping: {order.shippingCity}</span>
              <span className="font-display font-bold">Total: ${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
