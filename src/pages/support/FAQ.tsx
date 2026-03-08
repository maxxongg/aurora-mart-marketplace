import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useStore } from "@/context/StoreContext";

export default function FAQ() {
  const { settings } = useStore();
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="space-y-2">
        {settings.faqItems.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
            <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
