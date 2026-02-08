"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPatientsFromDB, Patient } from "@/lib/api";

export default function ConsultationListPage() {
  const [upcoming, setUpcoming] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Fetch all patients and filter for confirmed appointments
      const patients = await getPatientsFromDB();
      const confirmed = patients.filter(
        p => p.appointment && p.appointment.status === "Confirmed"
      );
      setUpcoming(confirmed);
      setIsLoading(false);
    }
    loadData();
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
          <h1 className="text-2xl font-bold text-slate-900">Consultation Room</h1>
          <p className="text-slate-500 text-sm">Select a patient to start a remote session</p>
        </div>
      </div>

      {upcoming.length === 0 ? (
         <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Upcoming Consultations</h3>
            <p className="text-slate-500 mt-2">You don't have any confirmed appointments right now.</p>
            <Link href="/schedule" className="inline-block mt-4 text-blue-600 font-medium hover:underline">
                Check Schedule &rarr;
            </Link>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((patient) => (
            <div key={patient.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                   {patient.name.charAt(0)}
                </div>
                <div>
                   <h3 className="font-bold text-slate-900">{patient.name}</h3>
                   <p className="text-xs text-slate-500">{patient.condition}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-3 mb-6 border border-slate-100">
                 <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-slate-500">Scheduled:</span>
                    <span className="font-semibold text-slate-900">
                        {new Date(patient.appointment!.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Type:</span>
                    <span className="font-medium text-blue-600">{patient.appointment!.type}</span>
                 </div>
              </div>

              <Link 
                href={`/consultation/${patient.id}`}
                className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                Join Video Call
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}