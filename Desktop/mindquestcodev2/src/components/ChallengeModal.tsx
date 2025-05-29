import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { MemoryGameModal } from "./MemoryGameModal";

interface ChallengeModalProps {
  trackId: string;
  onClose: () => void;
}

export function ChallengeModal({ trackId, onClose }: ChallengeModalProps) {
  const profile = useQuery(api.profiles.getCurrentProfile);
  const challenge = useQuery(api.tracks.getTodaysChallenge, 
    profile ? { userId: profile.userId, trackId: trackId as any } : "skip"
  );
  const completeChallenge = useMutation(api.challenges.completeChallenge);
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [reframeText, setReframeText] = useState("");
  const [breathingComplete, setBreathingComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!challenge) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold mb-4">No Challenge Available</h2>
          <p className="text-gray-600 mb-6">
            You've completed all available challenges for this track. Great job!
          </p>
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      let score = undefined;
      
      if (challenge.type === "quiz" && selectedAnswer !== null) {
        score = selectedAnswer === challenge.content.correctAnswer ? 100 : 0;
      }
      
      const result = await completeChallenge({
        challengeId: challenge._id,
        score,
      });
      
      toast.success(`Challenge completed! +${result.xpEarned} XP`);
      onClose();
    } catch (error) {
      toast.error("Failed to complete challenge");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = () => {
    if (challenge.type === "quiz") return selectedAnswer !== null;
    if (challenge.type === "reframe") return reframeText.trim().length > 10;
    if (challenge.type === "breathing") return breathingComplete;
    if (challenge.type === "memory") return false; // Memory games are handled separately
    if (challenge.type === "response_trainer") return false; // Response trainer handled separately
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{challenge.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {challenge.type === "quiz" && (
            <QuizChallenge
              content={challenge.content}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={setSelectedAnswer}
            />
          )}

          {challenge.type === "reframe" && (
            <ReframeChallenge
              content={challenge.content}
              reframeText={reframeText}
              onReframeChange={setReframeText}
            />
          )}

          {challenge.type === "breathing" && (
            <BreathingChallenge
              content={challenge.content}
              onComplete={() => setBreathingComplete(true)}
              isComplete={breathingComplete}
            />
          )}

          {challenge.type === "memory" && (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                This is a memory game challenge! Click the button below to start playing.
              </p>
              <button
                onClick={() => {
                  onClose();
                  // The memory game will be opened from the HomePage
                }}
                className="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700"
              >
                🧠 Play Memory Game
              </button>
            </div>
          )}

          {challenge.type === "response_trainer" && (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Practice choosing healthy responses to challenging situations.
              </p>
              <button
                onClick={() => {
                  onClose();
                }}
                className="bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700"
              >
                💭 Start Response Training
              </button>
            </div>
          )}

          {challenge.type !== "memory" && challenge.type !== "response_trainer" && (
            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Reward: +{challenge.xpReward} XP
              </span>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit() || isSubmitting}
                className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Complete Challenge"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizChallenge({ 
  content, 
  selectedAnswer, 
  onAnswerSelect 
}: {
  content: any;
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{content.question}</h3>
      <div className="space-y-3">
        {content.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
              selectedAnswer === index
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedAnswer !== null && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">{content.explanation}</p>
        </div>
      )}
    </div>
  );
}

function ReframeChallenge({ 
  content, 
  reframeText, 
  onReframeChange 
}: {
  content: any;
  reframeText: string;
  onReframeChange: (text: string) => void;
}) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Scenario:</h3>
        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{content.scenario}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{content.prompt}</h3>
        <textarea
          value={reframeText}
          onChange={(e) => onReframeChange(e.target.value)}
          placeholder="Write your reframed thought here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-800 mb-2">Sample Reframe:</h4>
        <p className="text-green-700 text-sm">{content.sampleReframe}</p>
      </div>
    </div>
  );
}

function BreathingChallenge({ 
  content, 
  onComplete, 
  isComplete 
}: {
  content: any;
  onComplete: () => void;
  isComplete: boolean;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const startExercise = () => {
    setIsActive(true);
    setCurrentStep(0);
    
    // Simple breathing exercise simulation
    setTimeout(() => {
      setIsActive(false);
      onComplete();
    }, content.duration * 1000);
  };

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-4">{content.technique}</h3>
      
      <div className="mb-6">
        {content.instructions.map((instruction: string, index: number) => (
          <p key={index} className="text-gray-700 mb-2">{instruction}</p>
        ))}
      </div>

      {!isActive && !isComplete && (
        <button
          onClick={startExercise}
          className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700"
        >
          Start Breathing Exercise
        </button>
      )}

      {isActive && (
        <div className="py-8">
          <div className="w-32 h-32 mx-auto bg-blue-200 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-blue-800 font-medium">Breathe</span>
          </div>
          <p className="mt-4 text-gray-600">Follow the breathing pattern...</p>
        </div>
      )}

      {isComplete && (
        <div className="py-8">
          <div className="w-32 h-32 mx-auto bg-green-200 rounded-full flex items-center justify-center">
            <span className="text-green-800 text-2xl">✓</span>
          </div>
          <p className="mt-4 text-green-600 font-medium">Exercise completed!</p>
        </div>
      )}
    </div>
  );
}
