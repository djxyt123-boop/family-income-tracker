import { useState, useMemo } from 'react';
import { AppState } from '../types';
import { calculateSummary } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardProps {
  state: AppState;
}

export function Dashboard({ state }: DashboardProps) {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

  const chartData = useMemo(() => {
    const months = Object.keys(state.monthlyData).sort();
    
    if (viewMode === 'monthly') {
      return months.map(monthId => {
        const nachmanSummary = calculateSummary('nachman', monthId, state);
        const mintSummary = calculateSummary('mint', monthId, state);
        
        return {
          name: monthId,
          nachman: nachmanSummary.totalSalary,
          mint: mintSummary.totalSalary,
          total: nachmanSummary.totalSalary + mintSummary.totalSalary
        };
      });
    } else {
      const yearlyData: Record<string, any> = {};
      months.forEach(monthId => {
        const year = monthId.substring(0, 4);
        const nachmanSummary = calculateSummary('nachman', monthId, state);
        const mintSummary = calculateSummary('mint', monthId, state);
        
        if (!yearlyData[year]) {
          yearlyData[year] = { name: year, nachman: 0, mint: 0, total: 0 };
        }
        yearlyData[year].nachman += nachmanSummary.totalSalary;
        yearlyData[year].mint += mintSummary.totalSalary;
        yearlyData[year].total += nachmanSummary.totalSalary + mintSummary.totalSalary;
      });
      return Object.values(yearlyData);
    }
  }, [state, viewMode]);

  const metrics = useMemo(() => {
    const totalIncome = chartData.reduce((sum, d) => sum + d.total, 0);
    const monthsReported = Object.keys(state.monthlyData).length;
    const monthlyAverage = monthsReported > 0 ? totalIncome / monthsReported : 0;

    return { totalIncome, monthsReported, monthlyAverage };
  }, [chartData, state.monthlyData]);

  return (
    <div className="pb-24 max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">דשבורד וניתוח נתונים</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">סך הכנסות מצטבר</div>
          <div className="text-xl font-bold text-blue-600">₪{metrics.totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">ממוצע חודשי</div>
          <div className="text-xl font-bold text-green-600">₪{Math.round(metrics.monthlyAverage).toLocaleString()}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 col-span-2">
          <div className="text-sm text-gray-500 mb-1">חודשי דיווח</div>
          <div className="text-xl font-bold text-gray-800">{metrics.monthsReported} חודשים</div>
        </div>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${viewMode === 'monthly' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          onClick={() => setViewMode('monthly')}
        >
          תצוגה חודשית
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${viewMode === 'yearly' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          onClick={() => setViewMode('yearly')}
        >
          סיכום שנתי
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">השוואת הכנסות</h3>
        <div className="h-64" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} width={60} />
              <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="nachman" name="נחמן" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="mint" name="מינט" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">מגמת הכנסה משפחתית</h3>
        <div className="h-64" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} width={60} />
              <Tooltip cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="total" name="סה״כ הכנסה" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
