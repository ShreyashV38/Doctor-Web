import { getPatientsFromDB } from "@/lib/api"; // Import the new function
import DashboardStats from "@/components/DashboardStats";
import AppointmentRequests from "@/components/AppointmentRequests";
import DashboardPatientList from "@/components/DashboardPatientList";

// Async Server Component
export default async function Dashboard() {
  // Fetch real data from Supabase
  const patients = await getPatientsFromDB();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctor’s Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your assigned patients.</p>
        </div>
      </div>

      {/* Stats Row - Pass the real data */}
      <DashboardStats patients={patients} />

      {/* Action Items */}
      {/* You can update AppointmentRequests similarly later if needed */}
      <AppointmentRequests />

      {/* Sortable Patient List - Pass the real data */}
      <DashboardPatientList patients={patients} />
    </div>
  );
}