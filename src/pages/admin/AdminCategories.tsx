import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Category } from "@/types";

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [editing, setEditing] = useState<Category | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", image: "", sortOrder: 1 });

  const openAdd = () => { setEditing(null); setForm({ name: "", image: "", sortOrder: categories.length + 1 }); setIsOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, image: c.image, sortOrder: c.sortOrder }); setIsOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { updateCategory(editing.id, form); toast.success("Category updated!"); }
    else { addCategory(form); toast.success("Category added!"); }
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Categories ({categories.length})</h1>
        <Button className="gradient-primary border-0 text-primary-foreground" onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> Add Category</Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Order</TableHead><TableHead className="w-20">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {[...categories].sort((a, b) => a.sortOrder - b.sortOrder).map((c) => (
              <TableRow key={c.id}>
                <TableCell><img src={c.image} alt={c.name} className="h-10 w-10 rounded-full object-cover" /></TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.sortOrder}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteCategory(c.id); toast.success("Category deleted"); }}><Trash2 className="h-3 w-3" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Image URL</Label><Input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></div>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">{editing ? "Save" : "Add"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
