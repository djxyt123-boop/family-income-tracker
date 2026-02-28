import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isFriday,
  getDay,
  addMonths,
  subMonths
} from 'date-fns';
import { AppState, MonthlyData, DayType } from '../types';
import { calculateSummary } from '../utils';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface DataEntryProps {
  state: AppState;
  updateMonthlyData: (monthId: string, data: MonthlyData) => void;
}

const DAY_TYPES: { type: DayType; label: string; color: string }[] = [
  { type: 'work', label: 'עבודה', color: 'bg-green-100 text-green-800 border-green-300' },
  { type: 'vacation', label: 'חופש', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { type: 'sick', label: 'מחלה', color: 'bg-red-100 text-red-800 border-red-300' },
  { type: 'none', label: 'ריק', color: 'bg-gray-50 text-gray-400 border-gray-200' },
];

export function DataEntry({ state, updateMonthlyData }: DataEntryProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activePerson, setActivePerson] = useState<'nachman' | 'mint'>('nachman');

  const monthId = format(currentDate, 'yyyy-MM');
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const currentData = state.monthlyData[monthId] ?? {
    monthId,
    nachman: { days: {}, calculations: 0, bonus: 0 },
    mint: { days: {}, calculations: 0, bonus: 0 }
  };

  const personData = currentData[activePerson];

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const toggleDayType = (dateStr: string) => {
    const currentType = personData.days[dateStr] || 'none';
    const currentIndex = DAY_TYPES.findIndex(d => d.type === currentType);
    const nextType = DAY_TYPES[(currentIndex + 1) % DAY_TYPES.length].type;

    const updatedDays = { ...personData.days };

    if (nextType === 'none') {
      delete updatedDays[dateStr];
    } else {
      updatedDays[dateStr] = nextType;
    }

    const newData = {
      ...currentData,
      [activePerson]: {
        ...personData,
        days: updatedDays
      }
    };

    updateMonthlyData(monthId, newData);
  };

  const handleCalculationsChange = (val: string) => {
    const newData = {
      ...currentData,
      [activePerson]: {
        ...personData,
        calculations: parseInt(val) || 0
      }
    };
    updateMonthlyData(monthId, newData);
  };

  const handleBonusChange = (val: string) => {
    const newData = {
      ...currentData,
      [activePerson]: {
        ...personData,
        bonus: parseInt(val) || 0
      }
    };
    updateMonthlyData(monthId, newData);
  };

  const summary = calculateSummary(activePerson, monthId, state);

  return (
    <div className="pb-24 max-w-md mx-auto p-4">

      {/* חודש */}
      <div className="flex items-center justify-between mb-6 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentDate, 'MM/yyyy')}
        </h2>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* בחירת אדם */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg ${activePerson === 'nachman' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActivePerson('nachman')}
        >
          נחמן
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg ${activePerson === 'mint' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActivePerson('mint')}
        >
          מינט
        </button>
      </div>

      {/* ימי שבוע */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-gray-500">
        <div>א'</div><div>ב'</div><div>ג'</div><div>ד'</div><div>ה'</div><div>ו'</div><div>ש'</div>
      </div>

      {/* יומן */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {Array.from({ length: getDay(monthStart) }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10" />
        ))}

        {daysInMonth.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const type = personData.days[dateStr] || 'none';
          const typeInfo = DAY_TYPES.find(d => d.type === type)!;
          const isFri = isFriday(day);

          return (
            <button
              key={dateStr}
              onClick={() => toggleDayType(dateStr)}
              className={`h-10 rounded-lg border flex items-center justify-center text-sm font-medium transition-colors
              ${typeInfo.color}
              ${isFri && type === 'none' ? 'bg-orange-50 border-orange-300' : ''}`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* סיכום נשאר כמו קודם */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div className="flex justify-between font-bold text-blue-900">
          <span>סה״כ משכורת:</span>
          <span>₪{summary.totalSalary.toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
}