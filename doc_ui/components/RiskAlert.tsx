"use client";

import { AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Patient } from "@/lib/api"; // Import the type

interface RiskAlertProps {
  patients: Patient[];
}

export default function RiskAlert({ patients }: RiskAlertProps) {
  if (patients.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-100 rounded-lg text-red-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-red-900">High Risk Alerts</h3>
          <p className="text-sm text-red-700">
            {patients.length} patient{patients.length > 1 ? 's' : ''} require immediate attention.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white p-4 rounded-lg border border-red-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img 
                src={patient.avatar} 
                alt={patient.name} 
                className="w-10 h-10 rounded-full object-cover" 
              />
              <div>
                <p className="font-bold text-slate-900">{patient.name}</p>
                <p className="text-xs text-red-600 font-medium">Condition: {patient.condition}</p>
              </div>
            </div>
            <Link 
              href={`/patients/${patient.id}`}
              className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
            >
              View <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}