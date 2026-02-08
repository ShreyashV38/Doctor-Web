import { supabase } from "./supabase";

export type Patient = {
  id: string;
  name: string;
  age: number;
  condition: string;
  risk: "Low" | "High";
  status: "Active" | "Recovered" | "Critical";
  appointment?: {
    date: string;
    type: string;
    status: "Pending" | "Confirmed" | "Completed";
  };
  painTrend: number[];
  checkIns: any[];
};

export async function getPatientsFromDB(): Promise<Patient[]> {
  // FIX: Use the specific relationship name to avoid ambiguity
  const { data: usersData, error } = await supabase
    .from('users')
    .select(`
      id, name, email,
      patient_profiles!patient_profiles_user_id_fkey (*)
    `)
    .eq('role', 'patient');

  if (error || !usersData) {
    console.error("Error fetching patients:", error);
    return [];
  }

  const patientIds = usersData.map(u => u.id);

  // 2. Fetch Symptoms
  const { data: symptoms } = await supabase
    .from('symptoms')
    .select('*')
    .in('user_id', patientIds)
    .order('timestamp', { ascending: false });

  // 3. Fetch Appointments
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .in('patient_id', patientIds)
    .in('status', ['Pending', 'Confirmed'])
    .order('date', { ascending: true });

  // 4. Map DB results to UI format
  return usersData.map((user) => {
    // Handle the joined data. It comes as an array or object.
    const profile = Array.isArray(user.patient_profiles) 
      ? user.patient_profiles[0] 
      : user.patient_profiles;

    const userSymptoms = symptoms?.filter(s => s.user_id === user.id) || [];
    const painTrend = userSymptoms.map(s => s.painlvl).slice(0, 7).reverse();
    const nextAppt = appointments?.find(a => a.patient_id === user.id);

    return {
      id: user.id,
      name: user.name,
      // Pull details from the joined profile
      age: profile?.age || 0,
      condition: profile?.condition || "General Checkup",
      risk: profile?.risk_level === 'High' ? 'High' : 'Low',
      status: profile?.status || 'Active',
      
      appointment: nextAppt ? {
        date: nextAppt.date,
        type: nextAppt.type || "Consultation",
        status: nextAppt.status as any
      } : undefined,
      
      painTrend: painTrend.length > 0 ? painTrend : [0],
      checkIns: userSymptoms.slice(0, 3).map(s => ({
        date: new Date(s.timestamp).toLocaleDateString(),
        painLevel: s.painlvl,
        symptoms: s.symptoms ? s.symptoms.split(',') : [],
        note: s.description || "",
        risk: s.painlvl >= 8 ? "high" : "low"
      }))
    };
  });
}