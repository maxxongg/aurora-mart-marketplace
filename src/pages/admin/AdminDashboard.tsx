import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

export default function AdminDashboard() {
  const { orders, products, settings } = useStore();
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const uniqueCustomers = useMemo(() => new Set(orders.map((o) => o.userId)).size, [orders]);

  const revenueData = useMemo(() => {
    const monthMap: Record<string, number> = {};
    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = d.toLocaleString("en", { month: "short", year: "2-digit" });
      monthMap[key] = (monthMap[key] || 0) + o.total;
    });
    return Object.entries(monthMap).map(([month, revenue]) => ({ month, revenue: Math.round(revenue * 100) / 100 }));
  }, [orders]);

  const stats = [
    { icon: DollarSign, label: "Total Revenue", value: `${settings.currency}${totalRevenue.toFixed(2)}`, color: "text-success" },
    { icon: ShoppingBag, label: "Total Orders", value: orders.length, color: "text-primary" },
    { icon: Users, label: "Customers", value: uniqueCustomers, color: "text-blue-500" },
    { icon: Package, label: "Products", value: products.length, color: "text-warning" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-lg bg-secondary flex items-center justify-center ${color}`}><Icon className="h-6 w-6" /></div>
              <div><p className="text-sm text-muted-foreground">{label}</p><p className="font-display text-xl font-bold">{value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Revenue Overview</CardTitle></CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(val: number) => `${settings.currency}${val.toFixed(2)}`} />
                  <Bar dataKey="revenue" fill="hsl(25, 95%, 53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-12">No order data yet</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div><p className="font-medium text-sm">{order.id}</p><p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                  <div className="text-right"><p className="font-medium text-sm">{settings.currency}{order.total.toFixed(2)}</p><Badge variant="secondary" className="text-xs">{order.status}</Badge></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
