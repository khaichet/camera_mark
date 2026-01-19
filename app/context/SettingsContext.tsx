import React, { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  timeFormat: string;
  setTimeFormat: (format: string) => void;
  gpsEnabled: boolean;
  setGpsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [timeFormat, setTimeFormat] = useState("DD/MM/YYYY HH:mm");
  const [gpsEnabled, setGpsEnabled] = useState(true);

  return (
    <SettingsContext.Provider
      value={{
        timeFormat,
        setTimeFormat,
        gpsEnabled,
        setGpsEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
