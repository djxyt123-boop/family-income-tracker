import { useState } from 'react';
import { useStore } from './store';
import { Navigation } from './components/Navigation';
import { Settings } from './components/Settings';
import { DataEntry } from './components/DataEntry';
import { Dashboard } from './components/Dashboard';
import { ExportBackup } from './components/ExportBackup';

export default function App() {
  const { state, updateSettings, updateMonthlyData, restoreData } = useStore();
  const [currentTab, setCurrentTab] = useState('data');

  // 🔥 חשוב – לא מציג כלום עד שהנתונים נטענים מהענן
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        טוען נתונים...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans" dir="rtl">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-md mx-auto p-4 flex items-center justify-center">
          <h1 className="text-xl font-bold text-blue-900">
            מעקב הכנסות משפחתי
          </h1>
        </div>
      </header>

      <main className="min-h-screen">
        {currentTab === 'data' && (
          <DataEntry state={state} updateMonthlyData={updateMonthlyData} />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard state={state} />
        )}

        {currentTab === 'settings' && (
          <Settings
            settings={state.settings}
            updateSettings={updateSettings}
          />
        )}

        {currentTab === 'export' && (
          <ExportBackup
            state={state}
            restoreData={restoreData}
          />
        )}
      </main>

      <Navigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    </div>
  );
}