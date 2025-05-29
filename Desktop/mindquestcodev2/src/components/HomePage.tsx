import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { ChallengeModal } from "./ChallengeModal";
import { MemoryGameModal } from "./MemoryGameModal";
import { MemoryGameLeaderboard } from "./MemoryGameLeaderboard";
import { ResponseTrainerModal } from "./ResponseTrainerModal";
import { toast } from "sonner";

export function HomePage() {
  const profile = useQuery(api.profiles.getCurrentProfile);
  const tracks = useQuery(api.tracks.getAllTracks);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const [showMemoryGame, setShowMemoryGame] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showResponseTrainer, setShowResponseTrainer] = useState(false);

  if (!profile || !tracks) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const selectedTracks = tracks.filter(track => 
    profile.selectedTracks.includes(track._id)
  );

  const handleStartChallenge = (trackId: string) => {
    setSelectedTrack(trackId);
    setShowChallenge(true);
  };

  const handleStartMemoryGame = (trackId: string) => {
    setSelectedTrack(trackId);
    setShowMemoryGame(true);
  };

  const handleShowLeaderboard = (trackId: string) => {
    setSelectedTrack(trackId);
    setShowLeaderboard(true);
  };

  const handleStartResponseTrainer = (trackId: string) => {
    setSelectedTrack(trackId);
    setShowResponseTrainer(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile.username}!</h1>
        <p className="text-indigo-100 mb-4">Ready to continue your mental health journey?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{profile.totalXp}</div>
            <div className="text-indigo-100">Total XP</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">🔥 {profile.currentStreak}</div>
            <div className="text-indigo-100">Day Streak</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">Level {profile.level}</div>
            <div className="text-indigo-100">Current Level</div>
          </div>
        </div>
      </div>

      {/* Today's Challenges */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedTracks.map((track) => (
            <TrackCard 
              key={track._id} 
              track={track} 
              onStartChallenge={() => handleStartChallenge(track._id)}
              onStartMemoryGame={() => handleStartMemoryGame(track._id)}
              onShowLeaderboard={() => handleShowLeaderboard(track._id)}
              onStartResponseTrainer={() => handleStartResponseTrainer(track._id)}
            />
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Progress</h3>
        <div className="space-y-4">
          {selectedTracks.map((track) => (
            <div key={track._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: track.color }}
                ></div>
                <span className="font-medium">{track.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: "30%" }} // This would be calculated based on actual progress
                  ></div>
                </div>
                <span className="text-sm text-gray-600">30%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Modal */}
      {showChallenge && selectedTrack && (
        <ChallengeModal
          trackId={selectedTrack}
          onClose={() => {
            setShowChallenge(false);
            setSelectedTrack(null);
          }}
        />
      )}

      {/* Memory Game Modal */}
      {showMemoryGame && selectedTrack && (
        <MemoryGameModal
          trackId={selectedTrack}
          onClose={() => {
            setShowMemoryGame(false);
            setSelectedTrack(null);
          }}
        />
      )}

      {/* Memory Game Leaderboard */}
      {showLeaderboard && selectedTrack && (
        <MemoryGameLeaderboard
          trackId={selectedTrack}
          onClose={() => {
            setShowLeaderboard(false);
            setSelectedTrack(null);
          }}
        />
      )}

      {/* Response Trainer Modal */}
      {showResponseTrainer && selectedTrack && (
        <ResponseTrainerModal
          trackId={selectedTrack}
          onClose={() => {
            setShowResponseTrainer(false);
            setSelectedTrack(null);
          }}
        />
      )}
    </div>
  );
}

function TrackCard({ 
  track, 
  onStartChallenge,
  onStartMemoryGame,
  onShowLeaderboard,
  onStartResponseTrainer
}: { 
  track: any;
  onStartChallenge: () => void;
  onStartMemoryGame: () => void;
  onShowLeaderboard: () => void;
  onStartResponseTrainer: () => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center space-x-3 mb-4">
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: track.color }}
        ></div>
        <h3 className="text-lg font-semibold text-gray-800">{track.name}</h3>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{track.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">Today's Challenge</span>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          +50 XP
        </span>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={onStartChallenge}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Start Challenge
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onStartMemoryGame}
            className="bg-purple-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
          >
            🧠 Memory
          </button>
          <button
            onClick={onStartResponseTrainer}
            className="bg-orange-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm"
          >
            💭 Responses
          </button>
          <button
            onClick={onShowLeaderboard}
            className="bg-green-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm col-span-2"
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
