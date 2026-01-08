type StatProps = {
  label: string;
  value: number;
  color: string;
};

function Stat({ label, value, color }: StatProps) {
  return (
    <div className={`border rounded-xl p-4 ${color}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Stat label="total appointments" value={6} color="bg-white" />
      <Stat
        label="appointments done"
        value={2}
        color="bg-green-50 border-green-300"
      />
      <Stat
        label="active appointments"
        value={4}
        color="bg-orange-50 border-orange-300"
      />
    </div>
  );
}
