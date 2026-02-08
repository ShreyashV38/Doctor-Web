"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPatientsFromDB, getAppointmentHistory, Patient } from "@/lib/api";

type TabType = "upcoming" | "pending" | "history";

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  
  // State for data
  const [patients, setPatients] = useState<Patient[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data on Load
  useEffect(() => {
    async function loadData() {
        const [patientsData, historyData] = await Promise.all([
            getPatientsFromDB(),
            getAppointmentHistory()
        ]);
        setPatients(patientsData);
        setHistory(historyData);
        setIsLoading(false);
    }
    loadData();
  }, []);

  // Filter Logic
  const upcomingAppointments = patients
    .filter((p) => p.appointment && p.appointment.status === "Confirmed")
    .sort((a, b) => new Date(a.appointment!.date).getTime() - new Date(b.appointment!.date).getTime());

  const pendingRequests = patients
    .filter((p) => p.appointment && p.appointment.status === "Pending")
    .sort((a, b) => new Date(a.appointment!.date).getTime() - new Date(b.appointment!.date).getTime());

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('en-US', { month: 'short' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isToday: new Date().toDateString() === date.toDateString(),
      fullDate: date.toLocaleDateString('en-GB') 
    };
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule Management</h1>
          <p className="text-slate-500 text-sm">Manage appointments and requests</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === "upcoming" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Upcoming
            <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
              {upcomingAppointments.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === "pending" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Pending Requests
            {pendingRequests.length > 0 && (
              <span className="ml-2 bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-xs animate-pulse">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === "history" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            History
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-4">
        
        {/* === UPCOMING === */}
        {activeTab === "upcoming" && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] divide-y divide-slate-100">
            {upcomingAppointments.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No confirmed appointments coming up.</div>
            ) : (
              upcomingAppointments.map((patient) => {
                const { day, month, time, isToday } = formatDate(patient.appointment!.date);
                return (
                  <div key={patient.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                        <span className="text-xs font-bold uppercase">{month}</span>
                        <span className="text-xl font-bold">{day}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-slate-900">{patient.name}</h3>
                          {isToday && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">Today</span>}
                        </div>
                        <p className="text-slate-500 text-sm">{time} • {patient.appointment?.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/consultation/${patient.id}`} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">Start Call</Link>
                      <Link href={`/patients/${patient.id}`} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50">Details</Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* === PENDING === */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
               <div className="p-12 text-center border border-dashed border-slate-300 rounded-xl text-slate-500">
                 No pending requests.
               </div>
            ) : (
              pendingRequests.map((patient) => {
                const { fullDate, time } = formatDate(patient.appointment!.date);
                return (
                  <div key={patient.id} className="bg-white border-l-4 border-l-amber-400 border border-slate-200 p-6 rounded-r-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                        <p className="text-sm text-slate-600">Request: <span className="font-medium">{patient.appointment?.type}</span></p>
                        <p className="text-xs text-amber-700 mt-1 font-medium">
                          Proposed: {fullDate} at {time}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">Accept Request</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* === HISTORY === */}
        {activeTab === "history" && (
           <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
             <table className="w-full text-left text-sm text-slate-600">
               <thead className="bg-slate-100 text-slate-900 font-semibold">
                 <tr>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4">Patient</th>
                   <th className="px-6 py-4">Type</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Review</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                 {history.length === 0 ? (
                     <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500">No history found.</td></tr>
                 ) : (
                    history.map((item) => {
                        const { fullDate, time } = formatDate(item.date);
                        return (
                        <tr key={item.id} className="hover:bg-slate-100/50">
                            <td className="px-6 py-4">
                            <p className="font-medium text-slate-900">{fullDate}</p>
                            <p className="text-xs text-slate-500">{time}</p>
                            </td>
                            <td className="px-6 py-4 font-medium">{item.name}</td>
                            <td className="px-6 py-4">{item.type}</td>
                            <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-600">
                                {item.status}
                            </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                            <Link href={`/patients/${item.patientId}`} className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                                View Notes
                            </Link>
                            </td>
                        </tr>
                        );
                    })
                 )}
               </tbody>
             </table>
           </div>
        )}
      </div>
    </div>
  );
}