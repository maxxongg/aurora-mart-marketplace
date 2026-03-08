import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle2, Clock, XCircle, MapPin, Phone, CreditCard, Eye } from "lucide-react";
import type { Order, OrderStatus, Product } from "@/types";
import { toast } from "sonner";

const ORDER_STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: "pending", label: "Order Placed", icon: Clock },
  { status: "processing", label: "Processing", icon: Package },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-primary/10 text-primary border-primary/20",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

function getStepIndex(status: OrderStatus): number {
  if (status === "cancelled") return -1;
  return ORDER_STEPS.findIndex((s) => s.status === status);
}

interface OrderTrackingDialogProps {
  order: Order;
  products: Product[];
  currency: string;
  canUpdateStatus?: boolean;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderTrackingDialog({
  order,
  products,
  currency,
  canUpdateStatus = false,
  onUpdateStatus,
  open,
  onOpenChange,
}: OrderTrackingDialogProps) {
  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order {order.id}</span>
            <Badge className={statusColors[order.status]}>{order.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Timeline Tracker */}
        <div className="py-4">
          <h3 className="text-sm font-semibold mb-4">Order Tracking</h3>
          {isCancelled ? (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <XCircle className="h-8 w-8 text-destructive shrink-0" />
              <div>
                <p className="font-semibold text-destructive">Order Cancelled</p>
                <p className="text-sm text-muted-foreground">This order has been cancelled.</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {ORDER_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={step.status} className="flex gap-3 relative">
                    {/* Vertical line */}
                    {idx < ORDER_STEPS.length - 1 && (
                      <div
                        className={`absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-10px)] ${
                          idx < currentStep ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                    {/* Icon circle */}
                    <div
                      className={`relative z-10 flex items-center justify-center h-8 w-8 rounded-full shrink-0 transition-colors ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""}`}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    {/* Label */}
                    <div className={`pb-6 ${isCompleted ? "" : "opacity-50"}`}>
                      <p className={`text-sm font-medium ${isCurrent ? "text-primary" : ""}`}>{step.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {isCompleted && idx === 0 && new Date(order.createdAt).toLocaleString()}
                        {isCurrent && idx > 0 && "In progress..."}
                        {!isCompleted && "Pending"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

        {/* Order Items */}
        <div className="py-3">
          <h3 className="text-sm font-semibold mb-3">Items</h3>
          <div className="space-y-2">
            {order.items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              return (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  {product && (
                    <img src={product.image} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
                  )}
                  <span className="flex-1 min-w-0 truncate">{product?.name || "Product"}</span>
                  <span className="text-muted-foreground shrink-0">×{item.quantity}</span>
                  <span className="font-medium shrink-0">{currency}{item.price.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-display font-bold">{currency}{order.total.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Shipping & Payment Info */}
        <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Shipping
            </h3>
            <p>{order.shippingName}</p>
            <p className="text-muted-foreground">{order.shippingAddress}</p>
            <p className="text-muted-foreground">{order.shippingCity}, {order.shippingZip}</p>
            <p className="flex items-center gap-1 text-muted-foreground mt-1">
              <Phone className="h-3 w-3" /> {order.shippingPhone}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> Payment
            </h3>
            <p>Method: <span className="font-medium uppercase">{order.paymentMethod}</span></p>
            <p>Status: <Badge variant="outline" className="text-xs ml-1">{order.paymentStatus}</Badge></p>
          </div>
        </div>

        {/* Status Update (Admin/Seller only) */}
        {canUpdateStatus && onUpdateStatus && (
          <>
            <Separator />
            <div className="py-3">
              <h3 className="text-sm font-semibold mb-2">Update Status</h3>
              <Select
                value={order.status}
                onValueChange={(v: OrderStatus) => {
                  onUpdateStatus(order.id, v);
                  toast.success(`Order ${order.id} updated to ${v}`);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["pending", "processing", "shipped", "delivered", "cancelled"] as OrderStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface TrackOrderButtonProps {
  order: Order;
  products: Product[];
  currency: string;
  canUpdateStatus?: boolean;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "icon" | "default";
}

export function TrackOrderButton({
  order,
  products,
  currency,
  canUpdateStatus,
  onUpdateStatus,
  variant = "outline",
  size = "sm",
}: TrackOrderButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        <Eye className="h-3.5 w-3.5 mr-1.5" /> Track
      </Button>
      <OrderTrackingDialog
        order={order}
        products={products}
        currency={currency}
        canUpdateStatus={canUpdateStatus}
        onUpdateStatus={onUpdateStatus}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
