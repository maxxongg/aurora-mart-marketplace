import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { Banner } from "@/types";

export default function AdminBanners() {
  const { banners, addBanner, updateBanner, deleteBanner } = useStore();
  const [editing, setEditing] = useState<Banner | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ image: "", link: "/products", altText: "", subtitle: "", ctaText: "Shop Now", sortOrder: 1, isActive: true });

  const openAdd = () => { setEditing(null); setForm({ image: "", link: "/products", altText: "", subtitle: "", ctaText: "Shop Now", sortOrder: banners.length + 1, isActive: true }); setIsOpen(true); };
  const openEdit = (b: Banner) => { setEditing(b); setForm({ image: b.image, link: b.link, altText: b.altText, subtitle: b.subtitle || "", ctaText: b.ctaText || "Shop Now", sortOrder: b.sortOrder, isActive: b.isActive }); setIsOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { updateBanner(editing.id, form); toast.success("Banner updated!"); }
    else { addBanner(form); toast.success("Banner added!"); }
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Banners ({banners.length})</h1>
        <Button className="gradient-primary border-0 text-primary-foreground" onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> Add Banner</Button>
      </div>
      <div className="grid gap-4">
        {banners.map((b) => (
          <div key={b.id} className="border rounded-lg overflow-hidden flex flex-col sm:flex-row">
            <img src={b.image} alt={b.altText} className="w-full sm:w-48 h-28 object-cover shrink-0" />
            <div className="p-4 flex-1 flex items-center justify-between">
              <div>
                <p className="font-medium">{b.altText}</p>
                <p className="text-sm text-muted-foreground">{b.link}</p>
                <Badge variant="secondary" className="mt-1">{b.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { deleteBanner(b.id); toast.success("Banner deleted"); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Banner" : "Add Banner"}</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div><Label>Title / Alt Text</Label><Input required value={form.altText} onChange={(e) => setForm({ ...form, altText: e.target.value })} /></div>
            <div><Label>Subtitle</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Optional description text" /></div>
            <div><Label>CTA Button Text</Label><Input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} placeholder="Shop Now" /></div>
            <div><Label>Image URL</Label><Input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
            <div><Label>Link</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></div>
            <label className="flex items-center gap-2"><Checkbox checked={form.isActive} onCheckedChange={(c) => setForm({ ...form, isActive: !!c })} /><span className="text-sm">Active</span></label>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">{editing ? "Save" : "Add"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
