import { Link } from 'react-router-dom';

interface UnresolvedConflict {
  id: number;
  title: string;
  participants: string[];
  lastActivity: string;
  priority: 'high' | 'medium' | 'low';
}

export default function Home() {
  const unresolvedConflicts: UnresolvedConflict[] = [
    {
      id: 1,
      title: "Project Timeline Dispute",
      participants: ["John Doe", "Jane Smith", "Mike Johnson"],
      lastActivity: "2 hours ago",
      priority: "high"
    },
    {
      id: 2,
      title: "Resource Allocation Issue",
      participants: ["Sarah Wilson", "Tom Brown"],
      lastActivity: "1 day ago",
      priority: "medium"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
              JD
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back, John Doe</h2>
              <p className="text-gray-600">Engineering Department • Senior Developer</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">Active Resolutions</h3>
              <p className="text-3xl font-bold text-indigo-600">3</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">Meditation Minutes</h3>
              <p className="text-3xl font-bold text-indigo-600">45</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">Resolution Rate</h3>
              <p className="text-3xl font-bold text-indigo-600">85%</p>
            </div>
          </div>
        </div>

        {/* Meditation Prompt */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow p-6 mb-8 text-white">
          <h3 className="text-xl font-semibold mb-2">Need a moment of peace?</h3>
          <p className="mb-4">Take a break and clear your mind with a guided meditation session.</p>
          <Link
            to="/meditation"
            className="inline-block bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Meditation
          </Link>
        </div>

        {/* Unresolved Conflicts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Unresolved Conflicts</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {unresolvedConflicts.map((conflict) => (
              <Link
                key={conflict.id}
                to={`/resolve?id=${conflict.id}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{conflict.title}</h4>
                      <div className="mt-1">
                        <span className="text-sm text-gray-500">
                          {conflict.participants.join(", ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">{conflict.lastActivity}</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          conflict.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : conflict.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {conflict.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}