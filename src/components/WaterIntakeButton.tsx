import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface WaterIntakeButtonProps {
  amount: number;
  label: string;
  onAdd: (amount: number) => void;
}

export function WaterIntakeButton({ amount, label, onAdd }: WaterIntakeButtonProps) {
  const handleClick = () => {
    onAdd(amount);
    
    // Create ripple effect
    const button = document.activeElement as HTMLElement;
    if (button) {
      const ripple = document.createElement('div');
      ripple.className = 'absolute inset-0 bg-primary/30 rounded-lg animate-ripple pointer-events-none';
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1500);
    }
  };

  return (
    <Card className="p-4 bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-water cursor-pointer border-border/50" 
          onClick={handleClick}>
      <div className="flex flex-col items-center gap-3">
        <div className="p-3 bg-gradient-primary rounded-full shadow-water">
          <Plus className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-card-foreground">
            {amount}ml
          </div>
          <div className="text-xs text-muted-foreground">
            {label}
          </div>
        </div>
      </div>
    </Card>
  );
}