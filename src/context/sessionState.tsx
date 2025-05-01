"use client";
import React, { createContext, ReactNode, useContext, useState } from 'react';

type TsessionState = {
  isLoggedIn: boolean | undefined;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

const SessionContext = createContext<TsessionState | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode; }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  return (
    <SessionContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): TsessionState => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};