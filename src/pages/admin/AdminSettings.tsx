import { useState, useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { TrustBadge, FAQItem, ContentSection } from "@/types";
import { validateImageFile, fileToBase64, formatFileSize, IMAGE_PRESETS } from "@/lib/image-validation";

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

const iconOptions = ["Truck", "Shield", "RefreshCw", "Headphones", "Heart", "Star", "Clock", "Award", "Zap"];

export default function AdminSettings() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState({ ...settings });

  const handleSave = () => { updateSettings(form); toast.success("Settings saved successfully!"); };
  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  // Trust badges helpers
  const updateBadge = (i: number, field: keyof TrustBadge, val: string) => {
    const badges = [...form.trustBadges];
    badges[i] = { ...badges[i], [field]: val };
    set("trustBadges", badges);
  };
  const addBadge = () => set("trustBadges", [...form.trustBadges, { icon: "Shield", title: "", desc: "" }]);
  const removeBadge = (i: number) => set("trustBadges", form.trustBadges.filter((_, idx) => idx !== i));

  // FAQ helpers
  const updateFAQ = (i: number, field: keyof FAQItem, val: string) => {
    const items = [...form.faqItems];
    items[i] = { ...items[i], [field]: val };
    set("faqItems", items);
  };
  const addFAQ = () => set("faqItems", [...form.faqItems, { q: "", a: "" }]);
  const removeFAQ = (i: number) => set("faqItems", form.faqItems.filter((_, idx) => idx !== i));

  // Content section helpers
  const updateSection = (key: "shippingSections" | "returnsSections", i: number, field: keyof ContentSection, val: string) => {
    const sections = [...form[key]];
    sections[i] = { ...sections[i], [field]: val };
    set(key, sections);
  };
  const addSection = (key: "shippingSections" | "returnsSections") => set(key, [...form[key], { title: "", body: "" }]);
  const removeSection = (key: "shippingSections" | "returnsSections", i: number) => set(key, form[key].filter((_, idx) => idx !== i));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        {/* General */}
        <Card>
          <CardHeader><CardTitle>General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Store Name</Label><Input value={form.storeName} onChange={(e) => set("storeName", e.target.value)} /></div>
            <div><Label>Logo URL (optional)</Label><Input value={form.storeLogo} onChange={(e) => set("storeLogo", e.target.value)} placeholder="https://..." /></div>
            <div><Label>Announcement Text</Label><Input value={form.announcementText} onChange={(e) => set("announcementText", e.target.value)} /></div>
            <div><Label>Announcement Link</Label><Input value={form.announcementLink} onChange={(e) => set("announcementLink", e.target.value)} /></div>
            <div><Label>Footer Description</Label><Textarea value={form.footerDescription} onChange={(e) => set("footerDescription", e.target.value)} rows={2} /></div>
            <div>
              <Label>Currency</Label>
              <Select value={currencies.find(c => c.symbol === form.currency)?.code || "custom"} onValueChange={(code) => { const c = currencies.find(x => x.code === code); if (c) set("currency", c.symbol); }}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select currency" /></SelectTrigger>
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

        {/* Trust Badges */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Trust Badges (Homepage)</CardTitle>
            <Button size="sm" variant="outline" onClick={addBadge}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.trustBadges.map((badge, i) => (
              <div key={i} className="flex gap-3 items-start border rounded-lg p-3">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <div className="w-32">
                      <Label className="text-xs">Icon</Label>
                      <Select value={badge.icon} onValueChange={(v) => updateBadge(i, "icon", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{iconOptions.map(ic => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1"><Label className="text-xs">Title</Label><Input value={badge.title} onChange={(e) => updateBadge(i, "title", e.target.value)} /></div>
                  </div>
                  <div><Label className="text-xs">Description</Label><Input value={badge.desc} onChange={(e) => updateBadge(i, "desc", e.target.value)} /></div>
                </div>
                <Button size="icon" variant="ghost" className="text-destructive shrink-0 mt-5" onClick={() => removeBadge(i)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Flash Sale */}
        <Card>
          <CardHeader><CardTitle>Flash Sale</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Flash Sale End Date</Label><Input type="datetime-local" value={form.flashSaleEnd.slice(0, 16)} onChange={(e) => set("flashSaleEnd", e.target.value + ":00Z")} /></div>
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card>
          <CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Free Shipping Threshold ({form.currency})</Label><Input type="number" value={form.freeShippingThreshold} onChange={(e) => set("freeShippingThreshold", Number(e.target.value))} /></div>
            <div><Label>Shipping Cost ({form.currency})</Label><Input type="number" step="0.01" value={form.shippingCost} onChange={(e) => set("shippingCost", Number(e.target.value))} /></div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Email</Label><Input value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} /></div>
            <div><Label>Address</Label><Input value={form.contactAddress} onChange={(e) => set("contactAddress", e.target.value)} /></div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Facebook</Label><Input value={form.socialFacebook} onChange={(e) => set("socialFacebook", e.target.value)} /></div>
            <div><Label>Instagram</Label><Input value={form.socialInstagram} onChange={(e) => set("socialInstagram", e.target.value)} /></div>
            <div><Label>Twitter</Label><Input value={form.socialTwitter} onChange={(e) => set("socialTwitter", e.target.value)} /></div>
          </CardContent>
        </Card>

        {/* FAQ Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>FAQ Page Content</CardTitle>
            <Button size="sm" variant="outline" onClick={addFAQ}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.faqItems.map((faq, i) => (
              <div key={i} className="flex gap-3 items-start border rounded-lg p-3">
                <div className="flex-1 space-y-2">
                  <div><Label className="text-xs">Question</Label><Input value={faq.q} onChange={(e) => updateFAQ(i, "q", e.target.value)} /></div>
                  <div><Label className="text-xs">Answer</Label><Textarea value={faq.a} onChange={(e) => updateFAQ(i, "a", e.target.value)} rows={2} /></div>
                </div>
                <Button size="icon" variant="ghost" className="text-destructive shrink-0 mt-5" onClick={() => removeFAQ(i)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Shipping Page Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Shipping Policy Page</CardTitle>
            <Button size="sm" variant="outline" onClick={() => addSection("shippingSections")}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.shippingSections.map((s, i) => (
              <div key={i} className="flex gap-3 items-start border rounded-lg p-3">
                <div className="flex-1 space-y-2">
                  <div><Label className="text-xs">Section Title</Label><Input value={s.title} onChange={(e) => updateSection("shippingSections", i, "title", e.target.value)} /></div>
                  <div><Label className="text-xs">Content</Label><Textarea value={s.body} onChange={(e) => updateSection("shippingSections", i, "body", e.target.value)} rows={2} /></div>
                </div>
                <Button size="icon" variant="ghost" className="text-destructive shrink-0 mt-5" onClick={() => removeSection("shippingSections", i)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Returns Page Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Returns & Refund Page</CardTitle>
            <Button size="sm" variant="outline" onClick={() => addSection("returnsSections")}><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.returnsSections.map((s, i) => (
              <div key={i} className="flex gap-3 items-start border rounded-lg p-3">
                <div className="flex-1 space-y-2">
                  <div><Label className="text-xs">Section Title</Label><Input value={s.title} onChange={(e) => updateSection("returnsSections", i, "title", e.target.value)} /></div>
                  <div><Label className="text-xs">Content</Label><Textarea value={s.body} onChange={(e) => updateSection("returnsSections", i, "body", e.target.value)} rows={2} /></div>
                </div>
                <Button size="icon" variant="ghost" className="text-destructive shrink-0 mt-5" onClick={() => removeSection("returnsSections", i)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button className="gradient-primary border-0 text-primary-foreground" onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
