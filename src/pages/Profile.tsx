import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Navigate } from "react-router-dom";
import { Package, Heart, User } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" />;

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 max-w-3xl">
      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Profile</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { icon: Package, label: "My Orders", to: "/orders" },
          { icon: Heart, label: "Wishlist", to: "/wishlist" },
          { icon: User, label: "Account", to: "#" },
        ].map(({ icon: Icon, label, to }) => (
          <Link key={label} to={to} className="bg-card border rounded-lg p-3 sm:p-4 flex items-center gap-3 hover:border-primary transition-colors">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-accent flex items-center justify-center"><Icon className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" /></div>
            <span className="font-medium text-sm sm:text-base">{label}</span>
          </Link>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base sm:text-lg">Account Details</CardTitle></CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div><Label>Name</Label><Input defaultValue={user?.name} /></div>
          <div><Label>Email</Label><Input defaultValue={user?.email} type="email" /></div>
          <div><Label>Phone</Label><Input defaultValue={user?.phone} /></div>
          <Button className="gradient-primary border-0 text-primary-foreground">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
