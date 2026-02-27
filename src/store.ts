import { useState, useEffect } from 'react';
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
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('familyIncomeState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse state', e);
      }
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem('familyIncomeState', JSON.stringify(state));
  }, [state]);

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
