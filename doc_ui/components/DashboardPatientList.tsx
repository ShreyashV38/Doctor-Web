"use client";

import { useState } from "react";
import Link from "next/link";
import { Patient } from "@/lib/api"; 
import PatientCard from "@/components/PatientCard";

type SortOption = "risk" | "name" | "condition";

export default function DashboardPatientList({ patients }: { patients: Patient[] }) {
  const [sortBy, setSortBy] = useState<SortOption>("risk");

  // Sorting Logic
  const sortedPatients = [...patients].sort((a, b) => {
    switch (sortBy) {
      case "risk":
        // Sort by Risk (High first), then by Name
        const riskScore = (r: string) => r === 'High' ? 3 : r === 'Moderate' ? 2 : 1;
        
        // FIX: Removed 'a.risk' and 'b.risk' because they don't exist on the type.
        // We now rely solely on 'risk_level'.
        const scoreA = riskScore(a.risk_level || 'Low');
        const scoreB = riskScore(b.risk_level || 'Low');
        
        if (scoreA !== scoreB) return scoreB - scoreA; // High to Low
        return a.name.localeCompare(b.name);
        
      case "name":
        return a.name.localeCompare(b.name);
        
      case "condition":
        return (a.condition || "").localeCompare(b.condition || "");
        
      default:
        return 0;
    }
  });

  if (patients.length === 0) {
     return (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
           No assigned patients found.
        </div>
     );
  }

  return (
    <div>
      {/* Header with Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Patient Status Queue</h2>
          <p className="text-sm text-slate-500">Live monitoring of assigned patients</p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-slate-600">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-8 py-2 cursor-pointer shadow-sm hover:border-slate-400 transition-colors"
            >
              <option value="risk">⚠ Risk Level (High First)</option>
              <option value="name">Aa Name (A-Z)</option>
              <option value="condition">🏥 Condition</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* The List (Grid of Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
      
      {/* View All Link */}
      <div className="mt-6 text-center">
         <Link href="/patients" className="text-sm text-blue-600 font-medium hover:underline">
            View All Patients
         </Link>
      </div>
    </div>
  );
}