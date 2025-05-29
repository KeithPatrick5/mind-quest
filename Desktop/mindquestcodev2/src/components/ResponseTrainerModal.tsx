import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

interface ResponseTrainerModalProps {
  trackId: string;
  onClose: () => void;
}

interface Scenario {
  id: string;
  title: string;
  scenario: string;
  responses: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export function ResponseTrainerModal({ trackId, onClose }: ResponseTrainerModalProps) {
  const progress = useQuery(api.responseTrainer.getResponseTrainerProgress, { trackId: trackId as any });
  const stats = useQuery(api.responseTrainer.getResponseTrainerStats, { trackId: trackId as any });
  const submitResponse = useMutation(api.responseTrainer.submitResponse);
  
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameState, setGameState] = useState<"menu" | "playing">("menu");

  // Mock scenarios - in real app, these would come from the challenge content
  const scenarios: Scenario[] = [
    {
      id: "scenario_1",
      title: "Friend Cancels Plans",
      scenario: "Your friend cancels plans with you last minute, saying they're not feeling well. Your first thought is 'They probably just don't want to hang out with me.'",
      responses: [
        "Text them saying 'Fine, whatever. I guess I'm not important to you.'",
        "Assume they're lying and confront them about it.",
        "Accept their explanation and offer support, suggesting to reschedule when they feel better.",
        "Don't respond and avoid making plans with them in the future."
      ],
      correctIndex: 2,
      explanation: "The healthiest response shows empathy and understanding. Taking people at face value and offering support builds stronger relationships.",
      category: "Social Situations"
    },
    {
      id: "scenario_2",
      title: "Work Criticism",
      scenario: "Your boss gives you feedback on a project, pointing out several areas for improvement. You immediately think 'I'm terrible at my job and everyone knows it.'",
      responses: [
        "Argue with your boss about why their feedback is wrong.",
        "Thank them for the feedback and ask for specific suggestions on how to improve.",
        "Agree completely and apologize profusely for being incompetent.",
        "Ignore the feedback and assume they just don't like you."
      ],
      correctIndex: 1,
      explanation: "Constructive feedback is an opportunity for growth. The healthy response involves accepting feedback gracefully and seeking specific ways to improve.",
      category: "Work/Professional"
    },
    {
      id: "scenario_3",
      title: "Social Gathering Anxiety",
      scenario: "You're invited to a party but feel overwhelmed by the thought of socializing. You think 'I'll just bring everyone down if I go.'",
      responses: [
        "Force yourself to go and pretend to be happy the whole time.",
        "Don't go and don't tell anyone why you're not coming.",
        "Politely decline but suggest meeting the host for coffee one-on-one later.",
        "Go but leave immediately if you feel uncomfortable."
      ],
      correctIndex: 2,
      explanation: "It's important to honor your emotional needs while maintaining social connections. Suggesting an alternative that feels more manageable shows self-awareness.",
      category: "Social Situations"
    }
  ];

  const currentScenario = scenarios[currentScenarioIndex];
  const isLastScenario = currentScenarioIndex === scenarios.length - 1;

  const handleResponseSelect = async (responseIndex: number) => {
    if (showFeedback) return;
    
    setSelectedResponse(responseIndex);
    setShowFeedback(true);
    setIsSubmitting(true);

    const isCorrect = responseIndex === currentScenario.correctIndex;

    try {
      const result = await submitResponse({
        trackId: trackId as any,
        scenarioId: currentScenario.id,
        selectedResponse: responseIndex,
        isCorrect,
      });

      if (result.xpEarned > 0) {
        toast.success(`${isCorrect ? 'Correct!' : 'Good try!'} +${result.xpEarned} XP`);
      }
    } catch (error) {
      toast.error("Failed to save response");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextScenario = () => {
    if (isLastScenario) {
      setGameState("menu");
      setCurrentScenarioIndex(0);
    } else {
      setCurrentScenarioIndex(prev => prev + 1);
    }
    setSelectedResponse(null);
    setShowFeedback(false);
  };

  const startTraining = () => {
    setGameState("playing");
    setCurrentScenarioIndex(0);
    setSelectedResponse(null);
    setShowFeedback(false);
  };

  const getScenarioProgress = (scenarioId: string) => {
    if (!progress) return null;
    return progress.find(p => p.scenarioId === scenarioId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Response Trainer</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {gameState === "menu" && (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Practice choosing healthy responses to challenging situations. Build better coping strategies through realistic scenarios.
              </p>

              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalScenarios}</div>
                    <div className="text-sm text-blue-800">Scenarios Completed</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.correctResponses}</div>
                    <div className="text-sm text-green-800">Correct Responses</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(stats.accuracy)}%</div>
                    <div className="text-sm text-purple-800">Accuracy</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{stats.averageAttempts}</div>
                    <div className="text-sm text-orange-800">Avg. Attempts</div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Available Scenarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scenarios.map((scenario, index) => {
                    const scenarioProgress = getScenarioProgress(scenario.id);
                    return (
                      <div
                        key={scenario.id}
                        className={`p-4 border rounded-lg ${
                          scenarioProgress?.isCorrect 
                            ? "border-green-200 bg-green-50" 
                            : scenarioProgress 
                            ? "border-orange-200 bg-orange-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{scenario.title}</h4>
                          {scenarioProgress?.isCorrect && (
                            <span className="text-green-600 text-sm">✓ Completed</span>
                          )}
                          {scenarioProgress && !scenarioProgress.isCorrect && (
                            <span className="text-orange-600 text-sm">
                              {scenarioProgress.attempts} attempts
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{scenario.category}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{scenario.scenario}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={startTraining}
                className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-indigo-700"
              >
                Start Training
              </button>
            </div>
          )}

          {gameState === "playing" && currentScenario && (
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    Scenario {currentScenarioIndex + 1} of {scenarios.length}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {currentScenario.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-4">{currentScenario.title}</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-700">{currentScenario.scenario}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">How would you respond?</h4>
                <div className="space-y-3">
                  {currentScenario.responses.map((response, index) => (
                    <button
                      key={index}
                      onClick={() => handleResponseSelect(index)}
                      disabled={showFeedback || isSubmitting}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        selectedResponse === index
                          ? showFeedback
                            ? index === currentScenario.correctIndex
                              ? "border-green-500 bg-green-50"
                              : "border-red-500 bg-red-50"
                            : "border-indigo-500 bg-indigo-50"
                          : showFeedback && index === currentScenario.correctIndex
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="font-medium text-gray-500 mt-1">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="flex-1">{response}</span>
                        {showFeedback && index === currentScenario.correctIndex && (
                          <span className="text-green-600 font-medium">✓ Best Response</span>
                        )}
                        {showFeedback && selectedResponse === index && index !== currentScenario.correctIndex && (
                          <span className="text-red-600 font-medium">✗ Your Choice</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {showFeedback && (
                <div className="mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Explanation:</h5>
                    <p className="text-blue-700">{currentScenario.explanation}</p>
                  </div>
                </div>
              )}

              {showFeedback && (
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setGameState("menu")}
                    className="bg-gray-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-700"
                  >
                    Back to Menu
                  </button>
                  <button
                    onClick={handleNextScenario}
                    className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700"
                  >
                    {isLastScenario ? "Finish Training" : "Next Scenario"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
