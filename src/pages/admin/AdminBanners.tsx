import { mockBanners } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminBanners() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Banners</h1>
        <Button className="gradient-primary border-0 text-primary-foreground" onClick={() => toast.info("Add banner (demo)")}><Plus className="h-4 w-4 mr-2" /> Add Banner</Button>
      </div>
      <div className="grid gap-4">
        {mockBanners.map((b) => (
          <div key={b.id} className="border rounded-lg overflow-hidden flex">
            <img src={b.image} alt={b.altText} className="w-48 h-28 object-cover shrink-0" />
            <div className="p-4 flex-1 flex items-center justify-between">
              <div>
                <p className="font-medium">{b.altText}</p>
                <p className="text-sm text-muted-foreground">{b.link}</p>
                <Badge variant="secondary" className="mt-1">{b.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
