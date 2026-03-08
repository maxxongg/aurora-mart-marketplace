import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState, useEffect } from "react";
import { mockSettings, mockCategories } from "@/data/mock";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [search, setSearch] = useState("");

  const getDashboardLink = () => {
    if (!user) return "/auth";
    if (user.role === "admin") return "/admin";
    if (user.role === "seller") return "/seller";
    return "/profile";
  };

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      {/* Announcement Bar */}
      <div className="gradient-primary text-primary-foreground text-center py-1.5 text-sm font-medium">
        {mockSettings.announcementText}
      </div>

      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-display font-bold text-gradient">Aurora Mart</Link>
                <Link to="/products" className="py-2 hover:text-primary transition-colors">All Products</Link>
                <Link to="/new-arrivals" className="py-2 hover:text-primary transition-colors">New Arrivals</Link>
                <Link to="/best-sellers" className="py-2 hover:text-primary transition-colors">Best Sellers</Link>
                {mockCategories.map((cat) => (
                  <Link key={cat.id} to={`/products?category=${cat.id}`} className="py-2 hover:text-primary transition-colors pl-2 text-sm text-muted-foreground">{cat.name}</Link>
                ))}
                <div className="border-t pt-4 mt-2">
                  <Link to="/faq" className="py-2 block hover:text-primary">FAQ</Link>
                  <Link to="/contact" className="py-2 block hover:text-primary">Contact</Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="font-display font-bold text-xl md:text-2xl shrink-0">
            <span className="text-gradient">Aurora</span> Mart
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-0" />
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors">
                Categories <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {mockCategories.map((cat) => (
                  <DropdownMenuItem key={cat.id} asChild>
                    <Link to={`/products?category=${cat.id}`}>{cat.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/new-arrivals" className="hover:text-primary transition-colors">New</Link>
            <Link to="/best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] gradient-primary border-0">{wishlistItems.length}</Badge>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] gradient-primary border-0">{itemCount}</Badge>
                )}
              </Link>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">{user?.name}</div>
                  <div className="px-2 pb-1.5 text-xs text-muted-foreground">{user?.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to={getDashboardLink()}>Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/orders">My Orders</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="gradient-primary border-0 text-primary-foreground ml-1">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-0" />
          </div>
        </div>
      </div>
    </header>
  );
}
