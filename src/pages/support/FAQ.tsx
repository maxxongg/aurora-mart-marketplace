import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I place an order?", a: "Browse products, add items to your cart, proceed to checkout, fill in your shipping details and select a payment method." },
  { q: "What payment methods do you accept?", a: "We accept Cash on Delivery (COD), bKash, and credit/debit cards via Stripe." },
  { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days within Bangladesh. Express shipping is available for 1-2 day delivery." },
  { q: "Can I return or exchange an item?", a: "Yes, we offer a 30-day return policy. Items must be in original condition with tags attached." },
  { q: "How do I become a seller?", a: "Contact our support team to apply for a seller account. We'll review your application within 48 hours." },
  { q: "Is my payment information secure?", a: "Absolutely. All payments are processed through encrypted, PCI-compliant payment gateways." },
];

export default function FAQ() {
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
            <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
