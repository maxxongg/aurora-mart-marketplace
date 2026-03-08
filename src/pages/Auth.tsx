import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPass, setRegPass] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(loginEmail, loginPass);
    if (ok) { toast.success("Welcome back!"); navigate("/"); }
    else toast.error("Invalid credentials");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register(regName, regEmail, regPhone, regPass);
    if (ok) { toast.success("Account created!"); navigate("/"); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">Welcome to <span className="text-gradient">Aurora Mart</span></h1>
          <p className="text-muted-foreground mt-2">Sign in or create an account to continue</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <Tabs defaultValue="login">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div><Label>Email</Label><Input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required placeholder="you@example.com" /></div>
                <div><Label>Password</Label><Input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required placeholder="••••••••" /></div>
                <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Sign In</Button>
                <p className="text-xs text-center text-muted-foreground">Demo: use admin@auroramart.com or jane@example.com</p>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div><Label>Full Name</Label><Input value={regName} onChange={(e) => setRegName(e.target.value)} required placeholder="John Doe" /></div>
                <div><Label>Email</Label><Input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required placeholder="you@example.com" /></div>
                <div><Label>Phone</Label><Input value={regPhone} onChange={(e) => setRegPhone(e.target.value)} required placeholder="+880 1234567890" /></div>
                <div><Label>Password</Label><Input type="password" value={regPass} onChange={(e) => setRegPass(e.target.value)} required placeholder="••••••••" /></div>
                <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Create Account</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
