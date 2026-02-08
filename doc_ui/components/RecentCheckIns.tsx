export default function RecentCheckIns({ checkIns }: { checkIns: any[] }) {
  if (!checkIns || checkIns.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500">
        <h3 className="font-bold text-slate-900 mb-2">Recent Check-ins</h3>
        <p className="text-sm">No recent check-ins found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4">Recent Check-ins</h3>
      <div className="space-y-6">
        {checkIns.map((checkIn, index) => (
          <div key={index} className="relative pl-6 border-l-2 border-slate-100 last:border-0 pb-1">
            <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                checkIn.painLevel >= 8 ? "bg-red-500" : 
                checkIn.painLevel >= 5 ? "bg-amber-500" : "bg-emerald-500"
            }`}></div>
            
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-semibold text-slate-900">{checkIn.date}</span>
              <span className="text-xs text-slate-400">{checkIn.time}</span>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
               <span className="text-xs font-bold uppercase text-slate-500">Pain:</span>
               <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                   checkIn.painLevel >= 8 ? "bg-red-100 text-red-700" : 
                   checkIn.painLevel >= 5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
               }`}>
                  {checkIn.painLevel}/10
               </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              "{checkIn.note}"
            </p>
            
            {checkIn.symptoms && checkIn.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {checkIn.symptoms.map((s: string, i: number) => (
                        <span key={i} className="text-[10px] font-medium bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wide">
                            {s.trim()}
                        </span>
                    ))}
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}