"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PainChart({ data }: { data: number[] }) {
  // Generate labels based on data length (e.g., "Day 1", "Day 2"...)
  const labels = data.map((_, i) => `Day ${i + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Pain Level",
        data: data,
        borderColor: "rgb(37, 99, 235)", // Blue-600
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.4, // Smooth curves
        pointBackgroundColor: "rgb(37, 99, 235)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 13 },
        displayColors: false,
        callbacks: {
          label: (context: any) => `Pain Level: ${context.parsed.y}/10`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        grid: { display: true, color: "rgba(0, 0, 0, 0.05)" },
        ticks: { stepSize: 2, font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { display: false }, // Hide x-axis labels for cleaner look
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h3 className="font-bold text-slate-900">Pain Level Trend</h3>
           <p className="text-xs text-slate-500">Last 7 recorded entries</p>
        </div>
        <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
                {data.length > 0 ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1) : 0}
            </p>
            <p className="text-xs text-slate-500 font-medium uppercase">Avg. Pain</p>
        </div>
      </div>
      <div className="h-64 w-full">
        {data.length > 0 ? (
           <Line data={chartData} options={options} />
        ) : (
           <div className="h-full flex items-center justify-center text-slate-400 text-sm">
             No pain data recorded yet.
           </div>
        )}
      </div>
    </div>
  );
}