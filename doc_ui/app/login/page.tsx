"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen flex bg-white font-sans text-slate-900">
      
      {/* LEFT SIDE: Professional Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        {/* Abstract Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 z-0"></div>
        
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 z-0" 
             style={{ 
               backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
               backgroundSize: '32px 32px' 
             }}>
        </div>

        

        {/* Center Content: Logo & Tagline */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
           <div className="relative w-80 h-80 mb-8">
              {/* Logo floating freely - No Box */}
              <Image 
                src="/logo2.png" 
                alt="SymptoTrack" 
                fill 
                className="object-contain drop-shadow-2xl"
                priority 
              />
           </div>
           
           <div className="text-center max-w-md">
             <h2 className="text-3xl font-bold text-white mb-3">Seamless Patient Care</h2>
             <p className="text-slate-400 text-lg leading-relaxed">
               Monitor vitals, manage appointments, and track recovery in real-time with AI-driven insights.
             </p>
           </div>
        </div>

      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 relative bg-white">
         
         {/* Top Right Nav */}
         <div className="absolute top-8 right-8 flex items-center gap-3 text-sm">
            <span className="text-slate-400">Not a Member?</span>
            <Link 
              href="/signup" 
              className="font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Sign Up
            </Link>
         </div>

         <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
                <p className="text-slate-500">Enter your credentials to access your dashboard.</p>
            </div>

            {/* Form Container */}
            <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      placeholder="doctor@hospital.com"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-slate-700">Password</label>
                        <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">Forgot Password?</a>
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98] transition-all disabled:opacity-70"
                >
                  {isLoading ? "Signing In..." : "Sign In to Dashboard"}
                </button>
            </form>

            {/* Social Divider */}
            <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                   <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 hover:bg-slate-50 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/><path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1904 21.1039L16.3233 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/><path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05"/><path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/></svg>
                      <span className="text-sm font-medium text-slate-600">Google</span>
                   </button>
                   <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 hover:bg-slate-50 transition-colors">
                      <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.65-.95 1.87.11 3.48 1.1 4.3 2.52-3.75 2.13-2.9 6.75 1.25 8.03-.45 1.16-1.05 2.22-1.63 2.63h-.05zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                      <span className="text-sm font-medium text-slate-600">Apple</span>
                   </button>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}