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
  status: "active" | "draft" | "archived";
  rating: number;
  reviewCount: number;
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

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "sslcommerz" | "bkash" | "stripe";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Settings {
  storeName: string;
  announcementText: string;
  flashSaleEnd: string;
  contactEmail: string;
  contactPhone: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
}
