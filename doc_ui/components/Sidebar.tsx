"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// 1. Mock Data (Replace this with your real DB fetch or Auth hook later)
const user = {
  name: "Dr. James Wilson",
  role: "Pain Specialist",
  image: null, // Set to a URL string if they have a photo
};

// 2. Smart helper to generate initials (Ignores "Dr." prefix)
const getInitials = (name: string) => {
  // Remove titles like "Dr." or "Mr." and extra spaces
  const cleanName = name.replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, "").trim();
  
  const parts = cleanName.split(" ");
  
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  // Take first letter of first name + first letter of last name
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const getLinkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive(path)
        ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  // Calculate initials
  const initials = getInitials(user.name);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-10 hidden md:flex flex-col">
      {/* Branding */}
      <div className="h-48 flex items-center justify-center border-b border-slate-100 bg-slate-50/50 p-6 relative">
        <Link href="/dashboard" className="relative w-full h-full">
          {/* Ensure logo.png is in your public/ folder */}
          <Image
            src="/logo.png"
            alt="SymptoTrack"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 256px"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link href="/dashboard" className={getLinkClass("/dashboard")}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </Link>
        <Link href="/patients" className={getLinkClass("/patients")}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Patients
        </Link>
        <Link href="/schedule" className={getLinkClass("/schedule")}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Schedule
        </Link>
      </nav>

      {/* User Profile Snippet */}
      <div className="p-4 border-t border-slate-200">
        <Link 
          href="/profile" 
          className="flex items-center justify-between w-full p-2 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            {/* Dynamic Avatar */}
            {user.image ? (
               <Image src={user.image} alt={user.name} width={36} height={36} className="rounded-full" />
            ) : (
               <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 {initials}
               </div>
            )}
            
            <div className="text-left">
              <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">
                {user.role}
              </p>
            </div>
          </div>
          {/* Chevron Icon */}
          <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}