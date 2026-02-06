
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { FDForm, FDTracker } from './components/Investments';
import { InvestmentsView } from './components/InvestmentsView';
import { MarketsView } from './components/MarketsView';
import { api } from './services/api';
import { User, FixedDeposit } from './types';
import { ICONS } from './constants';

type ViewType = 'dashboard' | 'investments' | 'markets';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isFDFormOpen, setIsFDFormOpen] = useState(false);
  const [selectedFD, setSelectedFD] = useState<FixedDeposit | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const activeUser = api.getCurrentUser();
    if (activeUser) setUser(activeUser);
  }, []);

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

  if (!user) {
    return <Auth onSuccess={setUser} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'investments':
        return (
          <InvestmentsView 
            userId={user.id} 
            onViewFD={setSelectedFD} 
            onCreateFD={() => setIsFDFormOpen(true)}
            refreshTrigger={refreshTrigger}
          />
        );
      case 'markets':
        return <MarketsView />;
      case 'dashboard':
      default:
        return (
          <Dashboard 
            user={user} 
            onCreateFD={() => setIsFDFormOpen(true)} 
            onViewFD={setSelectedFD}
            key={refreshTrigger}
          />
        );
    }
  };

  const navItemClass = (view: ViewType) => `
    w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group
    ${currentView === view 
      ? 'text-indigo-600 bg-indigo-50 font-semibold shadow-sm' 
      : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
    }
  `;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-indigo-200 shadow-lg">
              <ICONS.Wallet className="text-white w-6 h-6" />
            </div>
            <span className="font-outfit font-bold text-xl text-slate-900 tracking-tight">FinTechora</span>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={navItemClass('dashboard')}
            >
              <ICONS.Dashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('investments')}
              className={navItemClass('investments')}
            >
              <ICONS.Chart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Investments
            </button>
            <button 
              onClick={() => setCurrentView('markets')}
              className={navItemClass('markets')}
            >
              <ICONS.Trend className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Markets
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-6 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all"
          >
            <ICONS.LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <ICONS.Wallet className="text-white w-5 h-5" />
            </div>
            <span className="font-outfit font-bold text-lg">FinTechora</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setIsFDFormOpen(true)} className="p-2 text-indigo-600">
                <ICONS.Plus className="w-6 h-6" />
             </button>
             <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-600 transition-colors">
                <ICONS.LogOut className="w-6 h-6" />
              </button>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>

      {/* Modals */}
      {isFDFormOpen && (
        <FDForm 
          userId={user.id} 
          onClose={() => setIsFDFormOpen(false)} 
          onRefresh={handleRefresh} 
        />
      )}
      {selectedFD && (
        <FDTracker 
          fd={selectedFD} 
          onClose={() => setSelectedFD(null)} 
        />
      )}
    </div>
  );
};

export default App;
