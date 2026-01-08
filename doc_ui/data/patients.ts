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
      {
        date: "Dec 4",
        painLevel: 5,
        symptoms: ["stiffness"],
        note: "Movement slightly painful.",
        risk: "high",
      },
      {
        date: "Dec 3",
        painLevel: 4,
        symptoms: ["mild pain"],
        note: "Manageable pain today.",
        risk: "low",
      },
      {
        date: "Dec 2",
        painLevel: 3,
        symptoms: [],
        note: "Feeling okay.",
        risk: "low",
      },
      {
        date: "Dec 1",
        painLevel: 4,
        symptoms: ["soreness"],
        note: "Some discomfort after walking.",
        risk: "low",
      },
    ],
  },
];
