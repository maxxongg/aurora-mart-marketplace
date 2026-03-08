export default function Returns() {
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-8">Returns & Refund Policy</h1>
      <div className="space-y-6 text-muted-foreground">
        <section><h2 className="text-foreground font-display text-xl font-bold">30-Day Returns</h2><p>You may return most items within 30 days of delivery for a full refund. Items must be unused and in original packaging.</p></section>
        <section><h2 className="text-foreground font-display text-xl font-bold">How to Return</h2><p>Contact our support team with your order number. We'll provide a prepaid return label.</p></section>
        <section><h2 className="text-foreground font-display text-xl font-bold">Refund Processing</h2><p>Refunds are processed within 5-7 business days after we receive the returned item. Original payment method will be credited.</p></section>
        <section><h2 className="text-foreground font-display text-xl font-bold">Exceptions</h2><p>Perishable goods, custom items, and gift cards are non-returnable.</p></section>
      </div>
    </div>
  );
}
