import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { Product } from "@/types";

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const emptyForm = { name: "", description: "", categoryId: "", price: 0, originalPrice: 0, stock: 0, image: "", images: [] as string[], isFeatured: false, isFlashSale: false, status: "active" as const };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditingProduct(null); setForm(emptyForm); setIsOpen(true); };
  const openEdit = (p: Product) => { setEditingProduct(p); setForm({ name: p.name, description: p.description, categoryId: p.categoryId, price: p.price, originalPrice: p.originalPrice || 0, stock: p.stock, image: p.image, images: p.images || [], isFeatured: p.isFeatured, isFlashSale: p.isFlashSale, status: p.status }); setIsOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, { ...form, originalPrice: form.originalPrice || undefined });
      toast.success("Product updated!");
    } else {
      addProduct({ ...form, originalPrice: form.originalPrice || undefined });
      toast.success("Product added!");
    }
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Products ({products.length})</h1>
        <Button className="gradient-primary border-0 text-primary-foreground" onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
      </div>
      <div className="relative mb-4 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-10" /></div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead><TableHead>Flash</TableHead><TableHead className="w-20">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell><div className="flex items-center gap-3"><img src={p.image} alt="" className="h-10 w-10 rounded object-cover" /><span className="font-medium text-sm">{p.name}</span></div></TableCell>
                <TableCell className="text-sm">{categories.find((c) => c.id === p.categoryId)?.name}</TableCell>
                <TableCell className="font-medium">${p.price.toFixed(2)}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell><Badge variant="secondary">{p.status}</Badge></TableCell>
                <TableCell>{p.isFlashSale && <Badge className="bg-destructive border-0 text-destructive-foreground text-xs">Flash</Badge>}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteProduct(p.id); toast.success("Product deleted"); }}><Trash2 className="h-3 w-3" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Price</Label><Input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
              <div><Label>Original Price</Label><Input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label><Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Stock</Label><Input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
            <div><Label>Status</Label><Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2"><Checkbox checked={form.isFeatured} onCheckedChange={(c) => setForm({ ...form, isFeatured: !!c })} /><span className="text-sm">Featured</span></label>
              <label className="flex items-center gap-2"><Checkbox checked={form.isFlashSale} onCheckedChange={(c) => setForm({ ...form, isFlashSale: !!c })} /><span className="text-sm">Flash Sale</span></label>
            </div>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">{editingProduct ? "Save Changes" : "Add Product"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
