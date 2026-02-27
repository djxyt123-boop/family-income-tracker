import { format, startOfMonth, endOfMonth, eachDayOfInterval, isFriday, parseISO, isSameMonth, subMonths } from 'date-fns';
import { AppState, MonthlyData, PersonMonthlyData, DayType } from './types';

export function calculateSummary(
  person: 'nachman' | 'mint',
  monthId: string, // YYYY-MM
  state: AppState
) {
  const settings = state.settings[person];
  const data = state.monthlyData[monthId]?.[person] || { days: {}, calculations: 0, bonus: 0 };
  
  const dailyRate = settings.baseSalary / settings.monthlyWorkDays;
  const fridayRate = settings.fridayRate;

  let workDays = 0;
  let fridayWorkDays = 0;
  let vacationDaysUsed = 0;
  let sickDaysUsed = 0;

  const monthStart = parseISO(`${monthId}-01`);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  daysInMonth.forEach(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const type = data.days[dateStr];
    
    if (type === 'work') {
      if (isFriday(day)) {
        fridayWorkDays++;
      } else {
        workDays++;
      }
    } else if (type === 'vacation') {
      vacationDaysUsed++;
    } else if (type === 'sick') {
      sickDaysUsed++;
    }
  });

  // Calculate salary
  // Base salary is fixed, but if they work more or less than monthlyWorkDays, how does it work?
  // The prompt says: "הזנת מספר ימי עבודה חודשיים לצורך חישוב אוטומטי של "תעריף יומי" (משכורת בסיס חלקי ימי עבודה)."
  // So salary = (workDays * dailyRate) + (fridayWorkDays * fridayRate) + bonus + (calculations * 20)
  const baseSalaryEarned = ((workDays + vacationDaysUsed + sickDaysUsed) * dailyRate) + (fridayWorkDays * fridayRate);
  const calculationsProfit = person === 'nachman' ? (data.calculations * 20) : 0;
  const totalSalary = baseSalaryEarned + calculationsProfit + data.bonus;

  // Calculate accumulated vacation and sick days
  const allMonths = Object.keys(state.monthlyData).sort();
  let currentVacation = settings.vacationDaysInitial;
  let currentSick = settings.sickDaysInitial;

  if (allMonths.length > 0) {
    const firstMonth = allMonths[0];
    if (monthId >= firstMonth) {
      const start = parseISO(`${firstMonth}-01`);
      const end = parseISO(`${monthId}-01`);
      const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
      
      currentVacation += diffMonths * settings.vacationDaysAccrual;
      currentSick += diffMonths * settings.sickDaysAccrual;

      for (const m of allMonths) {
        if (m > monthId) continue;
        const mData = state.monthlyData[m]?.[person];
        if (mData) {
          const mStart = parseISO(`${m}-01`);
          const mEnd = endOfMonth(mStart);
          const mDays = eachDayOfInterval({ start: mStart, end: mEnd });
          
          mDays.forEach(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const type = mData.days[dateStr];
            if (type === 'vacation') currentVacation--;
            if (type === 'sick') currentSick--;
          });
        }
      }
    } else {
      currentVacation += settings.vacationDaysAccrual;
      currentSick += settings.sickDaysAccrual;
    }
  } else {
    currentVacation += settings.vacationDaysAccrual;
    currentSick += settings.sickDaysAccrual;
  }

  return {
    workDays,
    fridayWorkDays,
    vacationDaysUsed,
    sickDaysUsed,
    baseSalaryEarned,
    calculationsProfit,
    bonus: data.bonus,
    totalSalary,
    currentVacation,
    currentSick,
    dailyRate
  };
}
