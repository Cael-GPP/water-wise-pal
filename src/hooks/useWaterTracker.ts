import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface WaterEntry {
  id: string;
  amount: number;
  timestamp: Date;
}

export interface UserData {
  name: string;
  weight: number;
  height: number;
  age: number;
  goal: number;
}

export interface ReminderSettings {
  enabled: boolean;
  interval: number;
  startTime: string;
  endTime: string;
  sound: boolean;
}

const DEFAULT_USER_DATA: UserData = {
  name: "",
  weight: 70,
  height: 170,
  age: 25,
  goal: 2.5
};

const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: true,
  interval: 120, // 2 horas
  startTime: "08:00",
  endTime: "22:00",
  sound: true
};

export function useWaterTracker() {
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('waterEntries');
    const savedUserData = localStorage.getItem('userData');
    const savedReminderSettings = localStorage.getItem('reminderSettings');

    if (savedEntries) {
      const entries = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setWaterEntries(entries);
    }

    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }

    if (savedReminderSettings) {
      setReminderSettings(JSON.parse(savedReminderSettings));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('waterEntries', JSON.stringify(waterEntries));
  }, [waterEntries]);

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('reminderSettings', JSON.stringify(reminderSettings));
  }, [reminderSettings]);

  // Set up reminders
  useEffect(() => {
    if (!reminderSettings.enabled) return;

    const now = new Date();
    const startTime = new Date();
    const endTime = new Date();
    
    const [startHour, startMinute] = reminderSettings.startTime.split(':').map(Number);
    const [endHour, endMinute] = reminderSettings.endTime.split(':').map(Number);
    
    startTime.setHours(startHour, startMinute, 0, 0);
    endTime.setHours(endHour, endMinute, 0, 0);

    if (now >= startTime && now <= endTime) {
      const interval = setInterval(() => {
        showReminderNotification();
      }, reminderSettings.interval * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [reminderSettings]);

  const showReminderNotification = () => {
    if (Notification.permission === 'granted') {
      const notification = new Notification('Hora de beber água! 💧', {
        body: 'Mantenha-se hidratado para uma vida mais saudável.',
        icon: '/placeholder.svg',
        badge: '/placeholder.svg'
      });

      if (reminderSettings.sound) {
        // Play a gentle notification sound
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcfAzuSz+Cxfi4FMH3D7+OMOggWaLjz3KhSEgp5neTrp1gTCFOi2+e4YRwCM4/E5t+LNgcCQ4D7rH8dBT+j6OOvZB8GSdXy0X0vCCqE0O/TgjEFFGmz6aVVEQpJnN3vnVwTCUdwruD8fmEGcvvq3QYEAAAA');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Silent fail
      }

      setTimeout(() => notification.close(), 5000);
    }

    toast({
      title: "Hora de beber água! 💧",
      description: "Mantenha-se hidratado para uma vida mais saudável.",
    });
  };

  const addWaterIntake = (amount: number) => {
    const newEntry: WaterEntry = {
      id: Date.now().toString(),
      amount: amount / 1000, // Convert ml to liters
      timestamp: new Date()
    };

    setWaterEntries(prev => [...prev, newEntry]);
    
    toast({
      title: "Água adicionada! 💧",
      description: `${amount}ml registrados com sucesso.`,
    });
  };

  const getTodayEntries = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return waterEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
  };

  const getTodayTotal = () => {
    return getTodayEntries().reduce((total, entry) => total + entry.amount, 0);
  };

  const updateUserData = (newData: UserData) => {
    setUserData(newData);
    toast({
      title: "Perfil atualizado!",
      description: "Seus dados foram salvos com sucesso.",
    });
  };

  const updateReminderSettings = (newSettings: ReminderSettings) => {
    setReminderSettings(newSettings);
  };

  return {
    waterEntries,
    userData,
    reminderSettings,
    addWaterIntake,
    getTodayEntries,
    getTodayTotal,
    updateUserData,
    updateReminderSettings,
  };
}