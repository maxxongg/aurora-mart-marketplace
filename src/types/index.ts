export type UserRole = "customer" | "seller" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  sellerId?: string;
  name: string;
  description: string;
  categoryId: string;
  category?: Category;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  images?: string[];
  totalSold: number;
  isFeatured: boolean;
  isFlashSale: boolean;
  rating: number;
  reviewCount: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
}

export interface Banner {
  id: string;
  image: string;
  link: string;
  altText: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  paymentMethod: "cod" | "sslcommerz" | "bkash" | "stripe";
  paymentStatus: "unpaid" | "paid" | "refunded";
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
}

export interface Settings {
  storeName: string;
  announcementText: string;
  flashSaleEnd: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
}
