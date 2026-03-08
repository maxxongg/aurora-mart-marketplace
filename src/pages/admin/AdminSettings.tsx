import { mockSettings } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminSettings() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Store Name</Label><Input defaultValue={mockSettings.storeName} /></div>
            <div><Label>Announcement Text</Label><Input defaultValue={mockSettings.announcementText} /></div>
            <div><Label>Flash Sale End</Label><Input type="datetime-local" defaultValue={mockSettings.flashSaleEnd.slice(0, 16)} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Email</Label><Input defaultValue={mockSettings.contactEmail} /></div>
            <div><Label>Phone</Label><Input defaultValue={mockSettings.contactPhone} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Facebook</Label><Input defaultValue={mockSettings.socialFacebook} /></div>
            <div><Label>Instagram</Label><Input defaultValue={mockSettings.socialInstagram} /></div>
            <div><Label>Twitter</Label><Input defaultValue={mockSettings.socialTwitter} /></div>
          </CardContent>
        </Card>
        <Button className="gradient-primary border-0 text-primary-foreground" onClick={() => toast.success("Settings saved (demo)")}>Save Settings</Button>
      </div>
    </div>
  );
}
