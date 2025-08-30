import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Droplets } from "lucide-react";

interface WaterProgressProps {
  consumed: number;
  goal: number;
}

export function WaterProgress({ consumed, goal }: WaterProgressProps) {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  
  return (
    <Card className="p-6 bg-gradient-water shadow-card border-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-full">
            <Droplets className="h-6 w-6 text-primary animate-float" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">
              Progresso Diário
            </h2>
            <p className="text-sm text-muted-foreground">
              {consumed.toFixed(1)}L de {goal.toFixed(1)}L
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {percentage.toFixed(0)}%
          </div>
          <div className="text-xs text-muted-foreground">
            {remaining > 0 ? `${remaining.toFixed(1)}L restante` : 'Meta atingida!'}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Progress value={percentage} className="h-3 bg-background/50" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0L</span>
          <span>{goal.toFixed(1)}L</span>
        </div>
      </div>
    </Card>
  );
}