import React, { createContext, useContext, useState, useEffect } from 'react';

interface MaintenanceContextProps {
  isMaintenance: boolean;
  setMaintenance: (val: boolean) => void;
}

const MaintenanceContext = createContext<MaintenanceContextProps | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMaintenance, setMaintenance] = useState(false);

  // Manutenção desabilitada pois no plano gratuito do Render o spin up demora
  // e bloqueava a loja indevidamente.
  return (
    <MaintenanceContext.Provider value={{ isMaintenance, setMaintenance }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const ctx = useContext(MaintenanceContext);
  if (!ctx) throw new Error('useMaintenance must be used within MaintenanceProvider');
  return ctx;
};

function MaintenanceOverlay() {
  const { setMaintenance } = useMaintenance();
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const url = `${import.meta.env.VITE_API_URL || 'https://forja-backend-1.onrender.com'}/api/v1/health/ping`;
      // Use standard fetch here to avoid the interceptor loop, actually originalFetch isn't accessible here.
      // The interceptor will handle it! If it returns 200 OK, the interceptor sets isMaintenance = false.
      await fetch(url);
    } catch (e) {
      // still down
    } finally {
      setTimeout(() => setChecking(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 bg-[#0B0F19]/95 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center max-w-md text-center gap-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-2xl bg-gray-800 shadow-2xl flex items-center justify-center border-2 border-orange-500/30 relative">
          <img src="/images/logo.png" alt="Forja do Chico" className="w-16 h-16 object-contain z-10" />
          <div className="absolute inset-0 bg-orange-500/20 animate-ping rounded-2xl"></div>
        </div>
        
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Estamos forjando melhorias!</h1>
          <p className="text-gray-400 text-base leading-relaxed">
            O servidor está passando por uma atualização neste momento. 
            Nossas fornalhas estão a todo vapor para trazer novidades. Voltamos em instantes!
          </p>
        </div>
        
        <button 
          onClick={checkStatus}
          disabled={checking}
          className="mt-4 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"
        >
          {checking ? 'Verificando fornalhas...' : 'Tentar Novamente'}
        </button>
      </div>
    </div>
  );
}
