"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form Data State - strictly for Doctor Profile
  const [formData, setFormData] = useState({
    phone: "",
    gender: "Prefer not to say",
    specialization: "",
    hospital: "",
    experience: "",
    license: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Call API to save Doctor data
    const result = await completeOnboarding(formData);

    if (result.error) {
      alert(`Error: ${result.error}`);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
          <p className="text-blue-100 mt-2">Please enter your professional details to proceed.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              {/* Personal Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Specialization</label>
                <input
                  required
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Cardiologist, Pain Specialist"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Hospital / Clinic</label>
                   <input
                     required
                     name="hospital"
                     value={formData.hospital}
                     onChange={handleChange}
                     placeholder="City General"
                     className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Experience (Years)</label>
                   <input
                     required
                     name="experience"
                     value={formData.experience}
                     onChange={handleChange}
                     placeholder="e.g. 10"
                     className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">License ID</label>
                <input
                  required
                  name="license"
                  value={formData.license}
                  onChange={handleChange}
                  placeholder="Medical License Number"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/20"
            >
              {isLoading ? "Saving Profile..." : "Complete Setup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}