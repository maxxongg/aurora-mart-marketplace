import { Product, Category, Banner, Order, User, Settings, Coupon, OfferBanner } from "@/types";

export const defaultCategories: Category[] = [
  { id: "1", name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop", sortOrder: 1 },
  { id: "2", name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop", sortOrder: 2 },
  { id: "3", name: "Home & Living", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200&h=200&fit=crop", sortOrder: 3 },
  { id: "4", name: "Sports", image: "https://images.unsplash.com/photo-1461896836934-bd45ba2c5e08?w=200&h=200&fit=crop", sortOrder: 4 },
  { id: "5", name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop", sortOrder: 5 },
  { id: "6", name: "Books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop", sortOrder: 6 },
  { id: "7", name: "Groceries", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop", sortOrder: 7 },
  { id: "8", name: "Toys", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&h=200&fit=crop", sortOrder: 8 },
];

export const defaultProducts: Product[] = [
  {
    id: "1", name: "Wireless Bluetooth Headphones", description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and ultra-comfortable over-ear design.",
    categoryId: "1", brand: "SoundMax", productType: "Headphones", price: 79.99, originalPrice: 129.99, stock: 45, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop"],
    totalSold: 234, isFeatured: true, isFlashSale: true, status: "active", rating: 4.5, reviewCount: 128, createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "2", name: "Smart Watch Pro X", description: "Advanced smartwatch with health monitoring, GPS tracking, and a stunning AMOLED display.",
    categoryId: "1", brand: "TechNova", productType: "Smartwatch", price: 199.99, originalPrice: 299.99, stock: 22, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    totalSold: 189, isFeatured: true, isFlashSale: true, status: "active", rating: 4.7, reviewCount: 95, createdAt: "2026-03-02T10:00:00Z",
  },
  {
    id: "3", name: "Minimalist Leather Backpack", description: "Handcrafted genuine leather backpack with laptop compartment.",
    categoryId: "2", brand: "UrbanCarry", productType: "Bags", price: 89.99, originalPrice: 120.00, stock: 38, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    totalSold: 156, isFeatured: true, isFlashSale: false, status: "active", rating: 4.3, reviewCount: 67, createdAt: "2026-03-03T10:00:00Z",
  },
  {
    id: "4", name: "Organic Cotton T-Shirt", description: "Sustainably sourced 100% organic cotton t-shirt.",
    categoryId: "2", brand: "EcoWear", productType: "Clothing", price: 29.99, originalPrice: 45.00, stock: 120, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    totalSold: 412, isFeatured: false, isFlashSale: true, status: "active", rating: 4.1, reviewCount: 203, createdAt: "2026-02-28T10:00:00Z",
  },
  {
    id: "5", name: "Ceramic Plant Pot Set", description: "Set of 3 modern ceramic plant pots with drainage holes.",
    categoryId: "3", brand: "GreenHome", productType: "Decor", price: 34.99, originalPrice: 49.99, stock: 67, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    totalSold: 98, isFeatured: false, isFlashSale: false, status: "active", rating: 4.6, reviewCount: 45, createdAt: "2026-03-04T10:00:00Z",
  },
  {
    id: "6", name: "Professional Yoga Mat", description: "Extra thick, non-slip yoga mat with alignment lines.",
    categoryId: "4", brand: "FlexFit", productType: "Fitness Gear", price: 45.99, originalPrice: 65.00, stock: 54, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    totalSold: 167, isFeatured: true, isFlashSale: false, status: "active", rating: 4.4, reviewCount: 89, createdAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "7", name: "Luxury Skincare Set", description: "Complete skincare routine with cleanser, toner, serum, and moisturizer.",
    categoryId: "5", brand: "GlowLab", productType: "Skincare", price: 64.99, originalPrice: 95.00, stock: 33, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    totalSold: 278, isFeatured: true, isFlashSale: true, status: "active", rating: 4.8, reviewCount: 156, createdAt: "2026-03-06T10:00:00Z",
  },
  {
    id: "8", name: "Bestselling Novel Collection", description: "Curated collection of 5 award-winning novels.",
    categoryId: "6", brand: "PageTurner", productType: "Fiction", price: 42.99, originalPrice: 60.00, stock: 78, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    totalSold: 345, isFeatured: false, isFlashSale: false, status: "active", rating: 4.9, reviewCount: 234, createdAt: "2026-02-25T10:00:00Z",
  },
  {
    id: "9", name: "Portable Bluetooth Speaker", description: "Waterproof portable speaker with 360° sound, 20-hour battery.",
    categoryId: "1", brand: "SoundMax", productType: "Speakers", price: 49.99, originalPrice: 79.99, stock: 61, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    totalSold: 198, isFeatured: false, isFlashSale: true, status: "active", rating: 4.2, reviewCount: 112, createdAt: "2026-03-07T10:00:00Z",
  },
  {
    id: "10", name: "Running Shoes Elite", description: "Lightweight performance running shoes with responsive cushioning.",
    categoryId: "4", brand: "FlexFit", productType: "Footwear", price: 119.99, originalPrice: 159.99, stock: 29, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    totalSold: 521, isFeatured: true, isFlashSale: false, status: "active", rating: 4.6, reviewCount: 287, createdAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "11", name: "Stainless Steel Water Bottle", description: "Double-wall vacuum insulated bottle.",
    categoryId: "4", brand: "HydroCore", productType: "Accessories", price: 24.99, originalPrice: 35.00, stock: 150, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    totalSold: 678, isFeatured: false, isFlashSale: false, status: "active", rating: 4.3, reviewCount: 342, createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "12", name: "Wireless Charging Pad", description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    categoryId: "1", brand: "TechNova", productType: "Chargers", price: 19.99, originalPrice: 29.99, stock: 89, image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    totalSold: 432, isFeatured: false, isFlashSale: true, status: "active", rating: 4.0, reviewCount: 198, createdAt: "2026-02-10T10:00:00Z",
  },
];

export const defaultBanners: Banner[] = [
  { id: "1", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop", link: "/products", altText: "Mega Sale - Up to 70% Off", sortOrder: 1, isActive: true },
  { id: "2", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop", link: "/new-arrivals", altText: "New Arrivals - Fresh Styles", sortOrder: 2, isActive: true },
  { id: "3", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop", link: "/best-sellers", altText: "Best Sellers Collection", sortOrder: 3, isActive: true },
];

export const defaultOrders: Order[] = [
  {
    id: "ORD-001", userId: "1", total: 279.97, status: "delivered",
    shippingName: "John Doe", shippingPhone: "+1234567890", shippingAddress: "123 Main St", shippingCity: "Dhaka", shippingZip: "1205",
    paymentMethod: "cod", paymentStatus: "paid", createdAt: "2026-02-15T10:00:00Z",
    items: [{ id: "1", productId: "1", quantity: 1, price: 79.99 }, { id: "2", productId: "2", quantity: 1, price: 199.99 }],
  },
  {
    id: "ORD-002", userId: "1", total: 89.99, status: "shipped",
    shippingName: "John Doe", shippingPhone: "+1234567890", shippingAddress: "123 Main St", shippingCity: "Dhaka", shippingZip: "1205",
    paymentMethod: "bkash", paymentStatus: "paid", createdAt: "2026-03-01T10:00:00Z",
    items: [{ id: "3", productId: "3", quantity: 1, price: 89.99 }],
  },
  {
    id: "ORD-003", userId: "1", total: 139.97, status: "processing",
    shippingName: "John Doe", shippingPhone: "+1234567890", shippingAddress: "123 Main St", shippingCity: "Dhaka", shippingZip: "1205",
    paymentMethod: "stripe", paymentStatus: "paid", createdAt: "2026-03-05T10:00:00Z",
    items: [{ id: "4", productId: "6", quantity: 1, price: 45.99 }, { id: "5", productId: "7", quantity: 1, price: 64.99 }, { id: "6", productId: "4", quantity: 1, price: 29.99 }],
  },
];

export const defaultUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1234567890", role: "customer", createdAt: "2026-01-01T10:00:00Z" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", role: "seller", createdAt: "2026-01-05T10:00:00Z" },
  { id: "3", name: "Admin User", email: "admin@auroramart.com", phone: "+1234567892", role: "admin", createdAt: "2025-12-01T10:00:00Z" },
];

export const defaultSettings: Settings = {
  storeName: "Aurora Mart",
  storeLogo: "",
  announcementText: "🔥 Free shipping on orders over $50! Use code: FREESHIP",
  announcementLink: "/products",
  flashSaleEnd: "2026-03-15T23:59:59Z",
  contactEmail: "support@auroramart.com",
  contactPhone: "+880 1234-567890",
  contactAddress: "Dhaka, Bangladesh",
  socialFacebook: "https://facebook.com/auroramart",
  socialInstagram: "https://instagram.com/auroramart",
  socialTwitter: "https://twitter.com/auroramart",
  currency: "$",
  freeShippingThreshold: 50,
  shippingCost: 5.99,
};

export const defaultCoupons: Coupon[] = [
  { id: "1", code: "FREESHIP", discountType: "fixed", discountValue: 5.99, minOrderAmount: 50, maxUses: 1000, usedCount: 245, isActive: true, expiresAt: "2026-06-30T23:59:59Z" },
  { id: "2", code: "SAVE20", discountType: "percentage", discountValue: 20, minOrderAmount: 30, maxUses: 500, usedCount: 89, isActive: true, expiresAt: "2026-04-30T23:59:59Z" },
];

export const defaultOfferBanners: OfferBanner[] = [
  { id: "1", title: "Spring Collection 2026", subtitle: "Discover the latest trends at unbeatable prices", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop", link: "/products", isActive: true },
];
