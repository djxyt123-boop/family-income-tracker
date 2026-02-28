import { format } from 'date-fns';
import { AppState } from '../types';
import { calculateSummary } from '../utils';

interface DashboardProps {
  state: AppState;
}

export function Dashboard({ state }: DashboardProps) {
  const monthId = format(new Date(), 'yyyy-MM');

  const nachmanSummary = calculateSummary('nachman', monthId, state);
  const mintSummary = calculateSummary('mint', monthId, state);

  const totalFamilySalary =
    nachmanSummary.totalSalary + mintSummary.totalSalary;

  const SalaryValue = ({ value }: { value: number }) => (
    <span className="font-semibold break-all text-left dir-ltr">
      ₪{value.toLocaleString()}
    </span>
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
        <div className="bg-white border rounded-xl p-4 shadow-sm break-words">
          <h2 className="text-lg font-bold mb-3 text-center">מינט</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>ימי עבודה:</span>
              <span>{mintSummary.workDays}</span>
            </div>

            <div className="flex justify-between">
              <span>ימי שישי:</span>
              <span>{mintSummary.fridayWorkDays}</span>
            </div>

            <div className="flex justify-between">
              <span>ימי חופש שנוצלו:</span>
              <span>{mintSummary.vacationDaysUsed}</span>
            </div>

            <div className="flex justify-between">
              <span>ימי מחלה שנוצלו:</span>
              <span>{mintSummary.sickDaysUsed}</span>
            </div>

            <div className="flex justify-between">
              <span>יתרת חופש:</span>
              <span>{mintSummary.currentVacation.toFixed(1)}</span>
            </div>

            <div className="flex justify-between">
              <span>יתרת מחלה:</span>
              <span>{mintSummary.currentSick.toFixed(1)}</span>
            </div>

            <div className="flex justify-between">
              <span>שכר בסיס:</span>
              <SalaryValue value={mintSummary.baseSalaryEarned} />
            </div>

            {mintSummary.bonus > 0 && (
              <div className="flex justify-between">
                <span>בונוס:</span>
                <SalaryValue value={mintSummary.bonus} />
              </div>
            )}

            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>סה״כ משכורת:</span>
              <SalaryValue value={mintSummary.totalSalary} />
            </div>
          </div>
        </div>

        {/* נחמן */}
        <div className="bg-white border rounded-xl p-4 shadow-sm break-words">
          <h2 className="text-lg font-bold mb-3 text-center">נחמן</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>ימי עבודה:</span>
              <span>{nachmanSummary.workDays}</span>
            </div>

            <div className="flex justify-between">
              <span>ימי שישי:</span>
              <span>{nachmanSummary.fridayWorkDays}</span>
            </div>

            <div className="flex justify-between">
              <span>ימי חופש שנוצלו:</span>
              <span>{nachmanSummary.vacationDaysUsed}</span>
            </div>

            <div className="flex justify-between">
              <span>ימי מחלה שנוצלו:</span>
              <span>{nachmanSummary.sickDaysUsed}</span>
            </div>

            <div className="flex justify-between">
              <span>יתרת חופש:</span>
              <span>{nachmanSummary.currentVacation.toFixed(1)}</span>
            </div>

            <div className="flex justify-between">
              <span>יתרת מחלה:</span>
              <span>{nachmanSummary.currentSick.toFixed(1)}</span>
            </div>

            <div className="flex justify-between">
              <span>שכר בסיס:</span>
              <SalaryValue value={nachmanSummary.baseSalaryEarned} />
            </div>

            <div className="flex justify-between">
              <span>רווח מחישובים:</span>
              <SalaryValue value={nachmanSummary.calculationsProfit} />
            </div>

            {nachmanSummary.bonus > 0 && (
              <div className="flex justify-between">
                <span>בונוס:</span>
                <SalaryValue value={nachmanSummary.bonus} />
              </div>
            )}

            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>סה״כ משכורת:</span>
              <SalaryValue value={nachmanSummary.totalSalary} />
            </div>
          </div>
        </div>

      </div>

      {/* סה"כ משפחתי */}
      <div className="mt-10 text-center">
        <h3 className="text-xl font-bold mb-2">
          סה"כ הכנסה משפחתית
        </h3>
        <div className="text-3xl font-bold text-blue-600 break-all dir-ltr">
          ₪{totalFamilySalary.toLocaleString()}
        </div>
      </div>

    </div>
  );
}