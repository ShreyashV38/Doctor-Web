import Link from "next/link";
import { Patient } from "@/data/patients";

export default function PatientCard({ patient }: { patient: Patient }) {
  const isHighRisk = patient.risk === "High";

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Top Row: Name & Risk Badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-lg">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {patient.name}
              </h2>
              <p className="text-sm text-slate-500">
                {patient.condition} • {patient.age} yrs
              </p>
            </div>
          </div>
          
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              isHighRisk
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isHighRisk ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
            {patient.risk} Risk
          </span>
        </div>

        {/* Middle: Stats / Alert */}
        <div className="mb-6">
          {isHighRisk ? (
            <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-3 flex gap-3 items-start">
               <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
               <div>
                 <p className="text-sm font-medium text-rose-900">Urgent Attention Needed</p>
                 <p className="text-sm text-rose-700 mt-1">
                   Patient reported sharp pain increase and difficulty moving.
                 </p>
               </div>
            </div>
          ) : (
             <div className="text-sm text-slate-600 pl-16">
                Latest check-in: <span className="font-medium text-slate-900">Stable</span> with no new symptoms.
             </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
          <Link
            href={`/patients/${patient.id}`}
            className="btn-secondary"
          >
            View Details
          </Link>
          <Link 
            href={`/consultation/${patient.id}`}
            className={`btn-primary ${isHighRisk ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500' : ''}`}
          >
            Start Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}