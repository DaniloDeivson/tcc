'use client'
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardCard from './DashboardCard';

const PatrimonioDashboard = () => {
  const { personalInfo, monthlySavings, extraExpenses } = useAuth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular patrimônio líquido do mês atual (ganhos - gastos - gastos extras)
  const calculateCurrentMonthNetWorth = () => {
    if (!personalInfo) return 0;
    
    const income = personalInfo.monthlyIncome || 0;
    const fixedExpenses = personalInfo.monthlyFixedExpenses || 0;
    const variableExpenses = personalInfo.monthlyVariableExpenses || 0;
    const totalExtraExpenses = extraExpenses.reduce((total, expense) => total + expense.amount, 0);
    
    // Patrimônio líquido = ganhos - gastos fixos - gastos variáveis - gastos extras
    return income - fixedExpenses - variableExpenses - totalExtraExpenses;
  };

  // Calcular patrimônio total acumulado (economia - gastos extras)
  const calculateTotalNetWorth = () => {
    const totalSavings = monthlySavings.reduce((total, savings) => total + savings.amount, 0);
    const totalExtraExpenses = extraExpenses.reduce((total, expense) => total + expense.amount, 0);
    return totalSavings - totalExtraExpenses;
  };

  const currentMonthNetWorth = calculateCurrentMonthNetWorth();
  const totalNetWorth = calculateTotalNetWorth();

  return (
    <div className="flex flex-col items-center gap-0 w-full">
      <div className="w-full max-w-[960px] px-4 sm:px-0 mb-6">
        <div className="bg-[#2B402B] rounded-lg flex flex-col justify-start p-4 sm:p-6">
          <p className="text-white text-sm sm:text-base">
            Patrimônio Líquido Mensal
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {formatCurrency(currentMonthNetWorth)}
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Ganhos - Gastos Fixos - Gastos Variáveis - Gastos Extras
          </p>
        </div>
      </div>
      <DashboardCard type="patrimonio" value={formatCurrency(totalNetWorth)} />
    </div>
  );
};

export default PatrimonioDashboard;
