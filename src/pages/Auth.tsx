import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import { User, ShieldCheck, Store, Eye, EyeOff } from "lucide-react";

type AuthPanel = "customer" | "seller";

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { settings } = useStore();
  const [panel, setPanel] = useState<AuthPanel>("customer");

  // Password visibility
  const [showCustPass, setShowCustPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showSellerPass, setShowSellerPass] = useState(false);

  // Customer login
  const [custEmail, setCustEmail] = useState("");
  const [custPass, setCustPass] = useState("");

  // Customer register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPass, setRegPass] = useState("");

  // Seller/Admin login
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPass, setSellerPass] = useState("");

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(custEmail, custPass, "customer");
    if (result.success) { toast.success("Welcome back!"); navigate("/"); }
    else toast.error(result.message || "Invalid credentials");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register(regName, regEmail, regPhone, regPass);
    if (ok) { toast.success("Account created!"); navigate("/"); }
  };

  const handleSellerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(sellerEmail, sellerPass, "seller");
    if (result.success) {
      const role = result.role;
      if (role === "admin") { toast.success("Welcome, Admin!"); navigate("/admin"); }
      else if (role === "seller") { toast.success("Welcome, Seller!"); navigate("/seller"); }
      else { toast.error("This account doesn't have seller/admin access"); }
    } else {
      toast.error(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-bold">Welcome to <span className="text-gradient">{settings.storeName}</span></h1>
          <p className="text-muted-foreground mt-2">Choose your login type</p>
        </div>

        {/* Panel Switcher */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setPanel("customer")}
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${panel === "customer" ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card hover:border-primary/40"}`}
          >
            <User className={`h-5 w-5 ${panel === "customer" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-left">
              <p className={`text-sm font-semibold ${panel === "customer" ? "text-primary" : ""}`}>Customer</p>
              <p className="text-[10px] text-muted-foreground">Shop & order</p>
            </div>
          </button>
          <button
            onClick={() => setPanel("seller")}
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${panel === "seller" ? "border-primary bg-primary/10 shadow-md" : "border-border bg-card hover:border-primary/40"}`}
          >
            <Store className={`h-5 w-5 ${panel === "seller" ? "text-primary" : "text-muted-foreground"}`} />
            <div className="text-left">
              <p className={`text-sm font-semibold ${panel === "seller" ? "text-primary" : ""}`}>Seller</p>
              <p className="text-[10px] text-muted-foreground">Manage store</p>
            </div>
          </button>
        </div>

        {/* Customer Panel */}
        {panel === "customer" && (
          <div className="bg-card border rounded-xl p-6">
            <Tabs defaultValue="login">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleCustomerLogin} className="space-y-4">
                  <div><Label>Email</Label><Input type="email" value={custEmail} onChange={(e) => setCustEmail(e.target.value)} required placeholder="you@example.com" /></div>
                  <div><Label>Password</Label><div className="relative"><Input type={showCustPass ? "text" : "password"} value={custPass} onChange={(e) => setCustPass(e.target.value)} required placeholder="••••••••" className="pr-10" /><button type="button" onClick={() => setShowCustPass(!showCustPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showCustPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
                  <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">
                    <User className="h-4 w-4 mr-2" /> Sign In as Customer
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">Demo: john@example.com (any password)</p>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div><Label>Full Name</Label><Input value={regName} onChange={(e) => setRegName(e.target.value)} required placeholder="John Doe" /></div>
                  <div><Label>Email</Label><Input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required placeholder="you@example.com" /></div>
                  <div><Label>Phone</Label><Input value={regPhone} onChange={(e) => setRegPhone(e.target.value)} required placeholder="+880 1234567890" /></div>
                  <div><Label>Password</Label><div className="relative"><Input type={showRegPass ? "text" : "password"} value={regPass} onChange={(e) => setRegPass(e.target.value)} required placeholder="••••••••" className="pr-10" /><button type="button" onClick={() => setShowRegPass(!showRegPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showRegPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
                  <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Create Account</Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Seller / Admin Panel */}
        {panel === "seller" && (
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-display font-bold text-sm">Seller Portal</h2>
                <p className="text-xs text-muted-foreground">Access your dashboard to manage products & orders</p>
              </div>
            </div>
            <form onSubmit={handleSellerLogin} className="space-y-4">
              <div><Label>Email</Label><Input type="email" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} required placeholder="seller@example.com" /></div>
              <div><Label>Password</Label><Input type="password" value={sellerPass} onChange={(e) => setSellerPass(e.target.value)} required placeholder="••••••••" /></div>
              <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">
                <Store className="h-4 w-4 mr-2" /> Sign In
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
