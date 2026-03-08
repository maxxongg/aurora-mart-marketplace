import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { StoreProvider } from "@/context/StoreContext";
import { MediaProvider } from "@/context/MediaContext";

import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import SellerLayout from "@/components/layout/SellerLayout";

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Wishlist from "./pages/Wishlist";
import OrderHistory from "./pages/OrderHistory";
import NewArrivals from "./pages/NewArrivals";
import BestSellers from "./pages/BestSellers";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import FAQ from "./pages/support/FAQ";
import Shipping from "./pages/support/Shipping";
import Returns from "./pages/support/Returns";
import Contact from "./pages/support/Contact";
import TermsOfService from "./pages/support/TermsOfService";
import PrivacyPolicy from "./pages/support/PrivacyPolicy";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminOffers from "./pages/admin/AdminOffers";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminNavigation from "./pages/admin/AdminNavigation";

import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerSettings from "./pages/seller/SellerSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
  <StoreProvider>
    <MediaProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/new-arrivals" element={<NewArrivals />} />
                    <Route path="/best-sellers" element={<BestSellers />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                  </Route>

                  <Route path="/auth" element={<Auth />} />

                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/categories" element={<AdminCategories />} />
                    <Route path="/admin/banners" element={<AdminBanners />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/customers" element={<AdminCustomers />} />
                    <Route path="/admin/coupons" element={<AdminCoupons />} />
                    <Route path="/admin/offers" element={<AdminOffers />} />
                    <Route path="/admin/media" element={<AdminMedia />} />
                    <Route path="/admin/navigation" element={<AdminNavigation />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>

                  <Route element={<SellerLayout />}>
                    <Route path="/seller" element={<SellerDashboard />} />
                    <Route path="/seller/products" element={<SellerProducts />} />
                    <Route path="/seller/orders" element={<SellerOrders />} />
                    <Route path="/seller/settings" element={<SellerSettings />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </MediaProvider>
  </StoreProvider>
  </QueryClientProvider>
);

export default App;
