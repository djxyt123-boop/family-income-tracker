export interface PersonSettings {
  baseSalary: number;
  monthlyWorkDays: number;
  fridayRate: number;
  vacationDaysInitial: number;
  sickDaysInitial: number;
  vacationDaysAccrual: number;
  sickDaysAccrual: number;
}

export interface Settings {
  nachman: PersonSettings;
  mint: PersonSettings;
}

export type DayType = 'work' | 'vacation' | 'sick' | 'none';

export interface PersonMonthlyData {
  days: Record<string, DayType>; // Key: YYYY-MM-DD
  calculations: number; // Nachman only
  bonus: number;
}

export interface MonthlyData {
  monthId: string; // YYYY-MM
  nachman: PersonMonthlyData;
  mint: PersonMonthlyData;
}

export interface AppState {
  settings: Settings;
  monthlyData: Record<string, MonthlyData>;
}
