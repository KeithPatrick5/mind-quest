import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface MemoryGameModalProps {
  trackId: string;
  onClose: () => void;
}

interface Card {
  id: number;
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryGameModal({ trackId, onClose }: MemoryGameModalProps) {
  const gameData = useQuery(api.memoryGame.getMemoryGameAffirmations, { trackId: trackId as any });
  const userScores = useQuery(api.memoryGame.getMemoryGameScores, { trackId: trackId as any });
  const saveScore = useMutation(api.memoryGame.saveMemoryGameScore);
  
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [gameState, setGameState] = useState<"menu" | "playing" | "completed">("menu");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [turns, setTurns] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameTime, setGameTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === "playing" && startTime > 0) {
      interval = setInterval(() => {
        setGameTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, startTime]);

  const initializeGame = () => {
    if (!gameData) return;
    
    const pairCount = gameData.difficulties[difficulty].pairs;
    const selectedAffirmations = gameData.affirmations.slice(0, pairCount);
    
    // Create pairs of cards
    const cardPairs = selectedAffirmations.flatMap((affirmation: string, index: number) => [
      { id: index * 2, text: affirmation, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, text: affirmation, isFlipped: false, isMatched: false }
    ]);
    
    // Shuffle cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setTurns(0);
    setGameTime(0);
    setStartTime(Date.now());
    setGameState("playing");
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards.find(c => c.id === cardId)?.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update card flip state
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setTurns(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard?.text === secondCard?.text) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true }
              : card
          ));
          setFlippedCards([]);
          
          // Check if game is complete
          const updatedCards = cards.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true }
              : card
          );
          
          if (updatedCards.every(card => card.isMatched)) {
            setGameState("completed");
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleSaveScore = async () => {
    setIsSubmitting(true);
    try {
      const result = await saveScore({
        trackId: trackId as any,
        timeInSeconds: gameTime,
        turns,
        difficulty,
      });
      toast.success(`Game completed! +${result.xpEarned} XP`);
      setGameState("menu");
    } catch (error) {
      toast.error("Failed to save score");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!gameData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Memory Game</h2>
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
                Match pairs of positive affirmations to reinforce healthy thinking patterns!
              </p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Choose Difficulty</h3>
                <div className="flex justify-center space-x-4">
                  {(["easy", "medium", "hard"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        difficulty === level
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                      <div className="text-xs">
                        {gameData.difficulties[level].pairs} pairs
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {userScores && userScores.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Your Best Scores</h3>
                  <div className="space-y-2">
                    {userScores.slice(0, 3).map((score, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                        <span className="font-medium">{score.difficulty}</span>
                        <span>{score.timeInSeconds}s • {score.turns} turns</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={initializeGame}
                className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-indigo-700"
              >
                Start Game
              </button>
            </div>
          )}

          {gameState === "playing" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-semibold">
                  Time: {gameTime}s
                </div>
                <div className="text-lg font-semibold">
                  Turns: {turns}
                </div>
              </div>

              <div className={`grid gap-4 ${
                difficulty === "easy" ? "grid-cols-3" :
                difficulty === "medium" ? "grid-cols-4" : "grid-cols-4"
              }`}>
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`aspect-square rounded-lg border-2 cursor-pointer transition-all duration-300 flex items-center justify-center p-2 text-center ${
                      card.isFlipped || card.isMatched
                        ? "bg-indigo-100 border-indigo-500"
                        : "bg-gray-100 border-gray-300 hover:border-gray-400"
                    } ${card.isMatched ? "opacity-75" : ""}`}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <span className="text-sm font-medium text-indigo-800">
                        {card.text}
                      </span>
                    ) : (
                      <span className="text-2xl">🧠</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {gameState === "completed" && (
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-green-600 mb-4">
                  🎉 Congratulations!
                </h3>
                <div className="space-y-2 text-lg">
                  <p>Time: <span className="font-semibold">{gameTime} seconds</span></p>
                  <p>Turns: <span className="font-semibold">{turns}</span></p>
                  <p>Difficulty: <span className="font-semibold capitalize">{difficulty}</span></p>
                </div>
              </div>

              <div className="space-x-4">
                <button
                  onClick={handleSaveScore}
                  disabled={isSubmitting}
                  className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Score"}
                </button>
                <button
                  onClick={() => setGameState("menu")}
                  className="bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
