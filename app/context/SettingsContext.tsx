import React, { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  timeFormat: string;
  setTimeFormat: (format: string) => void;
  gpsEnabled: boolean;
  setGpsEnabled: (enabled: boolean) => void;
  companyLogo: string | null;
  setCompanyLogo: (logo: string | null) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [timeFormat, setTimeFormat] = useState("DD/MM/YYYY HH:mm");
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  return (
    <SettingsContext.Provider
      value={{
        timeFormat,
        setTimeFormat,
        gpsEnabled,
        setGpsEnabled,
        companyLogo,
        setCompanyLogo,
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
