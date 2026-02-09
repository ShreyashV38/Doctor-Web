"use client";

import { Activity, BrainCircuit } from "lucide-react"; // Added BrainCircuit icon for AI

export default function RecentCheckIns({ checkIns }: { checkIns: any[] }) {
  if (checkIns.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
        <p className="text-slate-500 text-sm text-center py-4">No recent symptom logs.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Patient Updates</h3>
        <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">Live Feed</span>
      </div>
      
      <div className="space-y-6">
        {checkIns.map((log) => {
          const date = new Date(log.timestamp);
          const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isToday = date.toDateString() === new Date().toDateString();

          // Risk Logic (from AI or Pain Level)
          const risk = log.riskLevel || (log.painLevel >= 8 ? 'High' : log.painLevel >= 5 ? 'Moderate' : 'Low');
          const riskColor = 
             risk === 'High' ? 'bg-red-100 text-red-700 border-red-200' : 
             risk === 'Moderate' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
             'bg-emerald-100 text-emerald-700 border-emerald-200';

          return (
            <div key={log.id} className="relative pl-6 border-l-2 border-slate-100 last:border-0 pb-2">
              {/* Timeline Dot */}
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                 risk === 'High' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>

              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                   <span className="font-bold text-slate-900 text-sm">{log.patientName}</span>
                   <span className={`text-[10px] px-1.5 py-0.5 rounded border ${riskColor} font-bold uppercase`}>
                      {risk}
                   </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {isToday ? timeStr : date.toLocaleDateString()}
                </span>
              </div>

              <div className="mb-2">
                 <p className="text-xs text-slate-500">
                    reported <span className="font-medium text-slate-700">{log.symptom}</span> 
                    &nbsp;with pain level <span className="font-bold">{log.painLevel}/10</span>.
                 </p>
              </div>

              {/* AI Explanation Box */}
              {log.aiExplanation && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-2 flex gap-3">
                   <BrainCircuit className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                   <div>
                      <p className="text-[10px] font-bold text-purple-700 uppercase mb-0.5">AI Analysis</p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {log.aiExplanation}
                      </p>
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}