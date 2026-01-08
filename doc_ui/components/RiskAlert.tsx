export default function RiskAlert() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-red-600 text-lg">⚠</span>
        <h3 className="font-semibold text-red-600">
          Risk Alert Explanation
        </h3>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex items-start gap-3">
          <span>📈</span>
          <p>
            <strong>Pain Trend:</strong> Significant increase
            (4 → 7 over last 2 days)
          </p>
        </div>

        <div className="flex items-start gap-3">
          <span>⚠</span>
          <p>
            <strong>New Symptom:</strong> Difficulty moving
          </p>
        </div>

        <div className="flex items-start gap-3">
          <span>🎙</span>
          <p>
            <strong>Voice Analysis:</strong> Stressed, negative tone
          </p>
        </div>

        <div>
          <p className="font-semibold mb-2">Keywords Detected</p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
              sharp pain
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs">
              barely slept
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
