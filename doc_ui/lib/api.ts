import { supabase } from "./supabase";

export type Patient = {
  id: string;
  name: string;
  age: number;
  condition: string;
  risk: "Low" | "High";
  status: "Active" | "Recovered" | "Critical";
  privateNotes?: string;
  appointment?: {
    id: string;      
    date: string;
    type: string;
    status: "Pending" | "Confirmed" | "Completed";
    notes?: string;   
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
          id: nextAppt.id,
          date: nextAppt.date,
          type: nextAppt.type || "Consultation",
          status: nextAppt.status as any,
          notes: nextAppt.notes
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
  // 1. Get current logged-in doctor
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) return null;

  // 2. Fetch User & Profile
  const { data: user, error } = await supabase
    .from('users')
    .select(`
      id, name, email,
      patient_profiles!patient_profiles_user_id_fkey (*)
    `)
    .eq('id', id)
    .single();

  if (error || !user) return null;

  // 3. Fetch the Private Note for this Doctor-Patient pair
  const { data: noteData } = await supabase
    .from('doctor_notes')
    .select('content')
    .eq('patient_id', id)
    .eq('doctor_id', currentUser.id)
    .single();

  // ... (Keep existing Symptoms & Appointments fetching logic here) ...
  const { data: symptoms } = await supabase.from('symptoms').select('*').eq('user_id', id).order('timestamp', { ascending: false }).limit(10);
  const { data: appointments } = await supabase.from('appointments').select('*').eq('patient_id', id).eq('status', 'Confirmed').gte('date', new Date().toISOString()).order('date', { ascending: true }).limit(1);

  const profileData: any = user.patient_profiles;
  const profile = Array.isArray(profileData) ? profileData[0] : profileData;
  const painTrend = symptoms?.map(s => s.painlvl).slice(0, 7).reverse() || [0];
  const nextAppt = appointments && appointments.length > 0 ? appointments[0] : null;

  return {
    id: user.id,
    name: user.name,
    age: profile?.age || 0,
    condition: profile?.condition || "General Checkup",
    risk: profile?.risk_level === 'High' ? 'High' : 'Low',
    status: profile?.status || "Active",
    
    // MAP THE NEW NOTE DATA
    privateNotes: noteData?.content || "", 
    
    appointment: nextAppt ? {
        id: nextAppt.id,
        date: nextAppt.date,
        type: nextAppt.type,
        status: nextAppt.status as any,
        notes: nextAppt.notes
    } : undefined,
    painTrend: painTrend.length > 0 ? painTrend : [0],
    checkIns: symptoms?.slice(0, 5).map(s => ({
        date: new Date(s.timestamp).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
        time: new Date(s.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', timeZone: 'Asia/Kolkata' }),
        painLevel: s.painlvl,
        symptoms: s.symptoms ? s.symptoms.split(',') : [],
        note: s.description || "No notes provided.",
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

// 6. Update Doctor Profile (With Debug Logs)
export async function updateDoctorProfile(profileData: any) {
  console.log("🚀 updateDoctorProfile called with:", profileData);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("❌ No user logged in");
    return { error: "Not logged in" };
  }
  console.log("👤 Authenticated User ID:", user.id);

  // 1. Update Users Table
  const userData = {
    name: profileData.name,
    phone_number: profileData.phone 
  };
  console.log("Attempting to update 'users' table with:", userData);

  const { data: userUpdateData, error: userError } = await supabase
    .from('users')
    .update(userData)
    .eq('id', user.id)
    .select(); // <--- Important: Returns the updated row so we know it worked

  if (userError) {
    console.error("❌ User Update Failed:", userError.message);
    return { error: userError.message };
  }
  
  if (userUpdateData.length === 0) {
    console.warn("⚠️ Warning: No rows updated in 'users' table. Check RLS policies!");
  } else {
    console.log("✅ Users Table Updated Successfully.");
  }

  // 2. Update Doctor Profiles Table
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
    specialization: profileData.specialization || "General",
    bio: profileData.bio,
    status: profileData.status
  };
  console.log("Attempting to update 'doctor_profiles' table with:", doctorData);

  const { data: docUpdateData, error: docError } = await supabase
    .from('doctor_profiles')
    .update(doctorData)
    .eq('user_id', user.id)
    .select(); // <--- Important: Returns the updated row

  if (docError) {
    console.error("❌ Profile Update Failed:", docError.message);
    return { error: docError.message };
  }

  if (docUpdateData.length === 0) {
    console.warn("⚠️ Warning: No rows updated in 'doctor_profiles'. Possible causes:");
    console.warn("   1. RLS Policy prevents UPDATE.");
    console.warn("   2. No row exists for this user_id (needs INSERT not UPDATE).");
  } else {
    console.log("✅ Doctor Profiles Table Updated Successfully.");
  }

  return { success: true };
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

// 8. Update Appointment Status (Accept/Cancel)
export async function updateAppointmentStatus(id: string, status: 'Confirmed' | 'Cancelled') {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error("Error updating appointment:", error);
    return { error: error.message };
  }
  return { success: true };
}

// 9. Reschedule Appointment (Updated to allow keeping status)
export async function rescheduleAppointment(id: string, newDate: string, status: 'Pending' | 'Confirmed' = 'Pending') {
  const { error } = await supabase
    .from('appointments')
    .update({ 
        date: newDate,
        status: status 
    })
    .eq('id', id);

  if (error) {
    console.error("Error rescheduling:", error);
    return { error: error.message };
  }
  return { success: true };
}


// 10. Save Doctor's Private Notes (Separate Table Upsert)
export async function savePatientNotes(patientId: string, notes: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from('doctor_notes')
    .upsert({ 
        patient_id: patientId,
        doctor_id: user.id,
        content: notes,
        updated_at: new Date().toISOString()
    }, { onConflict: 'patient_id, doctor_id' }); // Uses the unique constraint we added

  if (error) {
    console.error("Error saving notes:", error);
    return { error: error.message };
  }
  return { success: true };
}