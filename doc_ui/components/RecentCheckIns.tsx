"use client";

type CheckIn = {
  date: string;
  painLevel: number;
  symptoms: string[];
  note: string;
  risk: string;
};

export default function RecentCheckIns({ checkIns }: { checkIns: CheckIn[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-bold text-slate-900 mb-4">Recent Check-ins</h3>
      <div className="space-y-4">
        {checkIns.length === 0 ? (
            <p className="text-slate-500 text-sm">No recent check-ins recorded.</p>
        ) : (
            checkIns.map((checkIn, index) => (
            <div key={index} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {checkIn.date}
                    </span>
                    <div className="flex gap-2 mt-1">
                    {checkIn.symptoms.map((s, i) => (
                        <span key={i} className="text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                        {s}
                        </span>
                    ))}
                    </div>
                </div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    checkIn.painLevel >= 8 ? "bg-red-100 text-red-700" : 
                    checkIn.painLevel >= 5 ? "bg-yellow-100 text-yellow-700" : 
                    "bg-green-100 text-green-700"
                }`}>
                    {checkIn.painLevel}
                </div>
                </div>
                {checkIn.note && (
                <p className="text-sm text-slate-600 mt-2 border-t border-slate-200 pt-2">
                    "{checkIn.note}"
                </p>
                )}
            </div>
            ))
        )}
      </div>
    </div>
  );
}