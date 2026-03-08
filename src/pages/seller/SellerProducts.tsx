import { mockProducts } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SellerProducts() {
  const products = mockProducts.slice(0, 5);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">My Products</h1>
        <Button className="gradient-primary border-0 text-primary-foreground" onClick={() => toast.info("Add product (demo)")}><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Sold</TableHead><TableHead className="w-20">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell><div className="flex items-center gap-3"><img src={p.image} alt="" className="h-10 w-10 rounded object-cover" /><span className="font-medium text-sm">{p.name}</span></div></TableCell>
                <TableCell>${p.price.toFixed(2)}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.totalSold}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
