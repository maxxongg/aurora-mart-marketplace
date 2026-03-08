import { Link, useLocation } from "react-router-dom";
import AnimatedOutlet from "@/components/AnimatedOutlet";
import { LayoutDashboard, Package, FolderTree, Image, ShoppingBag, Users, Settings, LogOut, ChevronLeft, Ticket, Megaphone, ImageIcon, Navigation } from "lucide-react";
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
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: FolderTree, label: "Categories" },
  { to: "/admin/banners", icon: Image, label: "Banners" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/coupons", icon: Ticket, label: "Coupons" },
  { to: "/admin/offers", icon: Megaphone, label: "Offers" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

function AdminSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <div className="p-4">
        <Link to="/" className="font-display font-bold text-lg">
          <span className="text-primary">Aurora</span>{!collapsed && " Admin"}
        </Link>
      </div>
      <SidebarContent>
        <SidebarGroup>
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

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <header className="h-12 flex items-center border-b border-border bg-background sticky top-0 z-10 md:hidden">
            <SidebarTrigger className="ml-2" />
            <span className="ml-2 font-display font-bold text-sm"><span className="text-primary">Aurora</span> Admin</span>
          </header>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
            <AnimatedOutlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
