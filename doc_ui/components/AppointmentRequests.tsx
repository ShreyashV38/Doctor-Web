"use client";

import { useState } from "react";
import { patients as initialPatients } from "@/data/patients";

export default function AppointmentRequests() {
  // Local state to simulate accepting requests in the UI
  const [requests, setRequests] = useState(
    initialPatients.filter((p) => p.appointment?.status === "Pending")
  );

  const handleAccept = (id: string) => {
    // In a real app, this would call an API
    alert(`Appointment Confirmed for patient ID: ${id}`);
    setRequests((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReschedule = (id: string) => {
    alert(`Opening calendar to reschedule patient ID: ${id}`);
  };

  if (requests.length === 0) return null;

  return (
    <div className="card p-6 mb-8 border-l-4 border-l-blue-600">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
        Pending Appointment Requests
      </h2>
      
      <div className="space-y-4">
        {requests.map((patient) => {
          const date = new Date(patient.appointment!.date);
          return (
            <div key={patient.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 gap-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold shadow-sm">
                    {patient.name.charAt(0)}
                 </div>
                 <div>
                    <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                    <p className="text-sm text-slate-500">
                        Requesting: <span className="font-medium text-slate-700">{patient.appointment?.type}</span>
                    </p>
                    <p 
                      className="text-xs text-blue-600 font-medium mt-0.5"
                      suppressHydrationWarning
                    >
                       {/* UPDATED: Uses 'en-GB' for dd/mm/yyyy format */}
                       {date.toLocaleDateString('en-GB')} at {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => handleReschedule(patient.id)}
                   className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                 >
                   Reschedule
                 </button>
                 <button 
                   onClick={() => handleAccept(patient.id)}
                   className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm"
                 >
                   Accept & Confirm
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}