import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  
  const tracks = useQuery(api.tracks.getAllTracks);
  const createProfile = useMutation(api.profiles.createProfile);
  const seedData = useMutation(api.seedData.seedMentalHealthData);

  const handleCreateProfile = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    
    if (selectedTracks.length === 0) {
      toast.error("Please select at least one track");
      return;
    }

    try {
      await createProfile({
        username: username.trim(),
        selectedTracks: selectedTracks as any,
      });
      toast.success("Profile created successfully!");
    } catch (error) {
      toast.error("Failed to create profile");
    }
  };

  const handleSeedData = async () => {
    try {
      await seedData();
      toast.success("Sample data loaded!");
      setStep(2);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  if (step === 1) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-600 mb-4">Welcome to MindPath</h1>
            <p className="text-gray-600">Let's set up your mental health learning journey</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Step 1: Load Sample Data</h2>
            <p className="text-gray-600 mb-6">
              We'll load some sample mental health tracks and challenges to get you started.
            </p>
            <button
              onClick={handleSeedData}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Load Sample Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!tracks) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const categories = tracks.reduce((acc, track) => {
    if (!acc[track.category]) acc[track.category] = [];
    acc[track.category].push(track);
    return acc;
  }, {} as Record<string, typeof tracks>);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-4">Choose Your Learning Tracks</h1>
          <p className="text-gray-600">Select the mental health topics you'd like to learn about</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose a username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-6">
          {Object.entries(categories).map(([category, categoryTracks]) => (
            <div key={category} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
                {category} Disorders
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTracks.map((track) => (
                  <div
                    key={track._id}
                    onClick={() => {
                      if (selectedTracks.includes(track._id)) {
                        setSelectedTracks(selectedTracks.filter(id => id !== track._id));
                      } else {
                        setSelectedTracks([...selectedTracks, track._id]);
                      }
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTracks.includes(track._id)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full mb-2"
                      style={{ backgroundColor: track.color }}
                    ></div>
                    <h4 className="font-medium text-gray-800">{track.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{track.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {track.totalChallenges} challenges • {track.estimatedDays} days
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleCreateProfile}
            disabled={!username.trim() || selectedTracks.length === 0}
            className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start My Journey ({selectedTracks.length} tracks selected)
          </button>
        </div>
      </div>
    </div>
  );
}
