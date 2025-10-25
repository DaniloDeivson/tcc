import React from 'react';
import { DASHBOARD_TABS } from '@/constants/dashboard';

interface DashboardTabsProps {
  selected: string;
  onSelect: (value: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ selected, onSelect }) => {
  return (
    <div className="w-full max-w-[960px] px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row bg-[#1A3A1A] rounded-lg p-1 gap-1 sm:gap-2 border border-[#6B8A6B] shadow-lg">
        {DASHBOARD_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => onSelect(tab.value)}
            className={`flex-1 py-2 sm:py-2.5 transition-all duration-300 rounded-md text-center font-medium text-xs sm:text-sm border border-[#6B8A6B] hover-lift
              ${selected === tab.value
                ? 'bg-[#1A3A1A] text-white shadow-lg border-[#6B8A6B]'
                : 'bg-[#1A3A1A] text-[#B8D4B8] hover:bg-[#2A4A2A] hover:text-white'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardTabs;
