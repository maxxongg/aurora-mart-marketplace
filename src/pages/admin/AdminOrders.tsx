import { useStore } from "@/context/StoreContext";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import type { OrderStatus } from "@/types";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning", processing: "bg-primary/10 text-primary",
  shipped: "bg-blue-100 text-blue-700", delivered: "bg-success/10 text-success", cancelled: "bg-destructive/10 text-destructive",
};

export default function AdminOrders() {
  const { orders, updateOrder, settings } = useStore();
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Orders ({orders.length})</h1>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>Date</TableHead><TableHead>Total</TableHead><TableHead>Payment</TableHead><TableHead>Status</TableHead><TableHead>Update</TableHead></TableRow></TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell className="text-sm">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{settings.currency}{o.total.toFixed(2)}</TableCell>
                <TableCell><Badge variant="outline">{o.paymentMethod}</Badge></TableCell>
                <TableCell><Badge className={statusColors[o.status]}>{o.status}</Badge></TableCell>
                <TableCell>
                  <Select defaultValue={o.status} onValueChange={(v: OrderStatus) => { updateOrder(o.id, { status: v }); toast.success(`Order ${o.id} updated to ${v}`); }}>
                    <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>{(["pending","processing","shipped","delivered","cancelled"] as OrderStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}