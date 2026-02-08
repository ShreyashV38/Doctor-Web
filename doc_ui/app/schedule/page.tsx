"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  getPatientsFromDB, 
  getAppointmentHistory, 
  updateAppointmentStatus, 
  rescheduleAppointment,
  Patient 
} from "@/lib/api";

type TabType = "upcoming" | "pending" | "history";

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reschedule Modal State
  const [isRescheduling, setIsRescheduling] = useState<string | null>(null);
  const [rescheduleType, setRescheduleType] = useState<'pending' | 'confirmed'>('pending');
  const [newDate, setNewDate] = useState("");

  // Load Data
  async function loadData() {
    setIsLoading(true);
    const [patientsData, historyData] = await Promise.all([
        getPatientsFromDB(),
        getAppointmentHistory()
    ]);
    setPatients(patientsData);
    setHistory(historyData);
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // --- ACTIONS ---

  const handleAccept = async (appointmentId: string) => {
    if (!confirm("Confirm this appointment?")) return;
    
    const { success } = await updateAppointmentStatus(appointmentId, "Confirmed");
    if (success) {
        loadData(); 
        setActiveTab("upcoming");
    } else {
        alert("Failed to accept request.");
    }
  };

  const handleDecline = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to decline this request?")) return;

    const { success } = await updateAppointmentStatus(appointmentId, "Cancelled");
    if (success) loadData();
  };

  const openRescheduleModal = (id: string, type: 'pending' | 'confirmed') => {
    setIsRescheduling(id);
    setRescheduleType(type);
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRescheduling || !newDate) return;

    // If it's already confirmed, keep it Confirmed. If it was pending, keep it Pending.
    const newStatus = rescheduleType === 'confirmed' ? 'Confirmed' : 'Pending';

    // Convert local input time to UTC before saving
    const dateToSave = new Date(newDate).toISOString();

    const { success } = await rescheduleAppointment(
        isRescheduling, 
        dateToSave,
        newStatus
    );

    if (success) {
        setIsRescheduling(null);
        setNewDate("");
        loadData();
        alert("Appointment rescheduled successfully.");
    } else {
        alert("Failed to reschedule.");
    }
  };

  // --- FILTERING ---

  const upcomingAppointments = patients
    .filter((p) => p.appointment && p.appointment.status === "Confirmed")
    .sort((a, b) => new Date(a.appointment!.date).getTime() - new Date(b.appointment!.date).getTime());

  const pendingRequests = patients
    .filter((p) => p.appointment && p.appointment.status === "Pending")
    .sort((a, b) => new Date(a.appointment!.date).getTime() - new Date(b.appointment!.date).getTime());

  // Helper to force IST (Indian Standard Time)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Define options for IST
    const options: Intl.DateTimeFormatOptions = { 
        timeZone: 'Asia/Kolkata',
        hour12: true 
    };
    
    // Extract parts using Intl to ensure IST
    const day = new Intl.DateTimeFormat('en-US', { ...options, day: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en-US', { ...options, month: 'short' }).format(date);
    const time = new Intl.DateTimeFormat('en-US', { ...options, hour: 'numeric', minute: '2-digit' }).format(date);
    const fullDate = new Intl.DateTimeFormat('en-GB', { ...options }).format(date); // DD/MM/YYYY

    // Check if "Today" in IST
    const now = new Date();
    const istNowStr = new Intl.DateTimeFormat('en-IN', options).format(now);
    const istDateStr = new Intl.DateTimeFormat('en-IN', options).format(date);

    return {
      day,
      month,
      time,
      isToday: istNowStr === istDateStr,
      fullDate
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
    <div className="space-y-6 relative">
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
                      <button 
                        onClick={() => openRescheduleModal(patient.appointment?.id || "", 'confirmed')}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50"
                      >
                        Reschedule
                      </button>
                      
                      <Link href={`/consultation/${patient.id}`} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">Start Call</Link>
                      <Link href={`/patients/${patient.id}`} className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200">Details</Link>
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
                        {patient.appointment?.notes && <p className="text-xs text-slate-500 mt-1">"{patient.appointment.notes}"</p>}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => openRescheduleModal(patient.appointment?.id || "", 'pending')}
                         className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                       >
                         Reschedule
                       </button>
                       <button 
                         onClick={() => handleAccept(patient.appointment?.id || "")}
                         className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
                       >
                         Accept
                       </button>
                       <button 
                         onClick={() => handleDecline(patient.appointment?.id || "")}
                         className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                       >
                         ✕
                       </button>
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

      {/* === RESCHEDULE MODAL === */}
      {isRescheduling && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Reschedule Appointment</h3>
                <p className="text-sm text-slate-500 mb-4">
                    {rescheduleType === 'confirmed' ? "This appointment is currently confirmed. Moving it will keep it confirmed." : "Propose a new time for this request."}
                </p>
                <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Date & Time</label>
                        <input 
                            type="datetime-local" 
                            required
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={() => { setIsRescheduling(null); setNewDate(""); }}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                            Confirm New Time
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}