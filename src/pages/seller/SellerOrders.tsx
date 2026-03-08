import { useStore } from "@/context/StoreContext";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { TrackOrderButton } from "@/components/OrderTracking";
import type { OrderStatus } from "@/types";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning", processing: "bg-primary/10 text-primary",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", delivered: "bg-success/10 text-success", cancelled: "bg-destructive/10 text-destructive",
};

export default function SellerOrders() {
  const { orders, updateOrder, products, settings } = useStore();
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">My Orders</h1>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Date</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Update</TableHead><TableHead className="w-24">Track</TableHead></TableRow></TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{settings.currency}{o.total.toFixed(2)}</TableCell>
                <TableCell><Badge className={statusColors[o.status]}>{o.status}</Badge></TableCell>
                <TableCell>
                  <Select defaultValue={o.status} onValueChange={(v: OrderStatus) => { updateOrder(o.id, { status: v }); toast.success(`Order ${o.id} updated to ${v}`); }}>
                    <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>{(["pending","processing","shipped","delivered","cancelled"] as OrderStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <TrackOrderButton
                    order={o}
                    products={products}
                    currency={settings.currency}
                    canUpdateStatus
                    onUpdateStatus={(id, status) => updateOrder(id, { status })}
                    size="sm"
                    variant="ghost"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
