import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="font-display text-3xl font-bold mb-8">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-4">
          <div><Label>Name</Label><Input required placeholder="Your name" /></div>
          <div><Label>Email</Label><Input type="email" required placeholder="you@example.com" /></div>
          <div><Label>Subject</Label><Input required placeholder="How can we help?" /></div>
          <div><Label>Message</Label><Textarea required placeholder="Your message..." rows={5} /></div>
          <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Send Message</Button>
        </form>
        <div className="space-y-6">
          <h2 className="font-display text-xl font-bold">Get in Touch</h2>
          <p className="text-muted-foreground">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center"><Mail className="h-5 w-5 text-accent-foreground" /></div><div><p className="font-medium text-sm">Email</p><p className="text-sm text-muted-foreground">support@auroramart.com</p></div></div>
            <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center"><Phone className="h-5 w-5 text-accent-foreground" /></div><div><p className="font-medium text-sm">Phone</p><p className="text-sm text-muted-foreground">+880 1234-567890</p></div></div>
            <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center"><MapPin className="h-5 w-5 text-accent-foreground" /></div><div><p className="font-medium text-sm">Address</p><p className="text-sm text-muted-foreground">Dhaka, Bangladesh</p></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
