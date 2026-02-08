"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

// 1. New Constants for Ranges (Matches Profile Page)
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    job_title: "Senior Consultant",
    specialization: "Pain Management",
    department: "General",
    hospital: "",
    experience: "",
    license_id: "",
    phone_number: "",
    gender: "Male",
    qualifications: "",
    bio: "",
    working_days: "Monday – Friday",       
    working_hours: "09:00 AM – 05:00 PM",  
    consultation_mode: "In-person & Video"
  });

  // Generic Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Helper to safely parse ranges (e.g. "Monday – Friday")
  const getRangeParts = (value: string) => {
    if (!value) return { start: "", end: "" };
    // Regex handles both en-dash (–) and hyphen (-)
    const separatorRegex = /\s?[–-]\s?/;
    const parts = value.split(separatorRegex);
    return { 
        start: parts[0]?.trim() || "", 
        end: parts[1]?.trim() || "" 
    };
  };

  // 3. Range Handler (Combines Start + End back into string)
  const handleRangeChange = (field: "working_days" | "working_hours", part: "start" | "end", value: string) => {
    setFormData((prev) => {
      const currentVal = prev[field];
      const { start, end } = getRangeParts(currentVal);
      
      const newStart = part === "start" ? value : start;
      const newEnd = part === "end" ? value : end;
      
      return {
        ...prev,
        [field]: `${newStart} – ${newEnd}`
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("No authenticated user found.");

        const { error: dbError } = await supabase
            .from('doctor_profiles')
            .insert([
                {
                    user_id: user.id,
                    job_title: formData.job_title,
                    specialization: formData.specialization,
                    department: formData.department,
                    hospital: formData.hospital,
                    experience: formData.experience,
                    license_id: formData.license_id,
                    phone_number: formData.phone_number,
                    gender: formData.gender,
                    qualifications: formData.qualifications,
                    bio: formData.bio,
                    working_days: formData.working_days,
                    working_hours: formData.working_hours,
                    consultation_mode: formData.consultation_mode,
                    status: 'Active'
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

  return (
    <div className="w-full min-h-screen flex bg-white font-sans text-slate-900">
      
      {/* Left Column - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden fixed h-screen">
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

      {/* Right Column - Scrollable Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 md:px-20 relative bg-white py-12 ml-auto">
         
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
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
                        <input name="job_title" required value={formData.job_title} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Specialization</label>
                        <input name="specialization" required value={formData.specialization} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                      </div>
                  </div>

                  {/* Row 2: Department & Qualifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                        <input name="department" value={formData.department} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Qualifications</label>
                        <input name="qualifications" placeholder="e.g. MBBS, MD" value={formData.qualifications} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                      </div>
                  </div>

                  {/* Row 3: Hospital */}
                  <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Hospital / Clinic Name</label>
                      <input name="hospital" required value={formData.hospital} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="Where do you practice?" />
                  </div>

                  {/* Row 4: Experience & License */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-2">Experience</label>
                         <input name="experience" required value={formData.experience} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" placeholder="e.g. 12 Years" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-2">License ID</label>
                         <input name="license_id" required value={formData.license_id} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                      </div>
                  </div>

                  {/* Row 5: Contact & Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                         <input name="phone_number" required value={formData.phone_number} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                         <div className="relative">
                            <select name="gender" value={formData.gender} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                         </div>
                      </div>
                  </div>

                   {/* Row 6: Availability (UPDATED DUAL DROPDOWNS) */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Working Days */}
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-2">Working Days</label>
                         <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                            {/* Start Day */}
                            <div className="relative w-full">
                                <select 
                                    value={getRangeParts(formData.working_days).start}
                                    onChange={(e) => handleRangeChange('working_days', 'start', e.target.value)}
                                    className="block w-full rounded-lg bg-white border border-slate-200 py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                                >
                                    {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            
                            <span className="text-slate-400 font-bold">→</span>
                            
                            {/* End Day */}
                            <div className="relative w-full">
                                <select 
                                    value={getRangeParts(formData.working_days).end}
                                    onChange={(e) => handleRangeChange('working_days', 'end', e.target.value)}
                                    className="block w-full rounded-lg bg-white border border-slate-200 py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                                >
                                    {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                         </div>
                      </div>

                      {/* Working Hours */}
                      <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-2">Working Hours</label>
                         <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                             {/* Start Time */}
                             <div className="relative w-full">
                                <select 
                                    value={getRangeParts(formData.working_hours).start}
                                    onChange={(e) => handleRangeChange('working_hours', 'start', e.target.value)}
                                    className="block w-full rounded-lg bg-white border border-slate-200 py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                                >
                                    {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                             </div>
                             
                             <span className="text-slate-400 font-bold">-</span>

                             {/* End Time */}
                             <div className="relative w-full">
                                <select 
                                    value={getRangeParts(formData.working_hours).end}
                                    onChange={(e) => handleRangeChange('working_hours', 'end', e.target.value)}
                                    className="block w-full rounded-lg bg-white border border-slate-200 py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                                >
                                    {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                             </div>
                         </div>
                      </div>
                  </div>

                  {/* Row 7: Consultation Mode */}
                  <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Consultation Mode</label>
                      <div className="relative">
                          <select name="consultation_mode" value={formData.consultation_mode} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer">
                            <option>In-person & Video</option>
                            <option>In-person Only</option>
                            <option>Video Only</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                             <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                          </div>
                      </div>
                  </div>

                  {/* Row 8: Bio */}
                  <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Professional Bio</label>
                      <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange} className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none" placeholder="Brief description about yourself..."></textarea>
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