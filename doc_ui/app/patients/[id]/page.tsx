import Link from "next/link";
import { getPatientById } from "@/lib/api";
import { notFound } from "next/navigation";
import PainChart from "@/components/PainChart";
import RecentCheckIns from "@/components/RecentCheckIns";

export default async function PatientProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch data
  const patient = await getPatientById(id);

  // If patient not found in DB, show 404 page
  if (!patient) return notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/patients" className="text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center gap-1">
             ← Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
            <p className="text-slate-500 text-sm">Patient ID: {patient.id.slice(0, 8)}...</p>
          </div>
        </div>
        <div className="flex gap-3">
            <Link 
                href={`/consultation/${patient.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm shadow-blue-600/20 transition-all"
            >
                Start Consultation
            </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase">Condition</p>
            <p className="text-lg font-bold text-slate-900 mt-1">{patient.condition}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase">Status</p>
            <span className={`inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                patient.status === 'Critical' ? 'bg-red-100 text-red-800' :
                patient.status === 'Recovered' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
            }`}>
                {patient.status}
            </span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase">Risk Level</p>
            <p className={`text-lg font-bold mt-1 ${
                patient.risk === 'High' ? 'text-red-600' : 'text-slate-900'
            }`}>
                {patient.risk}
            </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase">Age</p>
            <p className="text-lg font-bold text-slate-900 mt-1">{patient.age} Years</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
            <PainChart data={patient.painTrend} />
            <RecentCheckIns checkIns={patient.checkIns} />
        </div>

        {/* Right Column: Info & Actions */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Next Appointment</h3>
                {patient.appointment ? (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="font-bold text-blue-900">
                            {new Date(patient.appointment.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                            {new Date(patient.appointment.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mt-3">
                            {patient.appointment.type}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">No upcoming appointments.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}