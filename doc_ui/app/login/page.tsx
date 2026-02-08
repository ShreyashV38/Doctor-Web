"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Import real connection

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        // 1. Real Login with Supabase
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // 2. Success! Go to dashboard
        router.push("/dashboard");

    } catch (error: any) {
        console.error("Login Error:", error);
        alert(error.message || "Failed to login");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-white font-sans text-slate-900">
      
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 z-0"></div>
        <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full">
           <div className="relative w-80 h-80 mb-8">
              <Image src="/logo2.png" alt="SymptoTrack" fill className="object-contain drop-shadow-2xl" priority />
           </div>
           
           <div className="text-center max-w-md">
             <h2 className="text-3xl font-bold text-white mb-3">Seamless Patient Care</h2>
             <p className="text-slate-400 text-lg leading-relaxed">
               Monitor vitals, manage appointments, and track recovery in real-time with AI-driven insights.
             </p>
           </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 relative bg-white">
         <div className="absolute top-8 right-8 flex items-center gap-3 text-sm">
            <span className="text-slate-400">Not a Member?</span>
            <Link href="/signup" className="font-semibold text-slate-700 hover:text-blue-600 transition-colors">Sign Up</Link>
         </div>

         <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
                <p className="text-slate-500">Enter your credentials to access your dashboard.</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="doctor@hospital.com" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-slate-700">Password</label>
                        <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">Forgot Password?</a>
                    </div>
                    <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="••••••••" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98] transition-all disabled:opacity-70">
                  {isLoading ? "Signing In..." : "Sign In to Dashboard"}
                </button>
            </form>
         </div>
      </div>
    </div>
  );
}