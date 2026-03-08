import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { Coupon } from "@/types";

export default function AdminCoupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, settings } = useStore();
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const emptyForm = { code: "", discountType: "percentage" as Coupon["discountType"], discountValue: 10, minOrderAmount: 0, maxUses: 100, isActive: true, expiresAt: "2026-12-31T23:59:59Z" };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setIsOpen(true); };
  const openEdit = (c: Coupon) => { setEditing(c); setForm({ code: c.code, discountType: c.discountType, discountValue: c.discountValue, minOrderAmount: c.minOrderAmount, maxUses: c.maxUses, isActive: c.isActive, expiresAt: c.expiresAt }); setIsOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { updateCoupon(editing.id, form); toast.success("Coupon updated!"); }
    else { addCoupon(form); toast.success("Coupon created!"); }
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Coupons ({coupons.length})</h1>
        <Button className="gradient-primary border-0 text-primary-foreground" onClick={openAdd}><Plus className="h-4 w-4 mr-2" /> Add Coupon</Button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Discount</TableHead><TableHead>Min Order</TableHead><TableHead>Used/Max</TableHead><TableHead>Expires</TableHead><TableHead>Status</TableHead><TableHead className="w-20">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {coupons.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono font-bold">{c.code}</TableCell>
                <TableCell>{c.discountType === "percentage" ? `${c.discountValue}%` : `${settings.currency}${c.discountValue}`}</TableCell>
                <TableCell>{settings.currency}{c.minOrderAmount}</TableCell>
                <TableCell>{c.usedCount}/{c.maxUses}</TableCell>
                <TableCell className="text-sm">{new Date(c.expiresAt).toLocaleDateString()}</TableCell>
                <TableCell><Badge variant={c.isActive ? "default" : "secondary"}>{c.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteCoupon(c.id); toast.success("Coupon deleted"); }}><Trash2 className="h-3 w-3" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Coupon" : "Add Coupon"}</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div><Label>Coupon Code</Label><Input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="font-mono" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Discount Type</Label><Select value={form.discountType} onValueChange={(v: any) => setForm({ ...form, discountType: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage (%)</SelectItem><SelectItem value="fixed">Fixed Amount</SelectItem></SelectContent></Select></div>
              <div><Label>Value</Label><Input type="number" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Min Order Amount</Label><Input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })} /></div>
              <div><Label>Max Uses</Label><Input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Expires At</Label><Input type="datetime-local" value={form.expiresAt.slice(0, 16)} onChange={(e) => setForm({ ...form, expiresAt: e.target.value + ":00Z" })} /></div>
            <label className="flex items-center gap-2"><Checkbox checked={form.isActive} onCheckedChange={(c) => setForm({ ...form, isActive: !!c })} /><span className="text-sm">Active</span></label>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">{editing ? "Save" : "Create"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
