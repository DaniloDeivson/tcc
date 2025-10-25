'use client'
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import DashboardTabs from '@/components/layout/DashboardTabs';
import TitleDashboard from '@/components/layout/TitleDashboard';
import PatrimonioDashboard from '@/components/dashboard/PatrimonioDashboard';
import ContaCorrenteDashboard from '@/components/dashboard/ContaCorrenteDashboard';
import PoupancaDashboard from '@/components/dashboard/PoupancaDashboard';
import EconomiaDashboard from '@/components/dashboard/EconomiaDashboard';
import RealTimeDashboard from '@/components/dashboard/RealTimeDashboard';
import PersonalDashboard from '@/components/dashboard/PersonalDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AddTransactionModal from '@/components/dashboard/AddTransactionModal';
import Metas from '@/components/metas/Metas';
import Footer from '@/components/layout/Footer';
import AuthForms from '@/components/auth/AuthForms';
import PersonalInfoView from '@/components/views/PersonalInfoView';
import EmailDebugger from '@/components/debug/EmailDebugger';
import { DASHBOARD_CONFIG, DashboardTab } from '@/constants/dashboard';

type DashboardTabsProps = {
  selected: "patrimonio" | "conta" | "poupanca" | "economia";
  onSelect: (value: "patrimonio" | "conta" | "poupanca" | "economia") => void;
}

// Componente para exibir valor do patrimônio líquido
const PatrimonioValue = () => {
  const { personalInfo, extraExpenses } = useAuth();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateNetWorth = () => {
    if (!personalInfo) return 0;
    
    const income = personalInfo.monthlyIncome || 0;
    const fixedExpenses = personalInfo.monthlyFixedExpenses || 0;
    const variableExpenses = personalInfo.monthlyVariableExpenses || 0;
    const totalExtraExpenses = extraExpenses.reduce((total, expense) => total + expense.amount, 0);
    
    // Patrimônio líquido = ganhos - gastos fixos - gastos variáveis - gastos extras
    return income - fixedExpenses - variableExpenses - totalExtraExpenses;
  };

  return <span>{formatCurrency(calculateNetWorth())}</span>;
};

// Componente para exibir valor da poupança
const PoupancaValue = () => {
  const { monthlySavings, extraExpenses } = useAuth();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateTotalSavings = () => {
    const totalSavings = monthlySavings.reduce((total, savings) => total + savings.amount, 0);
    const totalExtraExpenses = extraExpenses.reduce((total, expense) => total + expense.amount, 0);
    return totalSavings - totalExtraExpenses;
  };

  return <span>{formatCurrency(calculateTotalSavings())}</span>;
};

const PageContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [mainView, setMainView] = useState<'dashboard' | 'personal' | 'metas' | 'api'>('dashboard');
  const [selectedTab, setSelectedTab] = useState<DashboardTab>('patrimonio');
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const dashboardConfig = DASHBOARD_CONFIG[selectedTab];

  const renderDashboard = () => {
    switch (selectedTab) {
      case 'patrimonio':
        return <UserDashboard />;
      case 'conta':
        return <ContaCorrenteDashboard />;
      case 'poupanca':
        return <PoupancaDashboard />;
      case 'economia':
        return <EconomiaDashboard />;
      default:
        return null;
    }
  };

  // Se estiver carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#122112]">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  // Se não estiver logado, mostrar formulário de login
  if (!isAuthenticated) {
    return (
      <main className="bg-[#1A3A1A] w-full min-h-screen flex flex-col items-center gap-4 text-white font-semibold text-sm sm:text-base lg:text-lg">
        <div className="w-full flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-[720px] px-4">
            <AuthForms onSuccessLogin={() => setMainView('dashboard')} />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <>
      <Header
        onSelectDashboard={() => setMainView('dashboard')}
        onSelectPersonal={() => setMainView('personal')}
        onSelectMetas={() => setMainView('metas')}
        onSelectApi={() => setMainView('api')}
      />
      <main className="bg-[#1A3A1A] w-full min-h-screen flex flex-col items-center gap-4 text-white font-semibold text-sm sm:text-base lg:text-lg">
        {mainView === 'dashboard' ? (
          <>
            <TitleDashboard title={dashboardConfig.title} subtitle={dashboardConfig.subtitle} />
            <DashboardTabs selected={selectedTab} onSelect={setSelectedTab} />
            {(selectedTab === 'patrimonio' || selectedTab === 'poupanca') && (
              <div className="w-full max-w-[960px] px-4 sm:px-0">
                <div className="bg-[#2B402B] rounded-lg flex flex-col justify-start p-4 sm:p-6">
                  <p className="text-white text-sm sm:text-base">
                    {dashboardConfig.title}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {selectedTab === 'patrimonio' ? (
                      <PatrimonioValue />
                    ) : (
                      <PoupancaValue />
                    )}
                  </h2>
                </div>
              </div>
            )}
            <div className="w-full flex justify-center px-4">
              {renderDashboard()}
            </div>
            
            {/* Modal para adicionar transação */}
            <AddTransactionModal
              isOpen={showAddTransaction}
              onClose={() => setShowAddTransaction(false)}
              onSuccess={() => {
                // Recarregar dados do dashboard
                console.log('Transação adicionada com sucesso!');
              }}
            />
          </>
        ) : mainView === 'personal' ? (
          <PersonalInfoView />
        ) : mainView === 'metas' ? (
          <Metas />
        ) : (
          <div className="w-full flex-1 flex items-center justify-center py-10">
            <div className="w-full max-w-[720px] px-4">
              <AuthForms onSuccessLogin={() => setMainView('dashboard')} />
            </div>
          </div>
        )}
      </main>
      <Footer />
      <EmailDebugger />
    </>
  );
};

const Page = () => {
  return (
    <AuthProvider>
      <PageContent />
    </AuthProvider>
  );
};

export default Page;
