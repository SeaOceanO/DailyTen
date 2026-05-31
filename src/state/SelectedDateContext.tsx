import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AppState } from 'react-native';

type SelectedDateContextValue = {
  currentDateKey: string;
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
  const initialDateKey = useMemo(() => getTodayKey(), []);
  const currentDateKeyRef = useRef(initialDateKey);
  const selectedDateKeyRef = useRef(initialDateKey);
  const [currentDateKey, setCurrentDateKey] = useState(initialDateKey);
  const [selectedDateKey, setSelectedDateKeyState] = useState(initialDateKey);

  const setSelectedDateKey = useCallback((dateKey: string) => {
    selectedDateKeyRef.current = dateKey;
    setSelectedDateKeyState(dateKey);
  }, []);

  useEffect(() => {
    function refreshCurrentDate() {
      const nextDateKey = getTodayKey();
      const previousDateKey = currentDateKeyRef.current;

      if (nextDateKey === previousDateKey) {
        return;
      }

      currentDateKeyRef.current = nextDateKey;
      setCurrentDateKey(nextDateKey);

      if (selectedDateKeyRef.current === previousDateKey) {
        selectedDateKeyRef.current = nextDateKey;
        setSelectedDateKeyState(nextDateKey);
      }
    }

    refreshCurrentDate();

    const intervalId = setInterval(refreshCurrentDate, 60000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refreshCurrentDate();
      }
    });

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, []);

  const value = useMemo(
    () => ({ currentDateKey, selectedDateKey, setSelectedDateKey }),
    [currentDateKey, selectedDateKey, setSelectedDateKey],
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
