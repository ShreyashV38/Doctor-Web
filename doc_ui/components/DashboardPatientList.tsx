"use client";

import { useState } from "react";
import { Patient } from "@/data/patients";
import PatientCard from "@/components/PatientCard";

type SortOption = "risk" | "name" | "condition";

export default function DashboardPatientList({ patients }: { patients: Patient[] }) {
  const [sortBy, setSortBy] = useState<SortOption>("risk");

  // Sorting Logic
  const sortedPatients = [...patients].sort((a, b) => {
    switch (sortBy) {
      case "risk":
        // Sort by Risk (High first), then by Name
        if (a.risk === b.risk) return a.name.localeCompare(b.name);
        return a.risk === "High" ? -1 : 1;
      case "name":
        return a.name.localeCompare(b.name);
      case "condition":
        return a.condition.localeCompare(b.condition);
      default:
        return 0;
    }
  });

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

      {/* The List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedPatients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}