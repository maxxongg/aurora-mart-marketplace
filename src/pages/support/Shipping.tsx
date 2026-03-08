export default function Shipping() {
  return (
    <div className="container mx-auto py-8 max-w-3xl prose prose-sm">
      <h1 className="font-display text-3xl font-bold mb-8">Shipping Policy</h1>
      <div className="space-y-6 text-muted-foreground">
        <section><h2 className="text-foreground font-display text-xl font-bold">Delivery Times</h2><p>Standard: 3-5 business days. Express: 1-2 business days (additional charges apply).</p></section>
        <section><h2 className="text-foreground font-display text-xl font-bold">Free Shipping</h2><p>All orders over $50 qualify for free standard shipping within Bangladesh.</p></section>
        <section><h2 className="text-foreground font-display text-xl font-bold">Tracking</h2><p>A tracking number will be sent to your email once your order has been shipped.</p></section>
        <section><h2 className="text-foreground font-display text-xl font-bold">International</h2><p>International shipping is available to select countries. Delivery typically takes 7-14 business days.</p></section>
      </div>
    </div>
  );
}
