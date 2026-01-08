import { patients } from "@/data/patients";
import PatientCard from "@/components/PatientCard";
import DashboardStats from "@/components/DashboardStats";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
  <h1 className="text-2xl font-bold text-gray-900">
    Doctor’s Dashboard
  </h1>

  <Link
    href="/profile"
    className="text-sm font-medium text-blue-600 hover:text-blue-700"
  >
    View Profile
  </Link>
</div>

      
      <DashboardStats />

      {/* Patient cards list */}
      <div className="space-y-6">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
          />
        ))}
      </div>
    </div>
  );
}
