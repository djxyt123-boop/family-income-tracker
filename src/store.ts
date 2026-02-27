import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AppState, Settings, MonthlyData } from './types';
import { User } from 'firebase/auth';

const DEFAULT_SETTINGS: Settings = {
  nachman: {
    baseSalary: 10000,
    monthlyWorkDays: 20,
    fridayRate: 500,
    vacationDaysInitial: 0,
    sickDaysInitial: 0,
    vacationDaysAccrual: 1,
    sickDaysAccrual: 1.5,
  },
  mint: {
    baseSalary: 10000,
    monthlyWorkDays: 20,
    fridayRate: 500,
    vacationDaysInitial: 0,
    sickDaysInitial: 0,
    vacationDaysAccrual: 1,
    sickDaysAccrual: 1.5,
  }
};

const DEFAULT_STATE: AppState = {
  settings: DEFAULT_SETTINGS,
  monthlyData: {},
};

export function useStore(user: User | null) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const docRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setState(snapshot.data() as AppState);
      } else {
        await setDoc(docRef, DEFAULT_STATE);
      }

      setIsLoaded(true);
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (!user || !isLoaded) return;

    const saveData = async () => {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, state);
    };

    saveData();
  }, [state, user, isLoaded]);

  const updateSettings = (newSettings: Settings) => {
    setState(prev => ({ ...prev, settings: newSettings }));
  };

  const updateMonthlyData = (monthId: string, data: MonthlyData) => {
    setState(prev => ({
      ...prev,
      monthlyData: {
        ...prev.monthlyData,
        [monthId]: data,
      }
    }));
  };

  const restoreData = (data: AppState) => {
    setState(data);
  };

  return { state, updateSettings, updateMonthlyData, restoreData };
}