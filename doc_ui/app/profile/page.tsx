import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/dashboard"
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back to Dashboard
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dr. James Wilson
          </h1>
          <p className="text-gray-700">
            Senior Consultant – Pain Management
          </p>
          <p className="text-gray-600 text-sm mt-1">
            15+ years of clinical experience
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
          Active
        </span>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <span className="font-medium text-gray-700">Email:</span>{" "}
            james.wilson@hospital.com
          </p>
          <p>
            <span className="font-medium text-gray-700">Phone:</span>{" "}
            +91 98765 43210
          </p>
          <p>
            <span className="font-medium text-gray-700">Gender:</span>{" "}
            Male
          </p>
          <p>
            <span className="font-medium text-gray-700">Location:</span>{" "}
            Goa, India
          </p>
        </div>
      </div>

      {/* Professional Details */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Professional Details
        </h2>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium text-gray-700">
              Department:
            </span>{" "}
            Pain Management
          </p>
          <p>
            <span className="font-medium text-gray-700">
              Hospital:
            </span>{" "}
            City Care Medical Center
          </p>
          <p>
            <span className="font-medium text-gray-700">
              Qualifications:
            </span>{" "}
            MBBS, MD (Anesthesiology)
          </p>
          <p>
            <span className="font-medium text-gray-700">
              License No:
            </span>{" "}
            MED-IND-45821
          </p>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Availability
        </h2>

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium text-gray-700">
              Working Days:
            </span>{" "}
            Monday – Friday
          </p>
          <p>
            <span className="font-medium text-gray-700">
              Time:
            </span>{" "}
            10:00 AM – 6:00 PM
          </p>
          <p>
            <span className="font-medium text-gray-700">
              Consultation Mode:
            </span>{" "}
            In-person & Video
          </p>
        </div>
      </div>
    </div>
  );
}
