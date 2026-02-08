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

// 1. Fetch Patients Assigned to Logged-in Doctor
export async function getPatientsFromDB(): Promise<Patient[]> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: usersData, error } = await supabase
    .from('users')
    .select(`
      id, name, email,
      patient_profiles!patient_profiles_user_id_fkey!inner (*) 
    `) 
    .eq('role', 'patient')
    .eq('patient_profiles.assigned_doctor_id', user.id); 

  if (error || !usersData) {
    console.error("Error fetching patients:", error);
    return [];
  }

  const patientIds = usersData.map(u => u.id);

  const { data: symptoms } = await supabase
    .from('symptoms')
    .select('*')
    .in('user_id', patientIds)
    .order('timestamp', { ascending: false });

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .in('patient_id', patientIds)
    .in('status', ['Pending', 'Confirmed'])
    .order('date', { ascending: true });

  return usersData.map((user) => {
    const profileData: any = user.patient_profiles;
    const profile = Array.isArray(profileData) ? profileData[0] : profileData;
    const userSymptoms = symptoms?.filter(s => s.user_id === user.id) || [];
    const painTrend = userSymptoms.map(s => s.painlvl).slice(0, 7).reverse();
    const nextAppt = appointments?.find(a => a.patient_id === user.id);

    return {
        id: user.id,
        name: user.name,
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

// 2. Fetch Single Patient (For Profile Page)
export async function getPatientById(id: string): Promise<Patient | null> {
  const { data: user, error } = await supabase
    .from('users')
    .select(`
      id, name, email,
      patient_profiles!patient_profiles_user_id_fkey (*)
    `)
    .eq('id', id)
    .single();

  if (error || !user) return null;

  const { data: symptoms } = await supabase
    .from('symptoms')
    .select('*')
    .eq('user_id', id)
    .order('timestamp', { ascending: false });

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', id)
    .order('date', { ascending: true });

  const profileData: any = user.patient_profiles;
  const profile = Array.isArray(profileData) ? profileData[0] : profileData;

  const painTrend = symptoms?.map(s => s.painlvl).slice(0, 14).reverse() || [];
  const nextAppt = appointments?.find(a => new Date(a.date) > new Date());

  return {
    id: user.id,
    name: user.name,
    age: profile?.age || 0,
    condition: profile?.condition || "General Checkup",
    risk: profile?.risk_level === 'High' ? 'High' : 'Low',
    status: profile?.status || "Active",
    appointment: nextAppt ? {
        date: nextAppt.date,
        type: nextAppt.type,
        status: nextAppt.status
    } : undefined,
    painTrend: painTrend.length > 0 ? painTrend : [0],
    checkIns: symptoms?.map(s => ({
        date: new Date(s.timestamp).toLocaleDateString(),
        painLevel: s.painlvl,
        symptoms: s.symptoms ? s.symptoms.split(',') : [],
        note: s.description || "",
        risk: s.painlvl >= 8 ? "high" : "low"
    })) || []
  };
}

// 3. Fetch Pending Appointments
export async function getPendingAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id, date, type, notes,
      users!appointments_patient_id_fkey (id, name)
    `)
    .eq('status', 'Pending')
    .order('date', { ascending: true });

  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }

  return data.map(appt => {
    const user: any = appt.users;
    return {
      id: appt.id,
      patientName: Array.isArray(user) ? user[0]?.name : user?.name,
      patientId: Array.isArray(user) ? user[0]?.id : user?.id,
      date: appt.date,
      type: appt.type,
      notes: appt.notes
    };
  });
}

// 4. Fetch Appointment History
export async function getAppointmentHistory() {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id, date, type, status,
      users!appointments_patient_id_fkey (id, name)
    `)
    .in('status', ['Completed', 'Cancelled'])
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching history:", error);
    return [];
  }

  return data.map(appt => {
    const user: any = appt.users;
    return {
      id: appt.id,
      patientId: Array.isArray(user) ? user[0]?.id : user?.id,
      name: Array.isArray(user) ? user[0]?.name : user?.name,
      date: appt.date,
      type: appt.type,
      status: appt.status
    };
  });
}

// 5. Fetch Doctor Profile (For Profile Page)
export async function getDoctorProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select(`
      id, name, email, role,
      doctor_profiles!doctor_profiles_user_id_fkey (*)
    `)
    .eq('id', user.id)
    .single();

  if (error || !data) {
     console.error("Error fetching doctor profile:", error);
     return null;
  }

  // Handle array/object difference safely
  const profile: any = data.doctor_profiles; 
  const docProfile = Array.isArray(profile) ? profile[0] : profile;

  // Map Database Fields -> UI Fields
  return {
    name: data.name,                                
    email: data.email,                              
    role: docProfile?.job_title || "Consultant", // Uses new 'job_title' column
    specialization: docProfile?.specialization || "",
    hospital: docProfile?.hospital || "",
    experience: docProfile?.experience || "",
    bio: docProfile?.bio || "",
    status: "Active",
    phone: docProfile?.phone_number || "",
    gender: docProfile?.gender || "Prefer not to say",
    location: "Hospital Main Campus", // Hardcoded or add 'location' to DB if needed
    department: docProfile?.department || "",
    qualifications: docProfile?.qualifications || "",
    license: docProfile?.license_id || "",
    workingDays: docProfile?.working_days || "Monday – Friday",
    time: docProfile?.working_hours || "09:00 AM – 05:00 PM",
    mode: docProfile?.consultation_mode || "In-person"
  };
}

// 6. Update Doctor Profile (For Profile Page Edits)
export async function updateDoctorProfile(profileData: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  // 1. Update Users Table (Name)
  const { error: userError } = await supabase
    .from('users')
    .update({ name: profileData.name })
    .eq('id', user.id);

  if (userError) return { error: userError.message };

  // 2. Update Doctor Profiles Table (All Fields)
  const doctorData = {
    job_title: profileData.role,           
    experience: profileData.experience,
    phone_number: profileData.phone,
    gender: profileData.gender,
    department: profileData.department,
    hospital: profileData.hospital,
    qualifications: profileData.qualifications,
    license_id: profileData.license,
    working_days: profileData.workingDays,
    working_hours: profileData.time,
    consultation_mode: profileData.mode,
    specialization: profileData.specialization || "General", // Ensure not null
    bio: profileData.bio
  };

  const { error: docError } = await supabase
    .from('doctor_profiles')
    .update(doctorData)
    .eq('user_id', user.id);

  return { error: docError?.message };
}

// 7. Complete Onboarding (Doctor Only - Initial Setup)
export async function completeOnboarding(data: {
  phone: string;
  gender: string;
  specialization: string;
  hospital: string;
  experience: string;
  license: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // 1. Update the main 'users' table
  const { error: userError } = await supabase
    .from('users')
    .update({
      role: 'doctor', // Force role to doctor
      phone_number: data.phone
    })
    .eq('id', user.id);

  if (userError) return { error: userError.message };

  // 2. Insert into 'doctor_profiles' table with defaults for missing fields
  const { error: docError } = await supabase
    .from('doctor_profiles')
    .insert({
      user_id: user.id,
      specialization: data.specialization,
      hospital: data.hospital,
      experience: data.experience,
      license_id: data.license,
      phone_number: data.phone,
      gender: data.gender,
      // Defaults for fields not asked in onboarding:
      job_title: 'Consultant',
      bio: '',
      department: data.specialization, // Use specialization as default dept
      qualifications: '',
      working_days: 'Monday – Friday',
      working_hours: '09:00 AM – 05:00 PM',
      consultation_mode: 'In-person & Video'
    });
    
  if (docError) return { error: docError.message };

  return { success: true };
}