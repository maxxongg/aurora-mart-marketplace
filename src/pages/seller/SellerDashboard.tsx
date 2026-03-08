import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingBag, DollarSign } from "lucide-react";

export default function SellerDashboard() {
  const stats = [
    { icon: Package, label: "My Products", value: 8 },
    { icon: ShoppingBag, label: "My Orders", value: 24 },
    { icon: DollarSign, label: "Revenue", value: "$1,240.00" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <Card key={label}><CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center"><Icon className="h-6 w-6 text-accent-foreground" /></div>
            <div><p className="text-sm text-muted-foreground">{label}</p><p className="font-display text-xl font-bold">{value}</p></div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
