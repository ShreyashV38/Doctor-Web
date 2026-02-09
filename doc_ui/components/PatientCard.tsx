"use client";

import { Activity, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { Patient } from "@/lib/api";
import PainChart from "./PainChart"; // Assuming you have this component

export default function PatientCard({ patient }: { patient: Patient }) {
  const riskColor = 
    patient.risk_level === "High" ? "bg-red-50 text-red-700 border-red-100" :
    patient.risk_level === "Moderate" ? "bg-amber-50 text-amber-700 border-amber-100" :
    "bg-emerald-50 text-emerald-700 border-emerald-100";

  const trendIcon = 
    patient.trend === 'up' ? <TrendingUp className="w-4 h-4 text-red-500" /> :
    patient.trend === 'down' ? <TrendingDown className="w-4 h-4 text-emerald-500" /> :
    <Minus className="w-4 h-4 text-slate-400" />;

  // Default to empty array if painTrend is missing
  const chartData = patient.painTrend || [0, 0, 0, 0, 0, 0, 0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      
      {/* Top Row: User Info & Risk Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
             <img 
               src={patient.avatar || `https://ui-avatars.com/api/?name=${patient.name}&background=random`} 
               alt={patient.name} 
               className="w-12 h-12 rounded-full object-cover border border-slate-100"
             />
             <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                patient.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'
             }`}></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">{patient.name}</h3>
            <p className="text-xs text-slate-500">{patient.condition}</p>
          </div>
        </div>
        
        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${riskColor}`}>
          <Activity className="w-3 h-3" />
          {patient.risk_level} Risk
        </div>
      </div>

      {/* Middle Row: Mini Chart & Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
           <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Pain Trend (7d)</p>
           <div className="h-8 w-full">
              {/* Simple Sparkline or Bar Chart */}
              <div className="flex items-end justify-between h-full gap-1">
                 {chartData.map((val, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${(val / 10) * 100}%` }} 
                      className={`w-full rounded-sm ${val >= 7 ? 'bg-red-400' : 'bg-blue-300'}`}
                    ></div>
                 ))}
              </div>
           </div>
        </div>

        <div className="flex flex-col justify-center gap-1">
           <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Status</span>
              <span className="font-semibold text-slate-700">{patient.status}</span>
           </div>
           <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Trend</span>
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                 {trendIcon}
                 <span className="capitalize">{patient.trend}</span>
              </div>
           </div>
           <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Age</span>
              <span className="font-semibold text-slate-700">{patient.age} yrs</span>
           </div>
        </div>
      </div>

      {/* Bottom: Action Button */}
      <Link 
        href={`/patients/${patient.id}`}
        className="block w-full py-2.5 text-center bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 text-sm font-bold rounded-lg transition-all group-hover:bg-blue-50"
      >
        View Detailed Profile
      </Link>
    </div>
  );
}