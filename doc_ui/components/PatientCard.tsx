import Link from "next/link";
import { Patient } from "@/data/patients";

export default function PatientCard({ patient }: { patient: Patient }) {
  const isHighRisk = patient.risk === "High";

  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {patient.name}
          </h2>
          <p className="text-sm text-gray-700">
            {patient.condition}
          </p>
          <p className="text-sm text-gray-600">
            Age: {patient.age}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isHighRisk
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {patient.risk}
        </span>
      </div>

      {/* Alert box */}
      {isHighRisk && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
          <p className="font-medium text-red-600">
            Urgent attention needed
          </p>
          <ul className="list-disc ml-5 mt-1 text-red-500">
            <li>Significant pain increase</li>
            <li>Difficulty moving</li>
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link
          href={`/patients/${patient.id}`}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          View details
        </Link>

        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${
            isHighRisk
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Start call
        </button>
      </div>
    </div>
  );
}
