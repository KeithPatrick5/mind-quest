import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

interface MemoryGameLeaderboardProps {
  trackId: string;
  onClose: () => void;
}

export function MemoryGameLeaderboard({ trackId, onClose }: MemoryGameLeaderboardProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  
  const leaderboard = useQuery(api.memoryGame.getMemoryGameLeaderboard, {
    trackId: trackId as any,
    difficulty: selectedDifficulty,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Memory Game Leaderboard</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-center space-x-4">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedDifficulty === level
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((score, index) => (
                <div
                  key={score._id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? "bg-yellow-50 border-2 border-yellow-200" :
                    index === 1 ? "bg-gray-50 border-2 border-gray-200" :
                    index === 2 ? "bg-orange-50 border-2 border-orange-200" :
                    "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? "bg-yellow-400 text-yellow-900" :
                      index === 1 ? "bg-gray-300 text-gray-700" :
                      index === 2 ? "bg-orange-400 text-orange-900" :
                      "bg-gray-200 text-gray-600"
                    }`}>
                      {index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {score.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(score.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      {score.timeInSeconds}s
                    </div>
                    <div className="text-sm text-gray-500">
                      {score.turns} turns
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No scores yet for {selectedDifficulty} difficulty.
              Be the first to play!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
