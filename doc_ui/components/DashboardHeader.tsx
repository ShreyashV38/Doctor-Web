export default function DashboardHeader() {
  return (
    <div className="bg-white rounded-xl border p-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">Doctor’s Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage patients and doctor assignments
        </p>
      </div>

      <button className="w-8 h-8 rounded-full bg-red-500 text-white font-bold">
        ×
      </button>
    </div>
  );
}
