import { CheckIn } from "@/data/patients";

export default function RecentCheckIns({
  checkIns,
}: {
  checkIns: CheckIn[];
}) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-semibold mb-4">Recent Check-ins</h3>

      <div className="space-y-4">
        {checkIns.map((checkIn, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex justify-between items-start"
          >
            <div>
              <p className="text-sm font-medium">
                {checkIn.date}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Pain Level:{" "}
                <span className="font-semibold">
                  {checkIn.painLevel}/10
                </span>
              </p>

              <p className="text-sm text-gray-600">
                Symptoms:{" "}
                {checkIn.symptoms.length > 0
                  ? checkIn.symptoms.join(", ")
                  : "None"}
              </p>

              <p className="italic text-gray-500 mt-2">
                "{checkIn.note}"
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs ${
                checkIn.risk === "high"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {checkIn.risk}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
