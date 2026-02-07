import React from "react";
import { patients } from "@/data/patients";

type StatProps = {
  value: number | string;
  label: string;
  trend?: string;
  trendColor?: string;
  icon: React.ReactNode;
  iconBg?: string;
};

function StatCard({ value, label, trend, trendColor = "text-emerald-600", icon, iconBg = "bg-slate-50" }: StatProps) {
  return (
    <div className="card p-5 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend && <p className={`text-xs mt-1 font-medium ${trendColor}`}>{trend}</p>}
      </div>
      <div className={`p-2 rounded-lg text-slate-600 ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
}

export default function DashboardStats() {
  const totalPatients = patients.length;
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
  
  // 1. Pending Requests
  const pendingRequests = patients.filter(p => p.appointment?.status === "Pending").length;
  
  // 2. Appointments Today (Confirmed)
  const appointmentsToday = patients.filter(p => {
    if (!p.appointment || p.appointment.status !== "Confirmed") return false;
    const date = new Date(p.appointment.date);
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }).length;

  // 3. Upcoming Appointments (Future Confirmed)
  const upcomingAppointments = patients.filter(p => {
    if (!p.appointment || p.appointment.status !== "Confirmed") return false;
    const date = new Date(p.appointment.date);
    const today = new Date();
    return date > today;
  }).length;

  // 4. Critical Patients
  const criticalPatients = patients.filter(p => p.status === "Critical").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {/* 1. Assigned Patients */}
      <StatCard
        value={totalPatients}
        label="Assigned Patients"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />

      {/* 2. Pending Requests */}
      <StatCard
        value={pendingRequests}
        label="Pending Requests"
        trend={pendingRequests > 0 ? "Action Required" : "All clear"}
        trendColor="text-blue-600"
        iconBg="bg-blue-50 text-blue-600"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        }
      />

      {/* 3. Schedule Today */}
      <StatCard
        value={appointmentsToday}
        label="Schedule Today"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />

       {/* 4. Upcoming Appointments */}
       <StatCard
        value={upcomingAppointments}
        label="Upcoming Appointments"
        trend={`For ${currentMonth}`}
        iconBg="bg-purple-50 text-purple-600"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

       {/* 5. Critical Patients */}
       <StatCard
        value={criticalPatients}
        label="Critical Status"
        trend="Needs attention"
        trendColor="text-rose-600"
        iconBg="bg-rose-50 text-rose-600"
        icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        }
      />
      
      {/* 6. Total Consultations (Static Example) */}
      <StatCard
        value={124}
        label="Total Consultations"
        trend="+12 this month"
        iconBg="bg-emerald-50 text-emerald-600"
        icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        }
      />
    </div>
  );
}