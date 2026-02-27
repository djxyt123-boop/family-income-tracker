import React, { useState } from 'react';
import { AppState } from '../types';
import { calculateSummary } from '../utils';
import { format } from 'date-fns';
import { FileDown, FileUp, Printer } from 'lucide-react';

interface ExportBackupProps {
  state: AppState;
  restoreData: (data: AppState) => void;
}

export function ExportBackup({ state, restoreData }: ExportBackupProps) {
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));

  const handleExportJson = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-income-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data && data.settings && data.monthlyData) {
          restoreData(data);
          alert('הנתונים שוחזרו בהצלחה!');
        } else {
          alert('קובץ לא תקין. אנא בחר קובץ גיבוי מתאים.');
        }
      } catch (error) {
        alert('שגיאה בקריאת הקובץ.');
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  const nachmanSummary = calculateSummary('nachman', currentMonth, state);
  const mintSummary = calculateSummary('mint', currentMonth, state);

  return (
    <div className="pb-24 max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 print:hidden">ייצוא וגיבוי</h2>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 print:hidden">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">דוח חודשי להדפסה (PDF)</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">בחר חודש</label>
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dir="ltr"
          />
        </div>
        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-colors"
        >
          <Printer className="w-5 h-5" />
          הדפס דוח / שמור כ-PDF
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 print:hidden">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">גיבוי ושחזור נתונים</h3>
        <div className="space-y-4">
          <button
            onClick={handleExportJson}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-colors"
          >
            <FileDown className="w-5 h-5" />
            ייצא גיבוי (JSON)
          </button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl border border-gray-300 transition-colors">
              <FileUp className="w-5 h-5" />
              שחזר מגיבוי (JSON)
            </div>
          </div>
        </div>
      </div>

      {/* Print View */}
      <div className="hidden print:block print:p-8 print:bg-white">
        <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">דוח הכנסות משפחתי</h1>
          <h2 className="text-xl text-gray-600 mt-2">חודש: {currentMonth}</h2>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Nachman Print Summary */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">נחמן</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span>ימי עבודה:</span><span className="font-semibold">{nachmanSummary.workDays}</span></div>
              <div className="flex justify-between"><span>ימי שישי:</span><span className="font-semibold">{nachmanSummary.fridayWorkDays}</span></div>
              <div className="flex justify-between"><span>ימי חופש שנוצלו:</span><span className="font-semibold">{nachmanSummary.vacationDaysUsed}</span></div>
              <div className="flex justify-between"><span>ימי מחלה שנוצלו:</span><span className="font-semibold">{nachmanSummary.sickDaysUsed}</span></div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between"><span>יתרת חופש:</span><span className="font-semibold">{nachmanSummary.currentVacation.toFixed(1)}</span></div>
              <div className="flex justify-between"><span>יתרת מחלה:</span><span className="font-semibold">{nachmanSummary.currentSick.toFixed(1)}</span></div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between"><span>שכר בסיס:</span><span className="font-semibold">₪{nachmanSummary.baseSalaryEarned.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>רווח מחישובים:</span><span className="font-semibold">₪{nachmanSummary.calculationsProfit.toLocaleString()}</span></div>
              {nachmanSummary.bonus > 0 && <div className="flex justify-between"><span>בונוס:</span><span className="font-semibold">₪{nachmanSummary.bonus.toLocaleString()}</span></div>}
              <div className="flex justify-between text-lg font-bold text-gray-900 mt-2 pt-2 border-t border-gray-300">
                <span>סה״כ משכורת:</span>
                <span>₪{nachmanSummary.totalSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Mint Print Summary */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">מינט</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between"><span>ימי עבודה:</span><span className="font-semibold">{mintSummary.workDays}</span></div>
              <div className="flex justify-between"><span>ימי שישי:</span><span className="font-semibold">{mintSummary.fridayWorkDays}</span></div>
              <div className="flex justify-between"><span>ימי חופש שנוצלו:</span><span className="font-semibold">{mintSummary.vacationDaysUsed}</span></div>
              <div className="flex justify-between"><span>ימי מחלה שנוצלו:</span><span className="font-semibold">{mintSummary.sickDaysUsed}</span></div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between"><span>יתרת חופש:</span><span className="font-semibold">{mintSummary.currentVacation.toFixed(1)}</span></div>
              <div className="flex justify-between"><span>יתרת מחלה:</span><span className="font-semibold">{mintSummary.currentSick.toFixed(1)}</span></div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between"><span>שכר בסיס:</span><span className="font-semibold">₪{mintSummary.baseSalaryEarned.toLocaleString()}</span></div>
              {mintSummary.bonus > 0 && <div className="flex justify-between"><span>בונוס:</span><span className="font-semibold">₪{mintSummary.bonus.toLocaleString()}</span></div>}
              <div className="flex justify-between text-lg font-bold text-gray-900 mt-2 pt-2 border-t border-gray-300">
                <span>סה״כ משכורת:</span>
                <span>₪{mintSummary.totalSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">סה״כ הכנסה משפחתית</h3>
          <div className="text-4xl font-black text-blue-600">
            ₪{(nachmanSummary.totalSalary + mintSummary.totalSalary).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
