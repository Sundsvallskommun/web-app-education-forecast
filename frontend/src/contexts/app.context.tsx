import { createContext, useContext, useState } from 'react';
interface AppProps {
  children: React.ReactNode;
}
export interface AppContextInterface {
  isCookieConsentOpen: boolean;
  setIsCookieConsentOpen: (isOpen: boolean) => void;

  setDefaults: () => void;
}

const AppContext = createContext<AppContextInterface>({
  isCookieConsentOpen: false,
  setIsCookieConsentOpen: () => ({}),
  setDefaults: () => ({}),
});

export function AppWrapper({ children }: AppProps) {
  const contextDefaults = {
    isCookieConsentOpen: true,
  };
  const setDefaults = () => {
    setIsCookieConsentOpen(contextDefaults.isCookieConsentOpen);
  };
  const [isCookieConsentOpen, setIsCookieConsentOpen] = useState(true);

  return (
    <AppContext.Provider
      value={{
        isCookieConsentOpen,
        setIsCookieConsentOpen: (isOpen: boolean) => setIsCookieConsentOpen(isOpen),

        setDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
