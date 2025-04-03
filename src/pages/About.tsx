export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to Harmony.ai
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Your AI-powered workplace conflict resolution and meditation companion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Conflict Resolution
            </h2>
            <p className="text-gray-600">
              Our AI-powered chat system helps mediate workplace conflicts,
              providing a safe and constructive environment for resolution.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Guided Meditation
            </h2>
            <p className="text-gray-600">
              Experience personalized meditation sessions with our AI guide,
              helping you maintain mental clarity and emotional balance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Professional Growth
            </h2>
            <p className="text-gray-600">
              Learn valuable communication and conflict resolution skills that
              will benefit your professional development.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Workplace Harmony
            </h2>
            <p className="text-gray-600">
              Create a more harmonious workplace environment by addressing
              conflicts early and maintaining emotional well-being.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}