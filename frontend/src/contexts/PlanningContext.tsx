import React, { createContext, useContext, useState } from 'react';

export type FinancialYear = '2025_26' | '2026_27';

interface PlanningContextType {
  financialYear: FinancialYear;
  setFinancialYear: (fy: FinancialYear) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const PlanningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [financialYear, setFinancialYear] = useState<FinancialYear>('2025_26');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PlanningContext.Provider value={{ financialYear, setFinancialYear, searchQuery, setSearchQuery }}>
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
};
