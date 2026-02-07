export type CheckIn = {
  date: string;
  painLevel: number;
  symptoms: string[];
  note: string;
  risk: "low" | "high";
};

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed";

export type Patient = {
  id: string;
  name: string;
  age: number;
  condition: string;
  risk: "Low" | "High";
  status: "Active" | "Recovered" | "Critical";
  // The active appointment request or scheduled slot
  appointment?: {
    date: string; // ISO string
    type: string; // e.g., "Monthly Check-up", "Emergency"
    status: AppointmentStatus;
  };
  painTrend: number[];
  checkIns: CheckIn[];
};

export const patients: Patient[] = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    age: 68,
    condition: "Post-surgery recovery",
    risk: "High",
    status: "Critical",
    appointment: {
      date: "2024-03-10T09:00:00",
      type: "Emergency Consult",
      status: "Pending", // Needs Doctor Action
    },
    painTrend: [4, 3, 4, 5, 6, 7],
    checkIns: [
      {
        date: "Dec 6",
        painLevel: 7,
        symptoms: ["sleep issues", "difficulty moving"],
        note: "Had sharp pain. Barely slept.",
        risk: "high",
      },
    ],
  },
  {
    id: "mike-chen",
    name: "Michael Chen",
    age: 42,
    condition: "Chronic Lower Back Pain",
    risk: "Low",
    status: "Active",
    appointment: {
      date: "2024-03-12T14:30:00",
      type: "Routine Check-up",
      status: "Confirmed", // Already on schedule
    },
    painTrend: [5, 5, 4, 4, 3, 3],
    checkIns: [],
  },
  {
    id: "emma-wilson",
    name: "Emma Wilson",
    age: 35,
    condition: "Fibromyalgia",
    risk: "High",
    status: "Active",
    appointment: {
      date: "2024-03-11T10:00:00",
      type: "Follow-up",
      status: "Pending", // Needs Doctor Action
    },
    painTrend: [6, 7, 8, 7, 8, 9],
    checkIns: [
      {
        date: "Dec 6",
        painLevel: 9,
        symptoms: ["fog", "fatigue", "widespread pain"],
        note: "Flare up started yesterday.",
        risk: "high",
      },
    ],
  },
  {
    id: "james-rod",
    name: "James Rodriguez",
    age: 55,
    condition: "Arthritis",
    risk: "Low",
    status: "Active",
    // No active appointment
    painTrend: [3, 4, 3, 2, 2, 2],
    checkIns: [],
  },
];