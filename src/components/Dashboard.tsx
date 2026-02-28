import { format } from 'date-fns';
import { AppState } from '../types';
import { calculateSummary } from '../utils';

interface DashboardProps {
  state: AppState;
}

export function Dashboard({ state }: DashboardProps) {
  const monthId = format(new Date(), 'yyyy-MM');

  const nachman = calculateSummary('nachman', monthId, state);
  const mint = calculateSummary('mint', monthId, state);

  const totalFamily = nachman.totalSalary + mint.totalSalary;

  const Row = ({ label, value }: { label: string; value: any }) => (
    <div className="py-1 text-sm">
      <div>{label}</div>
      <div className="dir-ltr break-words font-semibold">
        {typeof value === 'number' ? `₪${value.toLocaleString()}` : value}
      </div>
    </div>
  );

  const SalaryBlock = ({ value }: { value: number }) => (
    <div className="border-t mt-4 pt-3 text-center">
      <div className="font-bold mb-1">סה״כ משכורת:</div>
      <div className="text-xl font-bold text-blue-600 dir-ltr break-words">
        ₪{value.toLocaleString()}
      </div>
    </div>
  );

  return (
    <div className="pb-24 max-w-3xl mx-auto p-6 print:p-0">

      <h1 className="text-2xl font-bold text-center mb-2">
        דוח הכנסות משפחתי
      </h1>

      <div className="text-center text-gray-600 mb-6">
        חודש: {monthId}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">

        {/* מינט */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-bold mb-3 text-center">מינט</h2>

          <Row label="ימי עבודה:" value={mint.workDays} />
          <Row label="ימי שישי:" value={mint.fridayWorkDays} />
          <Row label="ימי חופש שנוצלו:" value={mint.vacationDaysUsed} />
          <Row label="ימי מחלה שנוצלו:" value={mint.sickDaysUsed} />
          <Row label="יתרת חופש:" value={mint.currentVacation.toFixed(1)} />
          <Row label="יתרת מחלה:" value={mint.currentSick.toFixed(1)} />
          <Row label="שכר בסיס:" value={mint.baseSalaryEarned} />

          {mint.bonus > 0 && (
            <Row label="בונוס:" value={mint.bonus} />
          )}

          <SalaryBlock value={mint.totalSalary} />
        </div>

        {/* נחמן */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-bold mb-3 text-center">נחמן</h2>

          <Row label="ימי עבודה:" value={nachman.workDays} />
          <Row label="ימי שישי:" value={nachman.fridayWorkDays} />
          <Row label="ימי חופש שנוצלו:" value={nachman.vacationDaysUsed} />
          <Row label="ימי מחלה שנוצלו:" value={nachman.sickDaysUsed} />
          <Row label="יתרת חופש:" value={nachman.currentVacation.toFixed(1)} />
          <Row label="יתרת מחלה:" value={nachman.currentSick.toFixed(1)} />
          <Row label="שכר בסיס:" value={nachman.baseSalaryEarned} />
          <Row label="רווח מחישובים:" value={nachman.calculationsProfit} />

          {nachman.bonus > 0 && (
            <Row label="בונוס:" value={nachman.bonus} />
          )}

          <SalaryBlock value={nachman.totalSalary} />
        </div>

      </div>

      <div className="mt-12 text-center">
        <div className="text-xl font-bold mb-2">
          סה"כ הכנסה משפחתית
        </div>
        <div className="text-3xl font-bold text-blue-600 dir-ltr break-words">
          ₪{totalFamily.toLocaleString()}
        </div>
      </div>

    </div>
  );
}