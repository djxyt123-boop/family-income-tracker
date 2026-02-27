import { CalendarDays, LayoutDashboard, Settings, Download } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export function Navigation({ currentTab, setCurrentTab }: NavigationProps) {
  const tabs = [
    { id: 'data', label: 'הזנת נתונים', icon: CalendarDays },
    { id: 'dashboard', label: 'דשבורד', icon: LayoutDashboard },
    { id: 'settings', label: 'הגדרות', icon: Settings },
    { id: 'export', label: 'ייצוא וגיבוי', icon: Download },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe print:hidden">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-blue-100' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
