import { useState, useEffect } from "react";
import { StepTile } from "./StepTile";
import { Button } from "./ui/button";
import { Trophy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const gameSteps = {
  step_1: {
    true: ["in progress"],
    trap: ["build failed", "Dev went for sick"]
  },
  step_2: {
    true: ["in test"],
    trap: ["AC failed", "-7 out of 126 tests passed"]
  },
  step_3: {
    true: ["all test passed"],
    trap: ["not responsive", "works only on DEV machine"]
  },
  step_4: {
    true: ["PO Passed"],
    trap: ["AC Changed", "PO OOO"]
  },
  step_5: {
    true: ["in progress"],
    trap: ["build failed", "build failed successfully"]
  },
  step_6: {
    true: ["push to prod"],
    trap: ["hot fix needed", "deployed on Friday Error"]
  }
};

interface ShuffledStep {
  options: Array<{ text: string; isCorrect: boolean }>;
  revealed: boolean;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const GameBoard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [steps, setSteps] = useState<ShuffledStep[]>([]);

  const initializeGame = () => {
    const shuffledSteps = Object.entries(gameSteps).map(([_, step]) => {
      const trueOption = step.true[Math.floor(Math.random() * step.true.length)];
      
      // Pick 2 different trap options
      const shuffledTraps = shuffleArray([...step.trap]);
      const trap1 = shuffledTraps[0];
      const trap2 = shuffledTraps[1];
      
      const options = shuffleArray([
        { text: trueOption, isCorrect: true },
        { text: trap1, isCorrect: false },
        { text: trap2, isCorrect: false }
      ]);

      return {
        options,
        revealed: false
      };
    });

    setSteps(shuffledSteps);
    setCurrentStep(0);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleChoice = (stepIndex: number, optionIndex: number) => {
    if (stepIndex !== currentStep || gameOver) return;

    const selectedOption = steps[stepIndex].options[optionIndex];
    
    const newSteps = [...steps];
    newSteps[stepIndex].revealed = true;
    setSteps(newSteps);

    if (selectedOption.isCorrect) {
      toast.success("Success! Moving forward...", {
        description: selectedOption.text
      });

      if (stepIndex === steps.length - 1) {
        setWon(true);
        setGameOver(true);
        toast.success("🎉 Congratulations!", {
          description: "You've successfully pushed to production!"
        });
      } else {
        setTimeout(() => {
          setCurrentStep(stepIndex + 1);
        }, 500);
      }
    } else {
      toast.error("Oh no! Development blocked!", {
        description: selectedOption.text
      });
      setGameOver(true);
    }
  };

  const resetGame = () => {
    initializeGame();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
            Dev Journey
          </h1>
          <p className="text-muted-foreground text-lg">
            Navigate through the software development lifecycle
          </p>
        </header>

        <div className="space-y-6">
          {/* Start Tile */}
          <div className="flex justify-center animate-fade-in">
            <div className="bg-gradient-success rounded-xl p-6 shadow-card min-w-[200px] text-center">
              <p className="text-success-foreground font-semibold text-lg">
                Ready for Development
              </p>
            </div>
          </div>

          {/* Game Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <StepTile
                key={index}
                stepNumber={index + 1}
                options={step.options}
                isActive={index === currentStep && !gameOver}
                isLocked={index > currentStep}
                revealed={step.revealed}
                onChoice={(optionIndex) => handleChoice(index, optionIndex)}
              />
            ))}
          </div>

          {/* End Tile */}
          <div className="flex justify-center animate-fade-in">
            <div className={`rounded-xl p-6 shadow-card min-w-[200px] text-center transition-all ${
              won 
                ? "bg-gradient-success animate-scale-in" 
                : "bg-muted"
            }`}>
              <p className={`font-semibold text-lg ${
                won ? "text-success-foreground" : "text-muted-foreground"
              }`}>
                {won ? "🎉 Closed Successfully!" : "Closed"}
              </p>
            </div>
          </div>
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in z-50">
            <div className="bg-card rounded-2xl p-8 max-w-md w-full shadow-glow border border-border">
              <div className="text-center space-y-6">
                {won ? (
                  <>
                    <div className="flex justify-center">
                      <Trophy className="w-20 h-20 text-success animate-scale-in" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">
                      Victory!
                    </h2>
                    <p className="text-muted-foreground">
                      You've successfully navigated through all the development challenges and pushed to production!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4 animate-scale-in">💥</div>
                    <h2 className="text-3xl font-bold text-foreground">
                      Development Blocked!
                    </h2>
                    <p className="text-muted-foreground">
                      Better luck next time! Every developer faces obstacles.
                    </p>
                  </>
                )}
                <Button 
                  onClick={resetGame}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all"
                  size="lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Play Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
