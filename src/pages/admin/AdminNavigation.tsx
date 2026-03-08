import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown, Link as LinkIcon, FolderTree } from "lucide-react";
import { toast } from "sonner";

export interface NavMenuItem {
  id: string;
  label: string;
  href: string;
  type: "link" | "category";
  categoryId?: string;
  visible: boolean;
  sortOrder: number;
}

function loadNavItems(categories: { id: string; name: string }[]): NavMenuItem[] {
  try {
    const raw = localStorage.getItem("nav_menu_items");
    if (raw) return JSON.parse(raw);
  } catch {}
  // Default nav items
  return [
    { id: "nav-1", label: "Shop", href: "/products", type: "link", visible: true, sortOrder: 1 },
    { id: "nav-2", label: "New", href: "/new-arrivals", type: "link", visible: true, sortOrder: 2 },
    { id: "nav-3", label: "Best Sellers", href: "/best-sellers", type: "link", visible: true, sortOrder: 3 },
    ...categories.map((c, i) => ({
      id: `nav-cat-${c.id}`,
      label: c.name,
      href: `/products?category=${c.id}`,
      type: "category" as const,
      categoryId: c.id,
      visible: true,
      sortOrder: 4 + i,
    })),
  ];
}

function saveNavItems(items: NavMenuItem[]) {
  localStorage.setItem("nav_menu_items", JSON.stringify(items));
}

function genId() { return "nav-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

export default function AdminNavigation() {
  const { categories } = useStore();
  const [items, setItems] = useState<NavMenuItem[]>(() => loadNavItems(categories));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ label: "", href: "/" });

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  const save = (next: NavMenuItem[]) => { setItems(next); saveNavItems(next); };

  const toggleVisibility = (id: string) => {
    save(items.map((x) => x.id === id ? { ...x, visible: !x.visible } : x));
  };

  const moveUp = (id: string) => {
    const idx = sorted.findIndex((x) => x.id === id);
    if (idx <= 0) return;
    const updated = [...sorted];
    [updated[idx - 1].sortOrder, updated[idx].sortOrder] = [updated[idx].sortOrder, updated[idx - 1].sortOrder];
    save(updated);
  };

  const moveDown = (id: string) => {
    const idx = sorted.findIndex((x) => x.id === id);
    if (idx >= sorted.length - 1) return;
    const updated = [...sorted];
    [updated[idx + 1].sortOrder, updated[idx].sortOrder] = [updated[idx].sortOrder, updated[idx + 1].sortOrder];
    save(updated);
  };

  const deleteItem = (id: string) => {
    save(items.filter((x) => x.id !== id));
    toast.success("Menu item removed");
  };

  const addCustomLink = () => {
    if (!form.label.trim()) { toast.error("Label is required"); return; }
    const maxOrder = items.reduce((max, x) => Math.max(max, x.sortOrder), 0);
    save([...items, { id: genId(), label: form.label, href: form.href, type: "link", visible: true, sortOrder: maxOrder + 1 }]);
    setForm({ label: "", href: "/" });
    setDialogOpen(false);
    toast.success("Link added!");
  };

  const addCategoryToNav = (catId: string) => {
    if (items.some((x) => x.categoryId === catId)) { toast.info("Already in navigation"); return; }
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;
    const maxOrder = items.reduce((max, x) => Math.max(max, x.sortOrder), 0);
    save([...items, { id: genId(), label: cat.name, href: `/products?category=${catId}`, type: "category", categoryId: catId, visible: true, sortOrder: maxOrder + 1 }]);
    toast.success(`${cat.name} added to navigation!`);
  };

  const updateLabel = (id: string, label: string) => {
    save(items.map((x) => x.id === id ? { ...x, label } : x));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Navigation Menu</h1>
        <Button className="gradient-primary border-0 text-primary-foreground" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Link
        </Button>
      </div>

      {/* Current Menu Items */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Menu Items (Drag to Reorder)</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {sorted.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                item.visible ? "bg-card" : "bg-muted/50 opacity-60"
              }`}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-2 shrink-0">
                {item.type === "category" ? (
                  <FolderTree className="h-4 w-4 text-primary" />
                ) : (
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  value={item.label}
                  onChange={(e) => updateLabel(item.id, e.target.value)}
                  className="h-8 text-sm font-medium"
                />
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.href}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Switch
                  checked={item.visible}
                  onCheckedChange={() => toggleVisibility(item.id)}
                />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveUp(item.id)} disabled={idx === 0}>
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveDown(item.id)} disabled={idx === sorted.length - 1}>
                  <ArrowDown className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteItem(item.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && (
            <p className="text-center text-muted-foreground py-6 text-sm">No menu items. Add links or categories below.</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Add Categories */}
      <Card>
        <CardHeader><CardTitle className="text-base">Add Categories to Navigation</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const inNav = items.some((x) => x.categoryId === cat.id);
              return (
                <Button
                  key={cat.id}
                  variant={inNav ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => !inNav && addCategoryToNav(cat.id)}
                  disabled={inNav}
                  className="text-xs"
                >
                  {inNav ? "✓ " : "+ "}{cat.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Custom Link Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Custom Link</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Label</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Sale" /></div>
            <div><Label>URL</Label><Input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/products or https://..." /></div>
            <Button className="w-full gradient-primary border-0 text-primary-foreground" onClick={addCustomLink}>Add Link</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
