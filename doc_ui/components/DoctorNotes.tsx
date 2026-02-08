"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Ensure this import path is correct for your project
import { savePatientNotes } from "@/lib/api";

export default function DoctorNotes({ patientId }: { patientId: string }) {
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch notes on mount
  useEffect(() => {
    async function fetchNotes() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('doctor_notes')
        .select('content')
        .eq('patient_id', patientId)
        .eq('doctor_id', user.id)
        .single();

      if (data) {
        setNotes(data.content || "");
      }
      setIsLoading(false);
    }

    fetchNotes();
  }, [patientId]);

  const handleSave = async () => {
    setIsSaving(true);
    // Reuse your existing API function or call Supabase directly
    const { success, error } = await savePatientNotes(patientId, notes);
    setIsSaving(false);

    if (error) {
      alert("Failed to save notes.");
    } else {
      // Optional: Show a subtle success indicator instead of alert
      alert("Notes saved successfully!");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      
      <h3 className="font-bold text-lg mb-2 relative z-10">Doctor's Notes</h3>
      <p className="text-slate-400 text-sm mb-4 relative z-10">Add private notes about this patient's progress.</p>
      
      <textarea 
        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-32"
        placeholder="Type private notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      ></textarea>
      
      <button 
        onClick={handleSave}
        disabled={isSaving}
        className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-400 rounded-lg text-sm font-bold transition-colors flex justify-center items-center gap-2"
      >
        {isSaving ? "Saving..." : "Save Note"}
      </button>
    </div>
  );
}