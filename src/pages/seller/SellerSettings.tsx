import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SellerSettings() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Seller Settings</h1>
      <Card>
        <CardHeader><CardTitle>Store Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Store Name</Label><Input defaultValue="Jane's Store" /></div>
          <div><Label>Description</Label><Textarea defaultValue="Quality products at the best prices." rows={3} /></div>
          <div><Label>Contact Email</Label><Input defaultValue="jane@example.com" /></div>
          <Button className="gradient-primary border-0 text-primary-foreground" onClick={() => toast.success("Settings saved (demo)")}>Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}
