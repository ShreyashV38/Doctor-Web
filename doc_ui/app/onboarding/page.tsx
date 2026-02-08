"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    role: "Senior Consultant",
    specialization: "Pain Management",
    hospital: "",
    experience: "",
    phone: "",
    gender: "Male",
    license: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        // 1. Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("No authenticated user found.");

        // 2. Insert into 'doctor_profiles' table
        const { error: dbError } = await supabase
            .from('doctor_profiles')
            .insert([
                {
                    user_id: user.id, // Links to users table
                    specialization: formData.specialization,
                    hospital: formData.hospital,
                    experience: formData.experience,
                    license_id: formData.license,
                    phone_number: formData.phone,
                    gender: formData.gender,
                    // 'role'/title could also go here if added to schema, or mapped to existing columns
                }
            ]);

        if (dbError) throw dbError;

        router.push("/dashboard");

    } catch (error: any) {
        console.error("Onboarding Error:", error);
        alert(error.message || "Failed to save profile.");
    } finally {
        setIsLoading(false);
    }
  };

  // ... (Your JSX Return remains exactly the same)
  return (
    <div className="w-full min-h-screen flex bg-white font-sans text-slate-900">
      {/* ... KEEP YOUR EXISTING UI CODE HERE ... */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 z-0"></div>
        <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full">
           <div className="relative w-80 h-80 mb-8">
              <Image src="/logo2.png" alt="SymptoTrack" fill className="object-contain drop-shadow-2xl" priority />
           </div>
           
           <div className="text-center max-w-md">
             <h2 className="text-3xl font-bold text-white mb-3">Professional Profile</h2>
             <p className="text-slate-400 text-lg leading-relaxed">
               Complete your details to help patients find the right specialist for their needs.
             </p>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 relative bg-white py-12 lg:py-0 overflow-y-auto">
         
         <div className="max-w-xl mx-auto w-full">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Setup Your Profile</h1>
                <p className="text-slate-500">Please provide your professional details.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Row 1: Role & Specialization */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Role / Title</label>
                        <input name="role" required value={formData.role} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Specialization</label>
                        <input name="specialization" required value={formData.specialization} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                      </div>
                  </div>

                  {/* Row 2: Hospital */}
                  <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Hospital</label>
                     <input name="hospital" required value={formData.hospital} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="Hospital Name" />
                  </div>

                  {/* Row 3: Experience & License (Added Experience Here) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-2">Experience</label>
                         <input name="experience" required value={formData.experience} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="e.g. 12 Years" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-2">License ID</label>
                         <input name="license" required value={formData.license} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                      </div>
                  </div>

                  {/* Row 4: Phone & Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                         <input name="phone" required value={formData.phone} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                         <select name="gender" value={formData.gender} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                         </select>
                      </div>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98] transition-all disabled:opacity-70">
                  {isLoading ? "Saving Profile..." : "Complete Setup"}
                </button>
            </form>
         </div>
      </div>
    </div>
  );
}