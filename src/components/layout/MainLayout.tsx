import Header from "./Header";
import Footer from "./Footer";
import AnimatedOutlet from "@/components/AnimatedOutlet";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AnimatedOutlet />
      </main>
      <Footer />
    </div>
  );
}
