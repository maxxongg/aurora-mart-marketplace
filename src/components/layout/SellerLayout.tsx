import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/seller", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/seller/products", icon: Package, label: "My Products" },
  { to: "/seller/orders", icon: ShoppingBag, label: "My Orders" },
  { to: "/seller/settings", icon: Settings, label: "Settings" },
];

export default function SellerLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-secondary">
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6">
          <Link to="/" className="font-display font-bold text-lg text-sidebar-primary-foreground">
            <span className="text-primary">Aurora</span> Seller
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              location.pathname === to ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}>
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-sm mb-3 px-2">
            <p className="font-medium text-sidebar-foreground">{user?.name}</p>
            <p className="text-sidebar-foreground/50 text-xs">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild className="text-sidebar-foreground/70 flex-1 justify-start">
              <Link to="/"><ChevronLeft className="h-3 w-3 mr-1" />Store</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="text-sidebar-foreground/70">
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
