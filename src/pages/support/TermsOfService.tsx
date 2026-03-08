import { useStore } from "@/context/StoreContext";

export default function TermsOfService() {
  const { settings } = useStore();
  const storeName = settings.storeName;

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
        <p className="text-foreground font-medium">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using {storeName}, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">2. Use of the Platform</h2>
          <p>You must be at least 18 years old to use {storeName}. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">3. Products & Orders</h2>
          <p>All product listings are subject to availability. We reserve the right to limit quantities, refuse orders, or cancel orders at our discretion. Prices are subject to change without notice.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">4. Payments</h2>
          <p>We accept various payment methods as listed at checkout. You agree to provide accurate billing information. All transactions are processed securely through our payment partners.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">5. Shipping & Delivery</h2>
          <p>Shipping times are estimates and not guaranteed. {storeName} is not responsible for delays caused by carriers or customs. Risk of loss transfers to you upon delivery to the carrier.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">6. Returns & Refunds</h2>
          <p>Our return and refund policy is outlined on our <a href="/returns" className="text-primary underline">Returns & Refund</a> page. By purchasing, you agree to those terms.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">7. Intellectual Property</h2>
          <p>All content on {storeName}, including logos, text, images, and software, is our property or our licensors' and is protected by intellectual property laws.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">8. Limitation of Liability</h2>
          <p>{storeName} shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or purchase of products.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">9. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">10. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="/contact" className="text-primary underline">our contact page</a> or email {settings.contactEmail}.</p>
        </section>
      </div>
    </div>
  );
}
