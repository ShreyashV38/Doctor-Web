import Link from "next/link";
import { patients } from "@/data/patients";
import { notFound } from "next/navigation";
import RiskAlert from "@/components/RiskAlert";
import PainChart from "@/components/PainChart";
import RecentCheckIns from "@/components/RecentCheckIns";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params;

  const patient = patients.find((p) => p.id === id);
  if (!patient) return notFound();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {patient.name}
            </h1>
            <p className="text-sm text-gray-700">
              {patient.condition}
            </p>
            <p className="text-sm text-gray-600">
              Age: {patient.age}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
            {patient.risk.toUpperCase()} RISK
          </span>
        </div>

        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
          Start Video Consultation
        </button>
      </div>

      <RiskAlert />

      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold mb-4">
          Pain Level Trend (Last 7 Days)
        </h3>
        <PainChart data={patient.painTrend} />
      </div>

      <RecentCheckIns checkIns={patient.checkIns} />
    </div>
  );
}
