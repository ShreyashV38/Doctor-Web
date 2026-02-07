import Link from "next/link";
import { patients } from "@/data/patients";
import { notFound } from "next/navigation";

export default async function ConsultationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = patients.find((p) => p.id === id);

  if (!patient) return notFound();

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Consultation: {patient.name}
          </h1>
          <p className="text-sm text-slate-500">Duration: 00:00 • {patient.condition}</p>
        </div>
        <Link href="/dashboard" className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg text-rose-600 hover:bg-rose-50 border-rose-200">
          End Consultation
        </Link>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 bg-slate-900 rounded-2xl relative overflow-hidden shadow-2xl mb-4">
        {/* Remote Video Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-slate-700 mx-auto mb-4 flex items-center justify-center text-3xl text-slate-400 font-bold">
                    {patient.name.charAt(0)}
                </div>
                <p className="text-slate-400 text-lg">Waiting for {patient.name} to join...</p>
            </div>
        </div>

        {/* Local Video Preview */}
        <div className="absolute bottom-6 right-6 w-48 h-36 bg-slate-800 rounded-xl border border-slate-700 shadow-lg flex items-center justify-center">
             <p className="text-xs text-slate-500">You</p>
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 p-3 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-700/50">
            <button className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
            <button className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
            <button className="p-3 rounded-full bg-rose-600 text-white hover:bg-rose-700">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6.697M18 8l2 2m0 0l2 2m-2-2l-2 2" /></svg>
            </button>
        </div>
      </div>
    </div>
  );
}