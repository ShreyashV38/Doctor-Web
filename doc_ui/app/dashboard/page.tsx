"use client"; // <--- This is the magic line that fixes the Auth issue

import { useEffect, useState } from "react";
import { getPatientsFromDB, getPendingAppointments, Patient } from "@/lib/api";
import DashboardStats from "@/components/DashboardStats";
import AppointmentRequests from "@/components/AppointmentRequests";
import DashboardPatientList from "@/components/DashboardPatientList";

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching Dashboard Data...");
        
        // Fetch both Patients and Appointments in parallel
        const [patientsData, requestsData] = await Promise.all([
          getPatientsFromDB(),
          getPendingAppointments()
        ]);

        console.log("Patients Loaded:", patientsData.length);
        setPatients(patientsData);
        setRequests(requestsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Trigger the fetch
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading Patient Data...</p>
        </div>
      </div>
    );
  }

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
      <DashboardStats patients={patients} />

      {/* Action Items (Appointments) */}
      <AppointmentRequests requests={requests} />

      {/* Sortable Patient List */}
      <DashboardPatientList patients={patients} />
    </div>
  );
}