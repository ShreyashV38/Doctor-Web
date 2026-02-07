export type CheckIn = {
  date: string;
  painLevel: number;
  symptoms: string[];
  note: string;
  risk: "low" | "high";
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  condition: string;
  risk: "Low" | "High";
  status: "Active" | "Recovered" | "Critical";
  nextAppointment?: string; // ISO string for sorting
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
    nextAppointment: "2024-03-10T09:00:00",
    painTrend: [4, 3, 4, 5, 6, 7],
    checkIns: [
      {
        date: "Dec 6",
        painLevel: 7,
        symptoms: ["sleep issues", "difficulty moving"],
        note: "Had sharp pain. Barely slept.",
        risk: "high",
      },
      {
        date: "Dec 5",
        painLevel: 6,
        symptoms: ["fatigue"],
        note: "Pain increasing slowly.",
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
    nextAppointment: "2024-03-10T14:30:00",
    painTrend: [5, 5, 4, 4, 3, 3],
    checkIns: [
      {
        date: "Dec 6",
        painLevel: 3,
        symptoms: [],
        note: "Feeling much better after PT.",
        risk: "low",
      },
    ],
  },
  {
    id: "emma-wilson",
    name: "Emma Wilson",
    age: 35,
    condition: "Fibromyalgia",
    risk: "High",
    status: "Active",
    nextAppointment: "2024-03-11T10:00:00",
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
    nextAppointment: "2024-03-12T11:00:00",
    painTrend: [3, 4, 3, 2, 2, 2],
    checkIns: [],
  },
];