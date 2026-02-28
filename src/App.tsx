import { useState } from 'react';
import { useStore } from './store';
import { useAuth } from './Auth';
import { Navigation } from './components/Navigation';
import { Settings } from './components/Settings';
import { DataEntry } from './components/DataEntry';
import { Dashboard } from './components/Dashboard';
import { ExportBackup } from './components/ExportBackup';

export default function App() {
  const { user, loading, login, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<'data' | 'dashboard' | 'settings' | 'export'>('data');

  const { state, updateSettings, updateMonthlyData, restoreData } = useStore(user);

  if (loading) {
    return <div className="p-10 text-center">טוען...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">התחבר עם Google</h1>
        <button
          onClick={login}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          התחברות
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans" dir="rtl">
      
      {/* 🔥 DEBUG INFO */}
      <div className="bg-yellow-100 p-2 text-sm text-black">
        <div>USER EMAIL: {user.email}</div>
        <div>USER UID: {user.uid}</div>
      </div>

      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 print:hidden flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-blue-900">
          מעקב הכנסות משפחתי
        </h1>
        <button
          onClick={logout}
          className="text-sm text-red-600"
        >
          התנתק
        </button>
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