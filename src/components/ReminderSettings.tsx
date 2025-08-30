import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ReminderSettings {
  enabled: boolean;
  interval: number; // em minutos
  startTime: string;
  endTime: string;
  sound: boolean;
}

interface ReminderSettingsProps {
  settings: ReminderSettings;
  onUpdate: (settings: ReminderSettings) => void;
}

export function ReminderSettings({ settings, onUpdate }: ReminderSettingsProps) {
  const [formData, setFormData] = useState(settings);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    setFormData(settings);
    setPermission(Notification.permission);
  }, [settings]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        toast({
          title: "Notificações ativadas!",
          description: "Você receberá lembretes para beber água.",
        });
      } else {
        toast({
          title: "Permissão negada",
          description: "Habilite as notificações nas configurações do navegador.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    toast({
      title: "Configurações salvas!",
      description: "Seus lembretes foram atualizados.",
    });
  };

  const handleInputChange = (field: keyof ReminderSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="p-6 bg-card shadow-card border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-warning/20 rounded-full">
          <Bell className="h-6 w-6 text-warning animate-wave" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            Configurações de Lembrete
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure quando e como receber lembretes
          </p>
        </div>
      </div>

      {permission !== 'granted' && (
        <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-warning" />
            <div className="flex-1">
              <div className="font-medium text-warning-foreground">
                Permissão necessária
              </div>
              <div className="text-sm text-muted-foreground">
                Permita notificações para receber lembretes
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={requestNotificationPermission}
            >
              Permitir
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Ativar Lembretes</Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações regulares para beber água
            </p>
          </div>
          <Switch
            checked={formData.enabled}
            onCheckedChange={(checked) => handleInputChange('enabled', checked)}
          />
        </div>

        {formData.enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="interval">Intervalo (minutos)</Label>
              <Input
                id="interval"
                type="number"
                value={formData.interval}
                onChange={(e) => handleInputChange('interval', parseInt(e.target.value) || 60)}
                min="15"
                max="480"
                step="15"
              />
              <p className="text-xs text-muted-foreground">
                Frequência dos lembretes (15 min - 8 horas)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Início</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Fim</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Som da Notificação</Label>
                <p className="text-sm text-muted-foreground">
                  Reproduzir som ao receber lembrete
                </p>
              </div>
              <Switch
                checked={formData.sound}
                onCheckedChange={(checked) => handleInputChange('sound', checked)}
              />
            </div>
          </>
        )}

        <Button onClick={handleSave} className="w-full">
          Salvar Configurações
        </Button>
      </div>
    </Card>
  );
}