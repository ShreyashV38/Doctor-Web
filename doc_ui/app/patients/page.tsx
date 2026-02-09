"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPatientsFromDB, Patient } from "@/lib/api";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getPatientsFromDB();
      setPatients(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">My Patients</h1>
           <p className="text-slate-500 text-sm">Patients assigned to your care</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Risk</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        No patients found.
                    </td>
                </tr>
              ) : (
                patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {patient.name.charAt(0)}
                        </div>
                        {patient.name}
                        </div>
                    </td>
                    <td className="px-6 py-4">{patient.condition}</td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            patient.status === 'Critical' ? 'bg-red-100 text-red-800' :
                            patient.status === 'Recovered' ? 'bg-green-100 text-green-800' :
                            'bg-blue-50 text-blue-700'
                        }`}>
                        {patient.status}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            patient.risk_level === "High"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                        >
                        {patient.risk_level}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <Link
                        href={`/patients/${patient.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs uppercase tracking-wide"
                        >
                        View Profile
                        </Link>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}