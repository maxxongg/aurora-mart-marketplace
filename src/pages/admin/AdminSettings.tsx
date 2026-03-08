import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const currencies = [
  { symbol: "$", code: "USD", name: "US Dollar" },
  { symbol: "€", code: "EUR", name: "Euro" },
  { symbol: "£", code: "GBP", name: "British Pound" },
  { symbol: "¥", code: "JPY", name: "Japanese Yen" },
  { symbol: "¥", code: "CNY", name: "Chinese Yuan" },
  { symbol: "₹", code: "INR", name: "Indian Rupee" },
  { symbol: "৳", code: "BDT", name: "Bangladeshi Taka" },
  { symbol: "A$", code: "AUD", name: "Australian Dollar" },
  { symbol: "C$", code: "CAD", name: "Canadian Dollar" },
  { symbol: "R$", code: "BRL", name: "Brazilian Real" },
  { symbol: "₩", code: "KRW", name: "South Korean Won" },
  { symbol: "₺", code: "TRY", name: "Turkish Lira" },
  { symbol: "R", code: "ZAR", name: "South African Rand" },
  { symbol: "د.إ", code: "AED", name: "UAE Dirham" },
  { symbol: "ر.س", code: "SAR", name: "Saudi Riyal" },
  { symbol: "₱", code: "PHP", name: "Philippine Peso" },
  { symbol: "RM", code: "MYR", name: "Malaysian Ringgit" },
  { symbol: "฿", code: "THB", name: "Thai Baht" },
];

export default function AdminSettings() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState({ ...settings });

  const handleSave = () => { updateSettings(form); toast.success("Settings saved successfully!"); };
  const set = (key: string, value: string | number) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Store Name</Label><Input value={form.storeName} onChange={(e) => set("storeName", e.target.value)} /></div>
            <div><Label>Logo URL (optional)</Label><Input value={form.storeLogo} onChange={(e) => set("storeLogo", e.target.value)} placeholder="https://..." /></div>
            <div><Label>Announcement Text</Label><Input value={form.announcementText} onChange={(e) => set("announcementText", e.target.value)} /></div>
            <div><Label>Announcement Link</Label><Input value={form.announcementLink} onChange={(e) => set("announcementLink", e.target.value)} /></div>
            <div>
              <Label>Currency</Label>
              <Select value={currencies.find(c => c.symbol === form.currency)?.code || "custom"} onValueChange={(code) => { const c = currencies.find(x => x.code === code); if (c) set("currency", c.symbol); }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="font-medium">{c.symbol}</span> <span className="text-muted-foreground">— {c.name} ({c.code})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2">
                <Label className="text-xs text-muted-foreground">Or enter custom symbol</Label>
                <Input value={form.currency} onChange={(e) => set("currency", e.target.value)} className="w-24 mt-1" placeholder="$" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Flash Sale</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Flash Sale End Date</Label><Input type="datetime-local" value={form.flashSaleEnd.slice(0, 16)} onChange={(e) => set("flashSaleEnd", e.target.value + ":00Z")} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Free Shipping Threshold ({form.currency})</Label><Input type="number" value={form.freeShippingThreshold} onChange={(e) => set("freeShippingThreshold", Number(e.target.value))} /></div>
            <div><Label>Shipping Cost ({form.currency})</Label><Input type="number" step="0.01" value={form.shippingCost} onChange={(e) => set("shippingCost", Number(e.target.value))} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Email</Label><Input value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} /></div>
            <div><Label>Address</Label><Input value={form.contactAddress} onChange={(e) => set("contactAddress", e.target.value)} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Facebook</Label><Input value={form.socialFacebook} onChange={(e) => set("socialFacebook", e.target.value)} /></div>
            <div><Label>Instagram</Label><Input value={form.socialInstagram} onChange={(e) => set("socialInstagram", e.target.value)} /></div>
            <div><Label>Twitter</Label><Input value={form.socialTwitter} onChange={(e) => set("socialTwitter", e.target.value)} /></div>
          </CardContent>
        </Card>
        <Button className="gradient-primary border-0 text-primary-foreground" onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
