"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPatientById, Patient } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import PainChart from "@/components/PainChart";
import RecentCheckIns from "@/components/RecentCheckIns";
import DoctorNotes from "@/components/DoctorNotes";

export default function PatientProfile() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getPatientById(id);
      if (!data) {
        // If data is null, it might be a 404 or auth issue
        // For now, let's just stop loading. You could redirect to 404 here.
        setLoading(false); 
        return;
      }
      setPatient(data);
      setLoading(false);
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Patient Profile...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Patient Not Found</h1>
        <p className="text-slate-500">The patient you are looking for does not exist or you do not have permission to view them.</p>
        <Link href="/patients" className="text-blue-600 hover:underline">Return to Patient List</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/patients" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
             ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
            <p className="text-slate-500 text-sm">Patient ID: <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{patient.id.slice(0, 8)}</span></p>
          </div>
        </div>
        <div className="flex gap-3">
            <Link 
                href={`/consultation/${patient.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Start Consultation
            </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Condition</p>
            <p className="text-lg font-bold text-slate-900 mt-1 truncate">{patient.condition}</p>
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</p>
            <span className={`inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                patient.status === 'Critical' ? 'bg-red-100 text-red-700' :
                patient.status === 'Recovered' ? 'bg-green-100 text-green-700' :
                'bg-blue-100 text-blue-700'
            }`}>
                {patient.status}
            </span>
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Risk Level</p>
            <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${patient.risk === 'High' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                <p className={`text-lg font-bold ${patient.risk === 'High' ? 'text-red-600' : 'text-slate-900'}`}>
                    {patient.risk}
                </p>
            </div>
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Age</p>
            <p className="text-lg font-bold text-slate-900 mt-1">{patient.age} <span className="text-sm text-slate-500 font-normal">Years</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
            <PainChart data={patient.painTrend} />
            <RecentCheckIns checkIns={patient.checkIns} />
        </div>

        {/* Right Column: Info & Actions */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Next Appointment
                </h3>
                {patient.appointment ? (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-blue-900 text-lg">
                                {new Date(patient.appointment.date).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    day: 'numeric', 
                                    month: 'short',
                                    timeZone: 'Asia/Kolkata' 
                                })}
                            </p>
                            <span className="px-2 py-1 bg-white text-blue-600 text-[10px] font-bold uppercase tracking-wide rounded border border-blue-100">
                                {patient.appointment.status}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-700 mb-1">
                            {new Date(patient.appointment.date).toLocaleTimeString('en-US', {
                                hour: '2-digit', 
                                minute:'2-digit',
                                timeZone: 'Asia/Kolkata'
                            })}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-blue-600/80 text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            {patient.appointment.type}
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-sm text-slate-500 font-medium">No upcoming appointments.</p>
                        <button className="mt-3 text-blue-600 text-xs font-bold hover:underline">Schedule Now</button>
                    </div>
                )}
            </div>
            
            {/* Doctor's Notes Component */}
            <DoctorNotes patientId={patient.id}/>
        </div>
      </div>
    </div>
  );
}