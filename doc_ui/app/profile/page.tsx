"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getDoctorProfile, updateDoctorProfile } from "@/lib/api";

// Pre-defined options for dropdowns
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];
const MODES = ["In-person", "Video", "In-person & Video"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

// --- UI COMPONENT: Editable Field (Static) ---
const EditableField = ({ 
  label, 
  name, 
  value, 
  type = "text",
  options,
  isEditing,
  onChange
}: { 
  label: string; 
  name: string; 
  value: string; 
  type?: "text" | "select";
  options?: string[];
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => {
  return (
    <div className="group">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {isEditing ? (
        type === "select" && options ? (
          <div className="relative">
            <select
              name={name}
              value={value}
              onChange={onChange}
              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer font-medium text-slate-700"
            >
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-medium text-slate-700 placeholder-slate-400"
          />
        )
      ) : (
        <div className="p-2.5 text-sm font-medium text-slate-800 bg-transparent border border-transparent rounded-lg">
          {value || <span className="text-slate-400 italic">Not set</span>}
        </div>
      )}
    </div>
  );
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Main profile state
  const [profile, setProfile] = useState({
    name: "",
    role: "",
    experience: "",
    status: "Active",
    email: "",
    phone: "",
    gender: "Male",
    location: "",
    department: "",
    hospital: "",
    qualifications: "",
    license: "",
    workingDays: "Monday – Friday",
    time: "09:00 AM – 05:00 PM",
    mode: "In-person & Video",
  });

  // Load Data
  useEffect(() => {
    async function loadData() {
      const data = await getDoctorProfile();
      if (data) {
        setProfile(prev => ({ ...prev, ...data }));
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Save Data
  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await updateDoctorProfile(profile);
    
    if (error) {
        alert("Failed to save profile. Check console for details.");
        console.error(error);
    } else {
        setIsEditing(false);
    }
    setIsSaving(false);
  };

  // Generic Input Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Helper to safely parse ranges
  const getRangeParts = (value: string) => {
    if (!value) return { start: "", end: "" };
    const separatorRegex = /\s?[–-]\s?/;
    const parts = value.split(separatorRegex);
    return { 
        start: parts[0]?.trim() || "", 
        end: parts[1]?.trim() || "" 
    };
  };

  // Range Handler
  const handleRangeChange = (type: "days" | "time", part: "start" | "end", value: string) => {
    setProfile((prev) => {
      const currentVal = type === "days" ? prev.workingDays : prev.time;
      const { start, end } = getRangeParts(currentVal);
      
      const newStart = part === "start" ? value : start;
      const newEnd = part === "end" ? value : end;
      
      return {
        ...prev,
        [type === "days" ? "workingDays" : "time"]: `${newStart} – ${newEnd}`
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <div className="p-1 rounded-md group-hover:bg-blue-50">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          Back to Dashboard
        </Link>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button 
                onClick={() => setIsEditing(true)} 
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:border-blue-300 hover:text-blue-600 hover:shadow-md shadow-sm flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative">
        
        {/* Banner Gradient with Grid Pattern (CSS Only) */}
        <div 
          className="h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 relative"
        >
             <div 
              className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', 
                backgroundSize: '24px 24px' 
              }}
            ></div>
        </div>

        <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                
                {/* Avatar */}
                <div className="-mt-12 relative">
                    <div className="w-28 h-28 rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-100">
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-4xl font-bold text-blue-600 border border-slate-100">
                            {profile.name ? profile.name.charAt(0) : "D"}
                        </div>
                    </div>
                    {/* Status Dot */}
                    <div className="absolute bottom-1 -right-1 flex h-6 w-6">
                        <span className={`relative inline-flex rounded-full h-6 w-6 border-4 border-white ${profile.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                    </div>
                </div>

                {/* Name & Header Info */}
                <div className="flex-1 pt-4 md:pt-2 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{profile.name}</h1>
                            {isEditing ? (
                                <input 
                                    name="role" 
                                    value={profile.role} 
                                    onChange={handleChange} 
                                    className="mt-2 block w-full md:w-80 text-lg font-medium text-slate-600 bg-slate-50 border-b-2 border-blue-500 focus:outline-none px-2 py-1"
                                    placeholder="e.g. Senior Consultant"
                                />
                            ) : (
                                <p className="text-lg font-medium text-slate-500">{profile.role}</p>
                            )}
                        </div>

                        {/* Status Dropdown (Top Right) */}
                        <div className="flex items-center gap-3">
                             <div className="text-right hidden md:block">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Status</p>
                             </div>
                             {isEditing ? (
                                <select 
                                    name="status" 
                                    value={profile.status} 
                                    onChange={handleChange} 
                                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none hover:bg-slate-100"
                                >
                                    <option>Active</option>
                                    <option>Away</option>
                                    <option>Off-Duty</option>
                                </select>
                             ) : (
                                <span className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm ${
                                    profile.status === 'Active' 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full ${profile.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                    {profile.status}
                                </span>
                             )}
                        </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="flex flex-wrap gap-6 mt-6">
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {profile.experience} Experience
                         </div>
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            {profile.hospital || "Main Campus"}
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Personal Information Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500">Contact and basic details</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            <EditableField label="Email Address" name="email" value={profile.email} isEditing={isEditing} onChange={handleChange} />
            <EditableField label="Phone Number" name="phone" value={profile.phone} isEditing={isEditing} onChange={handleChange} />
            
            <EditableField 
              label="Gender" 
              name="gender" 
              value={profile.gender} 
              type="select" 
              options={GENDERS} 
              isEditing={isEditing} 
              onChange={handleChange}
            />
            
            <EditableField label="Location" name="location" value={profile.location} isEditing={isEditing} onChange={handleChange} />
          </div>
        </div>

        {/* Professional Details Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-lg bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
             <div>
                <h2 className="text-lg font-bold text-slate-900">Professional Details</h2>
                <p className="text-xs text-slate-500">Qualifications and affiliations</p>
            </div>
          </div>

          <div className="space-y-6">
            <EditableField label="Department" name="department" value={profile.department} isEditing={isEditing} onChange={handleChange} />
            <EditableField label="Hospital / Clinic" name="hospital" value={profile.hospital} isEditing={isEditing} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-6">
                <EditableField label="Qualifications" name="qualifications" value={profile.qualifications} isEditing={isEditing} onChange={handleChange} />
                <EditableField label="License ID" name="license" value={profile.license} isEditing={isEditing} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Availability & Schedule Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm md:col-span-2">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-lg bg-orange-100 text-orange-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
             <div>
                <h2 className="text-lg font-bold text-slate-900">Availability & Schedule</h2>
                <p className="text-xs text-slate-500">Manage your working hours</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Working Days Range */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Working Days</label>
              {isEditing ? (
                <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <select 
                    value={getRangeParts(profile.workingDays).start}
                    onChange={(e) => handleRangeChange('days', 'start', e.target.value)}
                    className="w-full p-2 text-sm bg-white rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span className="text-slate-400 font-bold px-1">→</span>
                  <select 
                    value={getRangeParts(profile.workingDays).end}
                    onChange={(e) => handleRangeChange('days', 'end', e.target.value)}
                    className="w-full p-2 text-sm bg-white rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-800 font-medium">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {profile.workingDays}
                </div>
              )}
            </div>

            {/* Shift Time Range */}
             <div className="group">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Shift Time</label>
              {isEditing ? (
                <div className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <select 
                    value={getRangeParts(profile.time).start}
                    onChange={(e) => handleRangeChange('time', 'start', e.target.value)}
                    className="w-full p-2 text-sm bg-white rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  >
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="text-slate-400 font-bold px-1">-</span>
                  <select 
                    value={getRangeParts(profile.time).end}
                    onChange={(e) => handleRangeChange('time', 'end', e.target.value)}
                    className="w-full p-2 text-sm bg-white rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                  >
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-800 font-medium">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {profile.time}
                </div>
              )}
            </div>

            {/* Consultation Mode */}
            <EditableField 
              label="Consultation Mode" 
              name="mode" 
              value={profile.mode} 
              type="select" 
              options={MODES} 
              isEditing={isEditing} 
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}