# Aurora Mart — Multi-Vendor E-Commerce Platform

A fully self-contained, production-ready multi-vendor e-commerce platform built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

> **No external services required.** All data is stored in browser `localStorage`. No backend, database, or third-party API needed to run.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (https://nodejs.org)
- **npm** 9+ (comes with Node.js)

### Install & Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# → Opens at http://localhost:8080

# 3. Build for production
npm run build
# → Outputs to ./dist/

# 4. Preview production build locally
npm run preview
```

---

## 📦 Hosting / Deployment

After `npm run build`, upload the entire `dist/` folder contents to any static host:

| Host | How |
|------|-----|
| **cPanel / Shared Hosting** | Upload `dist/` contents to `public_html/` |
| **Netlify** | Drag & drop `dist/` folder |
| **Vercel** | `vercel --prod` or connect Git repo |
| **GitHub Pages** | Push `dist/` to `gh-pages` branch |
| **AWS S3 + CloudFront** | Upload `dist/` to S3 bucket |
| **VPS (Nginx/Apache)** | Serve `dist/` as static files |

### ⚠️ SPA Routing (Important!)
This is a Single Page Application. Configure your server to redirect all routes to `index.html`:

**Apache (.htaccess)** — place in your `public_html/` folder:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Netlify** — create `public/_redirects` (auto-copied to dist):
```
/*    /index.html   200
```

---

## 📁 Project Structure

```
aurora-mart/
├── public/                  # Static assets (copied as-is to dist/)
│   ├── favicon.ico
│   ├── robots.txt
│   └── placeholder.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/          # Header, Footer, Admin/Seller layouts
│   │   ├── ui/              # shadcn/ui component library
│   │   ├── OrderTracking.tsx
│   │   └── ProductCard.tsx
│   ├── context/             # React Context providers (Auth, Cart, Store, Media, Wishlist)
│   ├── data/defaults.ts     # Default seed data (products, categories, settings)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities (Tailwind merge, image validation)
│   ├── pages/               # Route pages
│   │   ├── admin/           # Admin CMS (10 pages)
│   │   ├── seller/          # Seller dashboard (4 pages)
│   │   ├── support/         # FAQ, Contact, Shipping, Returns, Terms, Privacy
│   │   └── *.tsx            # Customer pages (Home, Products, Cart, etc.)
│   ├── types/index.ts       # TypeScript type definitions
│   ├── App.tsx              # Root component & router
│   ├── index.css            # Design tokens & Tailwind config
│   └── main.tsx             # Entry point
├── index.html               # HTML template with SEO meta tags
├── vite.config.ts           # Build config with code splitting
├── tailwind.config.ts       # Tailwind CSS config
└── package.json             # Dependencies & scripts
```

---

## 🔐 Demo Accounts

| Role | Email | Notes |
|------|-------|-------|
| **Customer** | `john@example.com` | Storefront, orders, wishlist |
| **Seller** | `jane@example.com` | Seller dashboard at `/seller` |
| **Admin** | `admin@auroramart.com` | Full CMS at `/admin` |

> **Demo mode**: Any password works. Authentication is mocked for frontend demonstration.

---

## ✨ Features

### Customer Storefront
- Product browsing with advanced search, filters & category navigation
- Shopping cart & multi-step checkout
- Wishlist management
- Order history with visual step-by-step tracking
- Dark/light mode toggle
- Fully responsive (mobile, tablet, desktop)

### Admin CMS (`/admin`)
- Dashboard with sales analytics & charts
- Product CRUD management
- Category management
- Homepage banner management
- Order management with status updates & tracking
- Customer overview
- Coupon/discount system
- Promotional offer banners
- Navigation menu editor (reorder, show/hide, custom links)
- Media library with image upload & size validation (max 4 MB)
- Store settings (logo upload, currency, shipping, social links, FAQ, policies)

### Seller Panel (`/seller`)
- Sales dashboard overview
- Product management
- Order tracking with status updates
- Account settings

---

## 🎨 Design System

- **Fonts**: Space Grotesk (headings) + DM Sans (body)
- **Colors**: HSL design tokens with full light/dark mode
- **UI Library**: shadcn/ui built on Radix UI primitives
- **Animations**: Framer Motion page transitions & micro-interactions
- **Icons**: Lucide React

---

## ⚙️ Customization

| What | Where |
|------|-------|
| Store name, logo, currency | Admin panel → Settings, or edit `src/data/defaults.ts` |
| Theme colors | `src/index.css` — CSS variables under `:root` and `.dark` |
| Default products/categories | `src/data/defaults.ts` |
| SEO meta tags | `index.html` |
| Product images | Replace Unsplash URLs in `src/data/defaults.ts` with your own |

---

## 🔧 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| shadcn/ui + Radix UI | Accessible component library |
| React Router 6 | Client-side routing |
| Framer Motion | Animations |
| Recharts | Dashboard charts |
| Sonner | Toast notifications |
| Lucide React | Icons |

---

## 📝 Important Notes

1. **Build step required**: Run `npm run build` to generate the `dist/` folder. The output is plain HTML/CSS/JS.
2. **Data persistence**: All data lives in browser `localStorage`. Clearing browser data resets to defaults.
3. **Product images**: Currently loaded from Unsplash CDN URLs — they work from any host. For full offline support, download and replace with local paths.
4. **No backend**: This is frontend-only. For a production store with real users, add a backend with database, authentication, and payment processing.
5. **Fonts**: Loaded from Google Fonts CDN. For fully offline use, download the font files and update `src/index.css`.

---

## 📄 License

MIT — free for personal and commercial use.
