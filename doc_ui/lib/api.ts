import { supabase } from "./supabase";

// 1. Interfaces
export interface CheckIn {
  id?: string;
  date: string;
  time?: string;
  painLevel: number;
  symptoms: string[];
  note: string;
  risk: string;           
  aiExplanation?: string; 
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: 'Active' | 'Recovered' | 'Critical';
  risk_level: 'Low' | 'Moderate' | 'High'; 
  trend: 'stable' | 'up' | 'down';
  avatar: string;
  lastVisit?: string;
  nextAppointment?: string;
  painTrend?: number[];
  checkIns?: CheckIn[]; 
  appointment?: {
      id: string;
      date: string;
      status: string;
      type: string;
      notes?: string;
  }
}

// 2. Fetch Patients (Fixed: STRICT Dynamic Risk)
export async function getPatientsFromDB(): Promise<Patient[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: usersData, error } = await supabase
    .from('users')
    .select(`
      id, name, email, avatar_url,
      patient_profiles!patient_profiles_user_id_fkey!inner (*) 
    `) 
    .eq('role', 'patient')
    .eq('patient_profiles.assigned_doctor_id', user.id); 

  if (error || !usersData) {
    console.error("Error fetching patients:", error);
    return [];
  }

  const patientIds = usersData.map(u => u.id);

  // Fetch latest symptoms (Critical for dynamic risk)
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

  return usersData.map((user: any) => {
    const profileData: any = user.patient_profiles;
    const profile = Array.isArray(profileData) ? profileData[0] : profileData;
    
    // Get Symptoms for this user
    const userSymptoms = symptoms?.filter(s => s.user_id === user.id) || [];
    const latestSymptom = userSymptoms[0]; // The most recent check-in
    
    // --- FIXED DYNAMIC RISK LOGIC ---
    let calculatedRisk = profile?.risk_level || 'Low'; // Fallback if no symptoms
    
    if (latestSymptom) {
        // STRICT OVERRIDE: Latest symptom dictates the card status 100%
        if (latestSymptom.risk_level === 'High' || latestSymptom.painlvl >= 8) {
            calculatedRisk = 'High';
        } else if (latestSymptom.risk_level === 'Moderate' || latestSymptom.painlvl >= 5) {
            calculatedRisk = 'Moderate';
        } else {
            // If latest is Low, Force it to Low (even if profile was High)
            calculatedRisk = 'Low';
        }
    }

    const painTrend = userSymptoms.map(s => s.painlvl).slice(0, 7).reverse();
    const nextAppt = appointments?.find(a => a.patient_id === user.id);

    return {
        id: user.id,
        name: user.name,
        age: profile?.age || 0,
        condition: profile?.condition || "General Checkup",
        
        // Use our strictly calculated risk
        risk_level: calculatedRisk,
        
        status: profile?.status || 'Active',
        trend: profile?.trend || 'stable',
        avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}&background=random`,
        appointment: nextAppt ? {
          id: nextAppt.id,
          date: nextAppt.date,
          type: nextAppt.type || "Consultation",
          status: nextAppt.status,
          notes: nextAppt.notes
        } : undefined,
        painTrend: painTrend.length > 0 ? painTrend : [0],
        checkIns: userSymptoms.slice(0, 3).map(s => ({
          date: new Date(s.timestamp).toLocaleDateString(),
          painLevel: s.painlvl,
          symptoms: s.symptoms ? s.symptoms.split(',') : [],
          note: s.description || "",
          risk: s.risk_level || (s.painlvl >= 8 ? "High" : "Low"), 
          aiExplanation: s.ai_explanation 
        }))
    };
  });
}

// 3. Fetch Single Patient (Fixed: STRICT Dynamic Risk)
export async function getPatientById(id: string): Promise<Patient | null> {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) return null;

  const { data: user, error } = await supabase
    .from('users')
    .select(`id, name, email, avatar_url, patient_profiles!patient_profiles_user_id_fkey (*)`)
    .eq('id', id)
    .single();

  if (error || !user) return null;

  const { data: noteData } = await supabase
    .from('doctor_notes')
    .select('content')
    .eq('patient_id', id)
    .eq('doctor_id', currentUser.id)
    .single();

  const { data: symptoms } = await supabase
    .from('symptoms')
    .select('*')
    .eq('user_id', id)
    .order('timestamp', { ascending: false })
    .limit(10);

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', id)
    .eq('status', 'Confirmed')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(1);

  const profileData: any = user.patient_profiles;
  const profile = Array.isArray(profileData) ? profileData[0] : profileData;
  
  // --- FIXED DYNAMIC RISK LOGIC ---
  const latestSymptom = symptoms?.[0];
  let calculatedRisk = profile?.risk_level || 'Low'; // Fallback
  
  if (latestSymptom) {
      if (latestSymptom.risk_level === 'High' || latestSymptom.painlvl >= 8) {
          calculatedRisk = 'High';
      } else if (latestSymptom.risk_level === 'Moderate' || latestSymptom.painlvl >= 5) {
          calculatedRisk = 'Moderate';
      } else {
          // Force Low if symptom is Low
          calculatedRisk = 'Low';
      }
  }

  const painTrend = symptoms?.map(s => s.painlvl).slice(0, 7).reverse() || [0];
  const nextAppt = appointments && appointments.length > 0 ? appointments[0] : null;

  return {
    id: user.id,
    name: user.name,
    age: profile?.age || 0,
    condition: profile?.condition || "General Checkup",
    
    // Use strictly calculated risk
    risk_level: calculatedRisk,
    
    status: profile?.status || "Active",
    trend: profile?.trend || 'stable',
    avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}&background=random`,
    appointment: nextAppt ? {
        id: nextAppt.id,
        date: nextAppt.date,
        type: nextAppt.type,
        status: nextAppt.status,
        notes: nextAppt.notes
    } : undefined,
    painTrend: painTrend.length > 0 ? painTrend : [0],
    checkIns: symptoms?.slice(0, 5).map(s => ({
        id: s.id,
        date: new Date(s.timestamp).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
        time: new Date(s.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', timeZone: 'Asia/Kolkata' }),
        painLevel: s.painlvl,
        symptoms: s.symptoms ? s.symptoms.split(',') : [],
        note: s.description || "No notes provided.",
        risk: s.risk_level || (s.painlvl >= 8 ? "High" : "Low"), 
        aiExplanation: s.ai_explanation 
    })) || []
  };
}

// ... (Keep existing functions below: getPendingAppointments, etc.) ...
// (Make sure to export all of them properly!)

export async function getPendingAppointments() {
    // ... (Your existing code)
    const { data, error } = await supabase
    .from('appointments')
    .select(`
      id, date, type, notes, status,
      users!appointments_patient_id_fkey (id, name)
    `)
    .eq('status', 'Pending') 
    .order('date', { ascending: true });

  if (error) return [];

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

export async function getAppointmentHistory() {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id, date, type, status,
      users!appointments_patient_id_fkey (id, name)
    `)
    .in('status', ['Completed', 'Cancelled'])
    .order('date', { ascending: false });

  if (error) return [];

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

  if (error || !data) return null;

  const profile: any = data.doctor_profiles; 
  const docProfile = Array.isArray(profile) ? profile[0] : profile;

  return {
    name: data.name,                                
    email: data.email,                              
    role: docProfile?.job_title || "Consultant",
    specialization: docProfile?.specialization || "",
    hospital: docProfile?.hospital || "",
    experience: docProfile?.experience || "",
    bio: docProfile?.bio || "",
    status: "Active",
    phone: docProfile?.phone_number || "",
    gender: docProfile?.gender || "Prefer not to say",
    location: "Hospital Main Campus", 
    department: docProfile?.department || "",
    qualifications: docProfile?.qualifications || "",
    license: docProfile?.license_id || "",
    workingDays: docProfile?.working_days || "Monday – Friday",
    time: docProfile?.working_hours || "09:00 AM – 05:00 PM",
    mode: docProfile?.consultation_mode || "In-person"
  };
}

export async function updateDoctorProfile(profileData: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const userData = {
    name: profileData.name,
    phone_number: profileData.phone 
  };

  const { error: userError } = await supabase
    .from('users')
    .update(userData)
    .eq('id', user.id);

  if (userError) return { error: userError.message };
  
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

  const { error: docError } = await supabase
    .from('doctor_profiles')
    .update(doctorData)
    .eq('user_id', user.id);

  if (docError) return { error: docError.message };

  return { success: true };
}

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

  const { error: userError } = await supabase
    .from('users')
    .update({
      role: 'doctor', 
      phone_number: data.phone
    })
    .eq('id', user.id);

  if (userError) return { error: userError.message };

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
      job_title: 'Consultant',
      bio: '',
      department: data.specialization, 
      qualifications: '',
      working_days: 'Monday – Friday',
      working_hours: '09:00 AM – 05:00 PM',
      consultation_mode: 'In-person & Video'
    });
    
  if (docError) return { error: docError.message };

  return { success: true };
}

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
    }, { onConflict: 'patient_id, doctor_id' });

  if (error) {
    console.error("Error saving notes:", error);
    return { error: error.message };
  }
  return { success: true };
}

export async function getUpcomingAppointments() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id, date, type, notes, status,
      users!appointments_patient_id_fkey (id, name)
    `)
    .eq('doctor_id', user.id)           
    .eq('status', 'Confirmed')          
    .gte('date', new Date().toISOString()) 
    .order('date', { ascending: true });

  if (error) return [];

  return data.map(appt => {
    const user: any = appt.users;
    return {
      id: appt.id,
      patientName: Array.isArray(user) ? user[0]?.name : user?.name,
      patientId: Array.isArray(user) ? user[0]?.id : user?.id,
      date: appt.date,
      type: appt.type,
      notes: appt.notes,
      status: appt.status
    };
  });
}

export async function getRecentSymptoms() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: myPatients } = await supabase
    .from('patient_profiles')
    .select('user_id')
    .eq('assigned_doctor_id', user.id);
    
  if (!myPatients || myPatients.length === 0) return [];
  
  const patientIds = myPatients.map(p => p.user_id);

  const { data, error } = await supabase
    .from('symptoms')
    .select(`
      id, symptoms, painlvl, timestamp, description, risk_level, ai_explanation,
      users!symptoms_user_id_fkey (name, avatar_url)
    `)
    .in('user_id', patientIds)
    .order('timestamp', { ascending: false })
    .limit(5);

  if (error) return [];

  return data.map(s => {
    const u: any = s.users;
    return {
      id: s.id,
      patientName: Array.isArray(u) ? u[0]?.name : u?.name,
      avatar: Array.isArray(u) ? u[0]?.avatar_url : u?.avatar_url,
      symptom: s.symptoms,
      painLevel: s.painlvl,
      timestamp: s.timestamp,
      description: s.description,
      riskLevel: s.risk_level, 
      aiExplanation: s.ai_explanation
    };
  });
}