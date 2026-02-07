import { patients } from "@/data/patients";
import DashboardStats from "@/components/DashboardStats";
import AppointmentRequests from "@/components/AppointmentRequests";
import DashboardPatientList from "@/components/DashboardPatientList";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctor’s Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your assigned patients.</p>
        </div>
      </div>

      {/* Stats Row */}
      <DashboardStats />

      {/* Action Items */}
      <AppointmentRequests />

      {/* Sortable Patient List */}
      <DashboardPatientList patients={patients} />
    </div>
  );
}