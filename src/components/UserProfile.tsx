import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Settings, Save } from "lucide-react";
import { useState, useEffect } from "react";

interface UserData {
  name: string;
  weight: number;
  height: number;
  age: number;
  goal: number;
}

interface UserProfileProps {
  userData: UserData;
  onUpdate: (data: UserData) => void;
}

export function UserProfile({ userData, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const calculateWaterGoal = (weight: number, height: number, age: number) => {
    // Fórmula básica: 35ml por kg de peso corporal + ajustes por idade
    const baseAmount = weight * 35;
    const ageAdjustment = age > 65 ? -200 : age < 18 ? 200 : 0;
    return Math.max((baseAmount + ageAdjustment) / 1000, 1.5); // Mínimo 1.5L
  };

  const handleSave = () => {
    const calculatedGoal = calculateWaterGoal(formData.weight, formData.height, formData.age);
    const updatedData = { ...formData, goal: calculatedGoal };
    onUpdate(updatedData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'name' ? value : parseFloat(value) || 0
    }));
  };

  return (
    <Card className="p-6 bg-card shadow-card border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary rounded-full">
            <User className="h-6 w-6 text-secondary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">
              Perfil do Usuário
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure seus dados para cálculo personalizado
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
          {isEditing ? 'Salvar' : 'Editar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={!isEditing}
            placeholder="Seu nome"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Idade (anos)</Label>
          <Input
            id="age"
            type="number"
            value={formData.age || ''}
            onChange={(e) => handleInputChange('age', e.target.value)}
            disabled={!isEditing}
            placeholder="25"
            min="1"
            max="120"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight || ''}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            disabled={!isEditing}
            placeholder="70"
            min="20"
            max="300"
            step="0.1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Altura (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height || ''}
            onChange={(e) => handleInputChange('height', e.target.value)}
            disabled={!isEditing}
            placeholder="170"
            min="100"
            max="250"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-card-foreground">
              Meta Diária Recomendada
            </div>
            <div className="text-sm text-muted-foreground">
              Baseada em seus dados pessoais
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">
            {formData.goal ? formData.goal.toFixed(1) : '0.0'}L
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            Salvar Alterações
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setFormData(userData);
              setIsEditing(false);
            }}
          >
            Cancelar
          </Button>
        </div>
      )}
    </Card>
  );
}