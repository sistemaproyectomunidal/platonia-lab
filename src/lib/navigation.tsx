import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type NavContextType = {
  path: string;
  history: string[];
  go: (to: string, opts?: { replace?: boolean }) => void;
  back: () => void;
};

const NavContext = createContext<NavContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory((h) => (h[h.length - 1] === location.pathname ? h : [...h, location.pathname]));
     
  }, [location.pathname]);

  const go = (to: string, opts?: { replace?: boolean }) => navigate(to, { replace: !!opts?.replace });
  const back = () => {
    if (history.length > 1) {
      const prev = history[history.length - 2];
      navigate(prev);
      setHistory((h) => h.slice(0, -1));
    } else {
      navigate("/");
    }
  };

  const value = useMemo(() => ({ path: location.pathname, history, go, back }), [location.pathname, history]);

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
};

export const useNavigation = () => {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
};

export default NavContext;
