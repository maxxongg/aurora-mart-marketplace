import { useStore } from "@/context/StoreContext";

export default function Shipping() {
  const { settings } = useStore();
  return (
    <div className="container mx-auto py-8 max-w-3xl prose prose-sm">
      <h1 className="font-display text-3xl font-bold mb-8">Shipping Policy</h1>
      <div className="space-y-6 text-muted-foreground">
        {settings.shippingSections.map((s, i) => (
          <section key={i}><h2 className="text-foreground font-display text-xl font-bold">{s.title}</h2><p>{s.body}</p></section>
        ))}
      </div>
    </div>
  );
}
