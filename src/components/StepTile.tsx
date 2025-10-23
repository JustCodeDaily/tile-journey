import { Lock } from "lucide-react";
import { Button } from "./ui/button";

interface StepOption {
  text: string;
  isCorrect: boolean;
}

interface StepTileProps {
  stepNumber: number;
  options: StepOption[];
  isActive: boolean;
  isLocked: boolean;
  revealed: boolean;
  onChoice: (optionIndex: number) => void;
}

export const StepTile = ({
  stepNumber,
  options,
  isActive,
  isLocked,
  revealed,
  onChoice
}: StepTileProps) => {
  return (
    <div className={`
      transition-all duration-500 animate-fade-in
      ${isLocked ? "opacity-40" : "opacity-100"}
    `}>
      <div className="flex items-center justify-center gap-4 md:gap-6">
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold
          ${isActive 
            ? "border-primary bg-primary/10 text-primary animate-pulse" 
            : isLocked
            ? "border-muted text-muted-foreground"
            : "border-accent text-accent"
          }
        `}>
          {stepNumber}
        </div>

        <div className="flex-1 max-w-2xl">
          <div className={`
            bg-card rounded-xl p-4 md:p-6 shadow-card border
            ${isActive ? "border-primary shadow-glow" : "border-border"}
          `}>
            {isLocked ? (
              <div className="flex items-center justify-center gap-3 text-muted-foreground py-4">
                <Lock className="w-5 h-5" />
                <span className="font-medium">Locked</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => onChoice(index)}
                    disabled={!isActive || revealed}
                    variant={
                      revealed
                        ? option.isCorrect
                          ? "default"
                          : "destructive"
                        : "secondary"
                    }
                    className={`
                      h-auto py-4 px-6 text-left whitespace-normal transition-all
                      ${revealed && option.isCorrect && "bg-gradient-success hover:bg-gradient-success"}
                      ${revealed && !option.isCorrect && "bg-gradient-danger hover:bg-gradient-danger"}
                      ${!revealed && isActive && "hover:shadow-glow hover:scale-105"}
                    `}
                  >
                    {revealed ? option.text : "???"}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
