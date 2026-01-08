type StatProps = {
  value: number;
  label: string;
  variant?: "default" | "success" | "warning";
};

function StatCard({ value, label, variant = "default" }: StatProps) {
  const styles =
    variant === "success"
      ? "bg-green-50 border-green-300 text-green-700"
      : variant === "warning"
      ? "bg-orange-50 border-orange-300 text-orange-700"
      : "bg-white border-gray-200 text-gray-700";

  return (
    <div
      className={`flex flex-col justify-center rounded-xl border p-5 min-w-[160px] ${styles}`}
    >
      <span className="text-2xl font-semibold">{value}</span>
      <span className="text-sm capitalize">{label}</span>
    </div>
  );
}

export default function DashboardStats() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">
        My patients
      </h2>

      <div className="flex gap-4 flex-wrap">
        <StatCard
          value={6}
          label="total appointments"
        />
        <StatCard
          value={2}
          label="appointments done"
          variant="success"
        />
        <StatCard
          value={4}
          label="active appointments"
          variant="warning"
        />
      </div>
    </div>
  );
}
