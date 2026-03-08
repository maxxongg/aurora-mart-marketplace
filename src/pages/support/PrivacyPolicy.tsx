import { useStore } from "@/context/StoreContext";

export default function PrivacyPolicy() {
  const { settings } = useStore();
  const storeName = settings.storeName;

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
        <p className="text-foreground font-medium">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly, such as your name, email address, shipping address, and payment details when you create an account or place an order on {storeName}.</p>
          <p>We also automatically collect usage data including your IP address, browser type, pages visited, and device information.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Communicate about your account and orders</li>
            <li>Send promotional offers (with your consent)</li>
            <li>Improve our platform and user experience</li>
            <li>Prevent fraud and ensure security</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">3. Information Sharing</h2>
          <p>We do not sell your personal data. We may share information with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Payment processors to complete transactions</li>
            <li>Shipping carriers to deliver orders</li>
            <li>Service providers who assist our operations</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">4. Cookies & Tracking</h2>
          <p>We use cookies and similar technologies to remember your preferences, keep you signed in, and analyze site traffic. You can manage cookie preferences through your browser settings.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">5. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data, including encryption for all payment transactions and secure storage of personal information.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Export your data in a portable format</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">7. Data Retention</h2>
          <p>We retain your data for as long as your account is active or as needed to provide services. Order records are kept for accounting and legal compliance purposes.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">8. Children's Privacy</h2>
          <p>{storeName} is not intended for children under 13. We do not knowingly collect data from children under 13.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">9. Changes to This Policy</h2>
          <p>We may update this privacy policy periodically. We will notify you of significant changes via email or a notice on our platform.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">10. Contact Us</h2>
          <p>For privacy-related inquiries, reach us at <a href="/contact" className="text-primary underline">our contact page</a> or email {settings.contactEmail}.</p>
        </section>
      </div>
    </div>
  );
}
