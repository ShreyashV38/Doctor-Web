import { patients } from "@/data/patients";
import PatientCard from "@/components/PatientCard";
import DashboardStats from "@/components/DashboardStats";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, Dr. Wilson.</p>
        </div>
        <div className="flex gap-3">
             {/* Optional Header Actions */}
             <button className="btn-secondary">Export Data</button>
        </div>
      </div>

      {/* Stats Row */}
      <DashboardStats />

      {/* Content Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Patient Queue</h2>
          <span className="text-sm text-slate-500">Sorted by risk level</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
            />
          ))}
        </div>
      </div>
    </div>
  );
}