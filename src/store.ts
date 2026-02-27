import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AppState, Settings, MonthlyData } from './types';

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

export function useStore() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // טעינה ראשונית מהענן
  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = doc(db, "appState", "mainData");
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setState(snapshot.data() as AppState);
        } else {
          await setDoc(docRef, DEFAULT_STATE);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // שמירה לענן רק אחרי שהטעינה הסתיימה
  useEffect(() => {
    if (!isLoaded) return;

    const saveData = async () => {
      try {
        const docRef = doc(db, "appState", "mainData");
        await setDoc(docRef, state);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    saveData();
  }, [state, isLoaded]);

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