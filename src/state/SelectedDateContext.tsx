import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type SelectedDateContextValue = {
  selectedDateKey: string;
  setSelectedDateKey: (dateKey: string) => void;
};

const SelectedDateContext = createContext<SelectedDateContextValue | null>(null);

function getTodayKey() {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
}

export function SelectedDateProvider({ children }: { children: ReactNode }) {
  const [selectedDateKey, setSelectedDateKey] = useState(getTodayKey);
  const value = useMemo(
    () => ({ selectedDateKey, setSelectedDateKey }),
    [selectedDateKey],
  );

  return <SelectedDateContext.Provider value={value}>{children}</SelectedDateContext.Provider>;
}

export function useSelectedDate() {
  const value = useContext(SelectedDateContext);

  if (!value) {
    throw new Error('useSelectedDate must be used inside SelectedDateProvider');
  }

  return value;
}
