import { useState } from "react";
import { mockProducts, mockCategories } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const products = mockProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <Dialog>
          <DialogTrigger asChild><Button className="gradient-primary border-0 text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Add Product</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Product added (demo)"); }}>
              <div><Label>Name</Label><Input required placeholder="Product name" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price</Label><Input type="number" step="0.01" required placeholder="0.00" /></div>
                <div><Label>Original Price</Label><Input type="number" step="0.01" placeholder="0.00" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{mockCategories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Stock</Label><Input type="number" required placeholder="0" /></div>
              </div>
              <div><Label>Image URL</Label><Input placeholder="https://..." /></div>
              <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Add Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-10" />
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead><TableHead className="w-20">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell><div className="flex items-center gap-3"><img src={p.image} alt="" className="h-10 w-10 rounded object-cover" /><span className="font-medium text-sm">{p.name}</span></div></TableCell>
                <TableCell className="text-sm">{mockCategories.find((c) => c.id === p.categoryId)?.name}</TableCell>
                <TableCell className="font-medium">${p.price.toFixed(2)}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell><Badge variant="secondary">{p.status}</Badge></TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
