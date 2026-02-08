"use client";

import { useState, useEffect } from "react";

export default function AppointmentRequests({ requests }: { requests?: any[] }) {
  // If requests is undefined or empty, hide the section
  if (!requests || requests.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
        New Appointment Requests
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((req) => (
          <div key={req.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50/50">
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h4 className="font-bold text-slate-900">{req.patientName}</h4>
                 <p className="text-xs text-slate-500">{new Date(req.date).toLocaleString()}</p>
               </div>
               <span className="text-xs font-medium bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">
                 {req.type}
               </span>
             </div>
             {req.notes && <p className="text-xs text-slate-600 mb-4 line-clamp-1">"{req.notes}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
}