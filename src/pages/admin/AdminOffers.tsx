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
import type { OfferBanner } from "@/types";

export default function AdminOffers() {
  const { offerBanners, addOfferBanner, updateOfferBanner, deleteOfferBanner } = useStore();
  const [editing, setEditing] = useState<OfferBanner | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const emptyForm = { title: "", subtitle: "", image: "", link: "/products", isActive: true };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setIsOpen(true); };
  const openEdit = (o: OfferBanner) => { setEditing(o); setForm({ title: o.title, subtitle: o.subtitle, image: o.image, link: o.link, isActive: o.isActive }); setIsOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { updateOfferBanner(editing.id, form); toast.success("Offer updated!"); }
    else { addOfferBanner(form); toast.success("Offer created!"); }
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Offer Banners ({offerBanners.length})</h1>
        <Button className="gradient-primary border-0 text-primary-foreground" onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> Add Offer</Button>
      </div>
      <div className="grid gap-4">
        {offerBanners.map((o) => (
          <div key={o.id} className="border rounded-lg overflow-hidden flex flex-col sm:flex-row">
            <img src={o.image} alt={o.title} className="w-full sm:w-48 h-28 object-cover shrink-0" />
            <div className="p-4 flex-1 flex items-center justify-between">
              <div>
                <p className="font-medium">{o.title}</p>
                <p className="text-sm text-muted-foreground">{o.subtitle}</p>
                <Badge variant="secondary" className="mt-1">{o.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(o)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { deleteOfferBanner(o.id); toast.success("Offer deleted"); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Offer" : "Add Offer"}</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div><Label>Title</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Subtitle</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
            <div><Label>Image URL</Label><Input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
            <div><Label>Link</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></div>
            <label className="flex items-center gap-2"><Checkbox checked={form.isActive} onCheckedChange={(c) => setForm({ ...form, isActive: !!c })} /><span className="text-sm">Active</span></label>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">{editing ? "Save" : "Create"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
