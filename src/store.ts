import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
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

    const docRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setState(snapshot.data() as AppState);
      } else {
        setDoc(docRef, DEFAULT_STATE);
        setState(DEFAULT_STATE);
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const saveState = async (newState: AppState) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, newState);
  };

  const updateSettings = (newSettings: Settings) => {
    const newState = {
      ...state,
      settings: newSettings
    };
    setState(newState);
    saveState(newState);
  };

  const updateMonthlyData = (monthId: string, data: MonthlyData) => {
    const newState = {
      ...state,
      monthlyData: {
        ...state.monthlyData,
        [monthId]: data
      }
    };
    setState(newState);
    saveState(newState);
  };

  const restoreData = (data: AppState) => {
    setState(data);
    saveState(data);
  };

  return { state, updateSettings, updateMonthlyData, restoreData, isLoaded };
}