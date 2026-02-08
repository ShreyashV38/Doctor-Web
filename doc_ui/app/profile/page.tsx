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

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Main profile state (Initialized Empty)
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

  // Load Data from Supabase
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

  // Save Data to Supabase
  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await updateDoctorProfile(profile);
    
    if (error) {
        alert("Failed to save profile.");
        console.error(error);
    } else {
        setIsEditing(false);
    }
    setIsSaving(false);
  };

  // Generic handler for simple text/select inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Special handler for "From - To" range fields (Days & Time)
  const handleRangeChange = (type: "days" | "time", part: "start" | "end", value: string) => {
    setProfile((prev) => {
      const currentVal = type === "days" ? prev.workingDays : prev.time;
      const separator = " – "; // Note: using en-dash for display
      const [start, end] = currentVal.includes(separator) ? currentVal.split(separator) : [currentVal, ""];
      
      const newStart = part === "start" ? value : start;
      const newEnd = part === "end" ? value : end;
      
      return {
        ...prev,
        [type === "days" ? "workingDays" : "time"]: `${newStart}${separator}${newEnd}`
      };
    });
  };

  // Helper to safely parse ranges
  const getRangeParts = (value: string) => {
    const separator = " – ";
    const parts = value.split(separator);
    return { start: parts[0] || "", end: parts[1] || "" };
  };

  // Reusable Field Component
  const EditableField = ({ 
    label, 
    name, 
    value, 
    type = "text",
    options
  }: { 
    label: string; 
    name: string; 
    value: string; 
    type?: "text" | "select";
    options?: string[];
  }) => {
    return (
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
        {isEditing ? (
          type === "select" && options ? (
            <div className="relative">
              <select
                name={name}
                value={value}
                onChange={handleChange}
                className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer"
              >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={handleChange}
              className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          )
        ) : (
          <p className="text-sm font-medium text-slate-900 py-2.5 border border-transparent">
            {value || "-"}
          </p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)} 
                className="btn-secondary text-slate-600"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="btn-primary"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button 
                onClick={() => setIsEditing(true)} 
                className="btn-secondary text-blue-600 border-blue-200 hover:bg-blue-50"
            >
                Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold border-4 border-white shadow-sm ring-1 ring-slate-100">
            {profile.name ? profile.name.charAt(0) : "U"}
          </div>
          <div className="flex-1">
            {/* NAME IS NOT EDITABLE */}
            <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
            
            {isEditing ? (
              <div className="mt-2 space-y-2">
                 <input 
                  name="role" 
                  value={profile.role} 
                  onChange={handleChange} 
                  className="block w-full text-slate-600 border-b border-slate-300 focus:border-blue-500 outline-none bg-transparent text-sm pb-1"
                  placeholder="Role / Title"
                />
              </div>
            ) : (
              <p className="text-slate-600">{profile.role}</p>
            )}
            
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {profile.experience}
            </div>
          </div>
        </div>

        <div className="flex items-start">
           {isEditing ? (
              <select 
                name="status" 
                value={profile.status} 
                onChange={handleChange} 
                className="px-3 py-1 rounded-full text-sm font-medium bg-slate-50 border border-slate-300 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                  <option>Active</option>
                  <option>Away</option>
                  <option>Off-Duty</option>
              </select>
           ) : (
             <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-slate-100 text-slate-600'}`}>
                {profile.status}
             </span>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            <EditableField label="Email Address" name="email" value={profile.email} />
            <EditableField label="Phone Number" name="phone" value={profile.phone} />
            
            {/* Gender Dropdown */}
            <EditableField 
              label="Gender" 
              name="gender" 
              value={profile.gender} 
              type="select" 
              options={GENDERS} 
            />
            
            <EditableField label="Location" name="location" value={profile.location} />
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Professional Details
          </h2>
          <div className="space-y-6">
            <EditableField label="Department" name="department" value={profile.department} />
            <EditableField label="Hospital / Clinic" name="hospital" value={profile.hospital} />
            <div className="grid grid-cols-2 gap-4">
                <EditableField label="Qualifications" name="qualifications" value={profile.qualifications} />
                <EditableField label="License ID" name="license" value={profile.license} />
            </div>
          </div>
        </div>

        {/* Availability & Schedule - NEW DROPDOWN LOGIC */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm md:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Availability & Schedule
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Working Days Range */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Working Days</label>
              {isEditing ? (
                <div className="flex gap-2 items-center">
                  <select 
                    value={getRangeParts(profile.workingDays).start}
                    onChange={(e) => handleRangeChange('days', 'start', e.target.value)}
                    className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span className="text-slate-400 text-sm">to</span>
                  <select 
                    value={getRangeParts(profile.workingDays).end}
                    onChange={(e) => handleRangeChange('days', 'end', e.target.value)}
                    className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-900 py-2.5">{profile.workingDays}</p>
              )}
            </div>

            {/* Shift Time Range */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Shift Time</label>
              {isEditing ? (
                <div className="flex gap-2 items-center">
                  <select 
                    value={getRangeParts(profile.time).start}
                    onChange={(e) => handleRangeChange('time', 'start', e.target.value)}
                    className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="text-slate-400 text-sm">-</span>
                  <select 
                    value={getRangeParts(profile.time).end}
                    onChange={(e) => handleRangeChange('time', 'end', e.target.value)}
                    className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-900 py-2.5">{profile.time}</p>
              )}
            </div>

            {/* Consultation Mode Dropdown */}
            <EditableField 
              label="Consultation Mode" 
              name="mode" 
              value={profile.mode} 
              type="select" 
              options={MODES} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}