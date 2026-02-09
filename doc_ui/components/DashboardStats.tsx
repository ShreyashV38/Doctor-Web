"use client";

import { Users, AlertTriangle, Calendar, Activity } from "lucide-react";

interface DashboardStatsProps {
  totalPatients: number;
  criticalPatients: number;
  appointmentsToday: number;
  activeNow: number;
}

export default function DashboardStats({ 
  totalPatients, 
  criticalPatients, 
  appointmentsToday, 
  activeNow 
}: DashboardStatsProps) {
  
  const stats = [
    {
      title: "Total Patients",
      value: totalPatients,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Critical Risk",
      value: criticalPatients,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Appointments Today",
      value: appointmentsToday,
      icon: Calendar,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Active Now",
      value: activeNow,
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </div>
          <div className={`p-3 rounded-lg ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}