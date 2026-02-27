import { useState } from 'react';
import { Settings as SettingsType, PersonSettings } from '../types';

interface SettingsProps {
  settings: SettingsType;
  updateSettings: (settings: SettingsType) => void;
}

export function Settings({ settings, updateSettings }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);

  const handleChange = (person: 'nachman' | 'mint', field: keyof PersonSettings, value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalSettings(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: numValue
      }
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    alert('ההגדרות נשמרו בהצלחה');
  };

  const renderPersonSettings = (person: 'nachman' | 'mint', title: string) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">משכורת בסיס חודשית (נטו)</label>
          <input
            type="number"
            value={localSettings[person].baseSalary || ''}
            onChange={(e) => handleChange(person, 'baseSalary', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dir="ltr"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">מספר ימי עבודה חודשיים (לחישוב יומית)</label>
          <input
            type="number"
            value={localSettings[person].monthlyWorkDays || ''}
            onChange={(e) => handleChange(person, 'monthlyWorkDays', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dir="ltr"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תעריף יום שישי</label>
          <input
            type="number"
            value={localSettings[person].fridayRate || ''}
            onChange={(e) => handleChange(person, 'fridayRate', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dir="ltr"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">יתרת ימי חופש התחלתית</label>
            <input
              type="number"
              value={localSettings[person].vacationDaysInitial || ''}
              onChange={(e) => handleChange(person, 'vacationDaysInitial', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">צבירת חופש חודשית</label>
            <input
              type="number"
              step="0.1"
              value={localSettings[person].vacationDaysAccrual || ''}
              onChange={(e) => handleChange(person, 'vacationDaysAccrual', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir="ltr"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">יתרת ימי מחלה התחלתית</label>
            <input
              type="number"
              value={localSettings[person].sickDaysInitial || ''}
              onChange={(e) => handleChange(person, 'sickDaysInitial', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">צבירת מחלה חודשית</label>
            <input
              type="number"
              step="0.1"
              value={localSettings[person].sickDaysAccrual || ''}
              onChange={(e) => handleChange(person, 'sickDaysAccrual', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir="ltr"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-24 max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">הגדרות בסיס</h2>
      {renderPersonSettings('nachman', 'הגדרות נחמן')}
      {renderPersonSettings('mint', 'הגדרות מינט')}
      
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-colors"
      >
        שמור הגדרות
      </button>
    </div>
  );
}
