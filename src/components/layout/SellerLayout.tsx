import { Link } from "react-router-dom";
import AnimatedOutlet from "@/components/AnimatedOutlet";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const links = [
  { to: "/seller", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/seller/products", icon: Package, label: "My Products" },
  { to: "/seller/orders", icon: ShoppingBag, label: "My Orders" },
  { to: "/seller/settings", icon: Settings, label: "Settings" },
];

function SellerSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <div className="p-4">
        <Link to="/" className="font-display font-bold text-lg">
          <span className="text-primary">Aurora</span>{!collapsed && " Seller"}
        </Link>
      </div>
      <SidebarContent>
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map(({ to, icon: Icon, label }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild tooltip={label}>
                    <NavLink to={to} end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <Icon className="h-4 w-4" />
                      {!collapsed && <span>{label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="p-4 border-t border-sidebar-border mt-auto">
        {!collapsed && (
          <div className="text-sm mb-3 px-2">
            <p className="font-medium text-sidebar-foreground">{user?.name}</p>
            <p className="text-sidebar-foreground/50 text-xs">{user?.email}</p>
          </div>
        )}
        <div className="flex gap-2">
          {!collapsed && (
            <Button variant="ghost" size="sm" asChild className="text-sidebar-foreground/70 flex-1 justify-start">
              <Link to="/"><ChevronLeft className="h-3 w-3 mr-1" />Store</Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={logout} className="text-sidebar-foreground/70">
            <LogOut className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Sidebar>
  );
}

export default function SellerLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary">
        <SellerSidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <header className="h-12 flex items-center border-b border-border bg-background sticky top-0 z-10 md:hidden">
            <SidebarTrigger className="ml-2" />
            <span className="ml-2 font-display font-bold text-sm"><span className="text-primary">Aurora</span> Seller</span>
          </header>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
            <AnimatedOutlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
