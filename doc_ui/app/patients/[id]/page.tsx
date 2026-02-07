import Link from "next/link";
import { patients } from "@/data/patients";
import { notFound } from "next/navigation";
import PainChart from "@/components/PainChart";

export default async function PatientProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = patients.find((p) => p.id === id);

  if (!patient) return notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/patients" className="btn-secondary px-3">
             ← Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
            <p className="text-slate-500 text-sm">Patient ID: {patient.id}</p>
          </div>
        </div>
        <Link 
            href={`/consultation/${patient.id}`}
            className="btn-primary"
        >
            Start Video Consultation
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Details</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-500">Age</span>
                    <span className="font-medium">{patient.age}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Condition</span>
                    <span className="font-medium">{patient.condition}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className="font-medium text-blue-600">{patient.status}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">Risk</span>
                    <span className={`font-medium ${patient.risk === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>{patient.risk}</span>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clinical Data */}
        <div className="md:col-span-2 space-y-6">
           {/* Pain Chart */}
           <div className="card p-1">
             <PainChart data={patient.painTrend} />
           </div>

           {/* Recent Check-ins */}
           <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Recent Check-ins</h3>
              {patient.checkIns.length > 0 ? (
                  <div className="space-y-4">
                    {patient.checkIns.map((checkIn, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-slate-700">{checkIn.date}</span>
                                <span className="text-xs font-bold px-2 py-1 bg-white rounded border border-slate-200">Pain: {checkIn.painLevel}/10</span>
                            </div>
                            <p className="text-sm text-slate-600 italic">"{checkIn.note}"</p>
                            <div className="mt-2 flex gap-2">
                                {checkIn.symptoms.map(s => (
                                    <span key={s} className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">{s}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <p className="text-slate-400 text-sm">No recent check-ins found.</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}