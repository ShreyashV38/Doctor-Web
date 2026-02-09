"use client";

import { useEffect, useState } from "react";
import DashboardStats from "@/components/DashboardStats";
import RiskAlert from "@/components/RiskAlert";
import RecentCheckIns from "@/components/RecentCheckIns";
import DashboardPatientList from "@/components/DashboardPatientList";
import AppointmentRequests from "@/components/AppointmentRequests";
import { 
  getPatientsFromDB, 
  getPendingAppointments, 
  getRecentSymptoms, 
  Patient 
} from "@/lib/api";

export default function DashboardPage() {
  // State for all dashboard data
  const [patients, setPatients] = useState<Patient[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        // Fetch everything in parallel for speed
        const [patientsData, requestsData, symptomsData] = await Promise.all([
          getPatientsFromDB(),
          getPendingAppointments(),
          getRecentSymptoms()
        ]);

        setPatients(patientsData);
        setPendingRequests(requestsData);
        setRecentCheckIns(symptomsData);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-slate-500 font-medium animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate Stats
  const totalPatients = patients.length;
  const criticalPatients = patients.filter(p => p.risk_level === 'High').length;
  const activeNow = patients.filter(p => p.status === 'Active').length;
  // Appointments today: Filter patients with appointment date === today
  const appointmentsToday = patients.filter(p => {
     if (!p.appointment?.date) return false;
     const apptDate = new Date(p.appointment.date).toDateString();
     const today = new Date().toDateString();
     return apptDate === today;
  }).length;

  // Filter High Risk Patients for the Alert Card
  const highRiskPatients = patients.filter(p => p.risk_level === 'High');

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back, here is what's happening today.</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
           {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* 2. Stats Row (Cards) */}
      <DashboardStats 
        totalPatients={totalPatients}
        criticalPatients={criticalPatients}
        appointmentsToday={appointmentsToday}
        activeNow={activeNow}
      />

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) */}
        <div className="xl:col-span-2 space-y-8">
           
           {/* Risk Alerts Section */}
           {highRiskPatients.length > 0 && (
              <RiskAlert patients={highRiskPatients} />
           )}

           {/* Patient List Table */}
           <DashboardPatientList patients={patients} />
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-8">
           
           {/* Appointment Requests Card */}
           <AppointmentRequests requests={pendingRequests} />

           {/* Recent Activity / Check-ins */}
           <RecentCheckIns checkIns={recentCheckIns} />
           
        </div>
      </div>
    </div>
  );
}