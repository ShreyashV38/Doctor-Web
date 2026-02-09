"use client";

import { useState, useEffect } from "react";
import { 
  getPatientsFromDB, 
  getPendingAppointments, 
  getAppointmentHistory,
  getUpcomingAppointments, // <--- IMPORT THIS
  updateAppointmentStatus, 
  rescheduleAppointment 
} from "@/lib/api";

type TabType = "upcoming" | "pending" | "history";

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  
  // State
  const [upcoming, setUpcoming] = useState<any[]>([]); // <--- Changed to any[] to match new structure
  const [pending, setPending] = useState<any[]>([]); 
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reschedule Modal State
  const [isRescheduling, setIsRescheduling] = useState<string | null>(null);
  const [rescheduleType, setRescheduleType] = useState<'pending' | 'confirmed'>('pending');
  const [newDate, setNewDate] = useState("");

  // Load Data
  async function loadData() {
    setIsLoading(true);
    try {
        const [upcomingData, pendingData, historyData] = await Promise.all([
            getUpcomingAppointments(),  // <--- FETCH DIRECTLY (Fixes the issue)
            getPendingAppointments(),   
            getAppointmentHistory()     
        ]);

        setUpcoming(upcomingData);
        setPending(pendingData);
        setHistory(historyData);
    } catch (error) {
        console.error("Failed to load schedule:", error);
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ... (Keep your existing Actions: handleAccept, handleDecline, etc. SAME AS BEFORE)
  const handleAccept = async (appointmentId: string) => {
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

    const newStatus = rescheduleType === 'confirmed' ? 'Confirmed' : 'Pending';
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
    } else {
        alert("Failed to reschedule.");
    }
  };

  // Helper to force IST
  const formatDate = (dateString: string) => {
    if (!dateString) return { day: '--', month: '--', time: '--', isToday: false, fullDate: '--' };
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', hour12: true };
    
    const day = new Intl.DateTimeFormat('en-US', { ...options, day: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en-US', { ...options, month: 'short' }).format(date);
    const time = new Intl.DateTimeFormat('en-US', { ...options, hour: 'numeric', minute: '2-digit' }).format(date);
    const fullDate = new Intl.DateTimeFormat('en-GB', { ...options }).format(date); 

    const now = new Date();
    const istNowStr = new Intl.DateTimeFormat('en-IN', options).format(now);
    const istDateStr = new Intl.DateTimeFormat('en-IN', options).format(date);

    return { day, month, time, isToday: istNowStr === istDateStr, fullDate };
  };

  if (isLoading) {
    return (
        <div className="flex h-96 items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
    <div className="space-y-6 relative pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule Management</h1>
          <p className="text-slate-500 text-sm">Manage appointments and requests</p>
        </div>
        <button onClick={loadData} className="text-sm text-blue-600 hover:underline font-medium">
            Refresh Data
        </button>
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
              {upcoming.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === "pending" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Pending Requests
            {pending.length > 0 && (
              <span className="ml-2 bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-xs animate-pulse">
                {pending.length}
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
        
        {/* === UPCOMING (Updated to match direct structure) === */}
        {activeTab === "upcoming" && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100">
            {upcoming.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No confirmed appointments coming up.</div>
            ) : (
              upcoming.map((appt) => {
                const { day, month, time, isToday } = formatDate(appt.date);
                return (
                  <div key={appt.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                        <span className="text-xs font-bold uppercase">{month}</span>
                        <span className="text-xl font-bold">{day}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-slate-900">{appt.patientName || "Unknown"}</h3>
                          {isToday && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">Today</span>}
                        </div>
                        <p className="text-slate-500 text-sm">{time} • {appt.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => openRescheduleModal(appt.id, 'confirmed')}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50"
                      >
                        Reschedule
                      </button>
                      
                      {/* Only show 'Start Call' if it's a Video Consultation */}
                      {appt.type === 'Video Consultation' && (
                         <a href={`/consultation/${appt.id}`} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700">
                           Start Call
                         </a>
                      )}
                      
                      <a href={`/patients/${appt.patientId}`} className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200">
                        Details
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ... (Keep PENDING and HISTORY sections exactly as they were in the previous corrected code) ... */}
        {/* === PENDING === */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pending.length === 0 ? (
               <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
                 No pending requests.
               </div>
            ) : (
              pending.map((req) => {
                const { fullDate, time } = formatDate(req.date);
                return (
                  <div key={req.id} className="bg-white border-l-4 border-l-amber-400 border border-slate-200 p-6 rounded-r-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
                        {req.patientName ? req.patientName.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{req.patientName || "Unknown Patient"}</h3>
                        <p className="text-sm text-slate-600">Request: <span className="font-medium">{req.type}</span></p>
                        <p className="text-xs text-amber-700 mt-1 font-medium bg-amber-50 inline-block px-2 py-0.5 rounded">
                          Proposed: {fullDate} at {time}
                        </p>
                        {req.notes && <p className="text-xs text-slate-500 mt-2 italic">"{req.notes}"</p>}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                          onClick={() => openRescheduleModal(req.id, 'pending')}
                          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                        >
                          Reschedule
                        </button>
                        <button 
                          onClick={() => handleAccept(req.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleDecline(req.id)}
                          className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                        >
                          Decline
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
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                 {history.length === 0 ? (
                     <tr><td colSpan={4} className="px-6 py-4 text-center text-slate-500">No history found.</td></tr>
                 ) : (
                    history.map((item) => {
                        const { fullDate, time } = formatDate(item.date);
                        return (
                        <tr key={item.id} className="hover:bg-slate-100/50">
                            <td className="px-6 py-4">
                            <p className="font-medium text-slate-900">{fullDate}</p>
                            <p className="text-xs text-slate-500">{time}</p>
                            </td>
                            <td className="px-6 py-4 font-medium">{item.name || item.patientName}</td>
                            <td className="px-6 py-4">{item.type}</td>
                            <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                                item.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                'bg-slate-200 text-slate-600'
                            }`}>
                                {item.status}
                            </span>
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

      {/* === RESCHEDULE MODAL (Same as before) === */}
      {isRescheduling && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Reschedule Appointment</h3>
                <p className="text-sm text-slate-500 mb-4">
                    {rescheduleType === 'confirmed' ? "Moving a confirmed appointment." : "Propose a new time for this request."}
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm"
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