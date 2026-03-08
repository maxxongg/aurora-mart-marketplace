import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Product, Category, Banner, Settings, Order, Coupon, OfferBanner } from "@/types";
import {
  defaultProducts, defaultCategories, defaultBanners,
  defaultSettings, defaultOrders, defaultCoupons, defaultOfferBanners,
} from "@/data/defaults";

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function saveState<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

interface StoreContextType {
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
  categories: Category[];
  addCategory: (c: Omit<Category, "id">) => void;
  updateCategory: (id: string, c: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  products: Product[];
  addProduct: (p: Omit<Product, "id" | "totalSold" | "rating" | "reviewCount" | "createdAt">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  banners: Banner[];
  addBanner: (b: Omit<Banner, "id">) => void;
  updateBanner: (id: string, b: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrder: (id: string, o: Partial<Order>) => void;
  coupons: Coupon[];
  addCoupon: (c: Omit<Coupon, "id" | "usedCount">) => void;
  updateCoupon: (id: string, c: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  applyCoupon: (code: string, orderTotal: number) => { valid: boolean; discount: number; message: string };
  offerBanners: OfferBanner[];
  addOfferBanner: (o: Omit<OfferBanner, "id">) => void;
  updateOfferBanner: (id: string, o: Partial<OfferBanner>) => void;
  deleteOfferBanner: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => loadState("store_settings", defaultSettings));
  const [categories, setCategories] = useState<Category[]>(() => loadState("store_categories", defaultCategories));
  const [products, setProducts] = useState<Product[]>(() => loadState("store_products", defaultProducts));
  const [banners, setBanners] = useState<Banner[]>(() => loadState("store_banners", defaultBanners));
  const [orders, setOrders] = useState<Order[]>(() => loadState("store_orders", defaultOrders));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadState("store_coupons", defaultCoupons));
  const [offerBanners, setOfferBanners] = useState<OfferBanner[]>(() => loadState("store_offers", defaultOfferBanners));

  const updateSettings = useCallback((s: Partial<Settings>) => {
    setSettings((prev) => { const next = { ...prev, ...s }; saveState("store_settings", next); return next; });
  }, []);

  const addCategory = useCallback((c: Omit<Category, "id">) => {
    setCategories((prev) => { const next = [...prev, { ...c, id: genId() }]; saveState("store_categories", next); return next; });
  }, []);
  const updateCategory = useCallback((id: string, c: Partial<Category>) => {
    setCategories((prev) => { const next = prev.map((x) => x.id === id ? { ...x, ...c } : x); saveState("store_categories", next); return next; });
  }, []);
  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => { const next = prev.filter((x) => x.id !== id); saveState("store_categories", next); return next; });
  }, []);

  const addProduct = useCallback((p: Omit<Product, "id" | "totalSold" | "rating" | "reviewCount" | "createdAt">) => {
    setProducts((prev) => {
      const next = [...prev, { ...p, id: genId(), totalSold: 0, rating: 0, reviewCount: 0, createdAt: new Date().toISOString() }];
      saveState("store_products", next); return next;
    });
  }, []);
  const updateProduct = useCallback((id: string, p: Partial<Product>) => {
    setProducts((prev) => { const next = prev.map((x) => x.id === id ? { ...x, ...p } : x); saveState("store_products", next); return next; });
  }, []);
  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => { const next = prev.filter((x) => x.id !== id); saveState("store_products", next); return next; });
  }, []);

  const addBanner = useCallback((b: Omit<Banner, "id">) => {
    setBanners((prev) => { const next = [...prev, { ...b, id: genId() }]; saveState("store_banners", next); return next; });
  }, []);
  const updateBanner = useCallback((id: string, b: Partial<Banner>) => {
    setBanners((prev) => { const next = prev.map((x) => x.id === id ? { ...x, ...b } : x); saveState("store_banners", next); return next; });
  }, []);
  const deleteBanner = useCallback((id: string) => {
    setBanners((prev) => { const next = prev.filter((x) => x.id !== id); saveState("store_banners", next); return next; });
  }, []);

  const addOrder = useCallback((o: Order) => {
    setOrders((prev) => { const next = [...prev, o]; saveState("store_orders", next); return next; });
  }, []);
  const updateOrder = useCallback((id: string, o: Partial<Order>) => {
    setOrders((prev) => { const next = prev.map((x) => x.id === id ? { ...x, ...o } : x); saveState("store_orders", next); return next; });
  }, []);

  const addCoupon = useCallback((c: Omit<Coupon, "id" | "usedCount">) => {
    setCoupons((prev) => { const next = [...prev, { ...c, id: genId(), usedCount: 0 }]; saveState("store_coupons", next); return next; });
  }, []);
  const updateCoupon = useCallback((id: string, c: Partial<Coupon>) => {
    setCoupons((prev) => { const next = prev.map((x) => x.id === id ? { ...x, ...c } : x); saveState("store_coupons", next); return next; });
  }, []);
  const deleteCoupon = useCallback((id: string) => {
    setCoupons((prev) => { const next = prev.filter((x) => x.id !== id); saveState("store_coupons", next); return next; });
  }, []);

  const applyCoupon = useCallback((code: string, orderTotal: number) => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) return { valid: false, discount: 0, message: "Invalid coupon code" };
    if (new Date(coupon.expiresAt) < new Date()) return { valid: false, discount: 0, message: "Coupon has expired" };
    if (coupon.usedCount >= coupon.maxUses) return { valid: false, discount: 0, message: "Coupon usage limit reached" };
    if (orderTotal < coupon.minOrderAmount) return { valid: false, discount: 0, message: `Minimum order amount is ${settings.currency}${coupon.minOrderAmount}` };
    const discount = coupon.discountType === "percentage" ? (orderTotal * coupon.discountValue) / 100 : coupon.discountValue;
    return { valid: true, discount: Math.min(discount, orderTotal), message: `Coupon applied! You save ${settings.currency}${discount.toFixed(2)}` };
  }, [coupons, settings.currency]);

  const addOfferBanner = useCallback((o: Omit<OfferBanner, "id">) => {
    setOfferBanners((prev) => { const next = [...prev, { ...o, id: genId() }]; saveState("store_offers", next); return next; });
  }, []);
  const updateOfferBanner = useCallback((id: string, o: Partial<OfferBanner>) => {
    setOfferBanners((prev) => { const next = prev.map((x) => x.id === id ? { ...x, ...o } : x); saveState("store_offers", next); return next; });
  }, []);
  const deleteOfferBanner = useCallback((id: string) => {
    setOfferBanners((prev) => { const next = prev.filter((x) => x.id !== id); saveState("store_offers", next); return next; });
  }, []);

  return (
    <StoreContext.Provider value={{
      settings, updateSettings,
      categories, addCategory, updateCategory, deleteCategory,
      products, addProduct, updateProduct, deleteProduct,
      banners, addBanner, updateBanner, deleteBanner,
      orders, addOrder, updateOrder,
      coupons, addCoupon, updateCoupon, deleteCoupon, applyCoupon,
      offerBanners, addOfferBanner, updateOfferBanner, deleteOfferBanner,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
