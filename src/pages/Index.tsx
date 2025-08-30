import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WaterProgress } from "@/components/WaterProgress";
import { WaterIntakeButton } from "@/components/WaterIntakeButton";
import { UserProfile } from "@/components/UserProfile";
import { ReminderSettings } from "@/components/ReminderSettings";
import { useWaterTracker } from "@/hooks/useWaterTracker";
import { Droplets, User, Bell } from "lucide-react";

const Index = () => {
  const {
    userData,
    addWaterIntake,
    getTodayTotal,
    updateUserData,
    reminderSettings,
    updateReminderSettings
  } = useWaterTracker();

  const todayTotal = getTodayTotal();

  const waterAmounts = [
    { amount: 200, label: "Copo" },
    { amount: 330, label: "Lata" },
    { amount: 500, label: "Garrafa" },
    { amount: 750, label: "Garrafa G" },
  ];

  return (
    <div className="min-h-screen bg-gradient-water">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-primary rounded-full shadow-water">
              <Droplets className="h-8 w-8 text-primary-foreground animate-float" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Water Wise Pal
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Seu companheiro inteligente para uma hidratação saudável
          </p>
        </header>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard" className="gap-2">
              <Droplets className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="reminders" className="gap-2">
              <Bell className="h-4 w-4" />
              Lembretes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <WaterProgress consumed={todayTotal} goal={userData.goal} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {waterAmounts.map((item, index) => (
                <WaterIntakeButton
                  key={index}
                  amount={item.amount}
                  label={item.label}
                  onAdd={addWaterIntake}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile userData={userData} onUpdate={updateUserData} />
          </TabsContent>

          <TabsContent value="reminders">
            <ReminderSettings 
              settings={reminderSettings} 
              onUpdate={updateReminderSettings} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
