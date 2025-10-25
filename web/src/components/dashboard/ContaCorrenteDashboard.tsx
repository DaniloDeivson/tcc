'use client'
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardCard from './DashboardCard';
import RecentTransactionsTable from './RecentTransactionsTable';

const ContaCorrenteDashboard = () => {
  const { personalInfo } = useAuth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Mostrar ganho mensal do usuário ou R$ 0,00 se não informado
  const monthlyIncome = personalInfo?.monthlyIncome || 0;

  return (
    <div className="flex flex-col items-center gap-0 w-full">
      <div className="w-full max-w-[960px] px-4 sm:px-0 mb-6">
        <div className="bg-[#2B402B] rounded-lg flex flex-col justify-start p-4 sm:p-6">
          <p className="text-white text-sm sm:text-base">
            Ganho Mensal
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {formatCurrency(monthlyIncome)}
          </h2>
          {monthlyIncome === 0 && (
            <p className="text-gray-400 text-sm mt-2">
              Preencha suas informações financeiras para ver seu ganho mensal
            </p>
          )}
        </div>
      </div>
      <DashboardCard type="conta" value={formatCurrency(monthlyIncome)} />
      <RecentTransactionsTable />
    </div>
  );
};

export default ContaCorrenteDashboard;
