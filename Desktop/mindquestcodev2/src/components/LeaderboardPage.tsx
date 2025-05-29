import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function LeaderboardPage() {
  const leaderboard = useQuery(api.profiles.getLeaderboard);
  const currentProfile = useQuery(api.profiles.getCurrentProfile);

  if (!leaderboard || !currentProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const currentUserRank = leaderboard.findIndex(profile => profile.userId === currentProfile.userId) + 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🏆 Leaderboard</h1>
        <p className="text-gray-600">See how you rank among other mental health learners</p>
      </div>

      {/* Current User Rank */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-6 mb-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Your Rank</h2>
          <div className="text-4xl font-bold mb-2">#{currentUserRank}</div>
          <p className="text-indigo-100">
            {currentProfile.totalXp} XP • Level {currentProfile.level} • 🔥 {currentProfile.currentStreak} streak
          </p>
        </div>
      </div>

      {/* Top Rankings */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Top Learners</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {leaderboard.slice(0, 50).map((profile, index) => (
            <div
              key={profile._id}
              className={`px-6 py-4 flex items-center justify-between ${
                profile.userId === currentProfile.userId ? "bg-indigo-50" : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? "bg-yellow-400 text-yellow-900" :
                  index === 1 ? "bg-gray-300 text-gray-700" :
                  index === 2 ? "bg-orange-400 text-orange-900" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1}
                </div>
                
                <div>
                  <div className="font-medium text-gray-800">
                    {profile.username}
                    {profile.userId === currentProfile.userId && (
                      <span className="ml-2 text-indigo-600 text-sm">(You)</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Level {profile.level} • 🔥 {profile.currentStreak} day streak
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-800">{profile.totalXp} XP</div>
                <div className="text-sm text-gray-500">
                  {profile.selectedTracks.length} tracks
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-2xl font-bold text-indigo-600 mb-2">
            {leaderboard.length}
          </div>
          <div className="text-gray-600">Total Learners</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {Math.max(...leaderboard.map(p => p.currentStreak))}
          </div>
          <div className="text-gray-600">Longest Streak</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {Math.max(...leaderboard.map(p => p.level))}
          </div>
          <div className="text-gray-600">Highest Level</div>
        </div>
      </div>
    </div>
  );
}
