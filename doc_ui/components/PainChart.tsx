"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PainChart({ data }: { data: number[] }) {
  const chartData = data.map((v, i) => ({
    day: `Day ${i + 1}`,
    pain: v,
  }));

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="font-semibold mb-4">Pain Level Trend</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <XAxis dataKey="day" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="pain"
            stroke="#ef4444"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
