import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function ProfilePage() {
  const profile = useQuery(api.profiles.getCurrentProfile);
  const tracks = useQuery(api.tracks.getAllTracks);
  const updateSelectedTracks = useMutation(api.profiles.updateSelectedTracks);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  if (!profile || !tracks) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleEditTracks = () => {
    setSelectedTracks(profile.selectedTracks);
    setIsEditing(true);
  };

  const handleSaveTracks = async () => {
    try {
      await updateSelectedTracks({ trackIds: selectedTracks as any });
      setIsEditing(false);
      toast.success("Tracks updated successfully!");
    } catch (error) {
      toast.error("Failed to update tracks");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedTracks([]);
  };

  const toggleTrack = (trackId: string) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };

  const categories = tracks.reduce((acc, track) => {
    if (!acc[track.category]) acc[track.category] = [];
    acc[track.category].push(track);
    return acc;
  }, {} as Record<string, typeof tracks>);

  const joinedDate = new Date(profile.joinedAt).toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
            <p className="text-indigo-100">Member since {joinedDate}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Level {profile.level}</div>
            <div className="text-indigo-100">🔥 {profile.currentStreak} day streak</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-2">{profile.totalXp}</div>
          <div className="text-gray-600">Total XP</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{profile.currentStreak}</div>
          <div className="text-gray-600">Current Streak</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{profile.longestStreak}</div>
          <div className="text-gray-600">Longest Streak</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">{profile.selectedTracks.length}</div>
          <div className="text-gray-600">Active Tracks</div>
        </div>
      </div>

      {/* Selected Tracks */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Learning Tracks</h2>
          {!isEditing ? (
            <button
              onClick={handleEditTracks}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Edit Tracks
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSaveTracks}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks
              .filter(track => profile.selectedTracks.includes(track._id))
              .map((track) => (
                <div key={track._id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: track.color }}
                    ></div>
                    <h3 className="font-medium text-gray-800">{track.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{track.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {track.totalChallenges} challenges • {track.estimatedDays} days
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(categories).map(([category, categoryTracks]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
                  {category} Disorders
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTracks.map((track) => (
                    <div
                      key={track._id}
                      onClick={() => toggleTrack(track._id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTracks.includes(track._id)
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: track.color }}
                        ></div>
                        <h4 className="font-medium text-gray-800">{track.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{track.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {track.totalChallenges} challenges • {track.estimatedDays} days
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Learning Progress</h3>
        <div className="space-y-4">
          {tracks
            .filter(track => profile.selectedTracks.includes(track._id))
            .map((track) => (
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
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">30%</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
