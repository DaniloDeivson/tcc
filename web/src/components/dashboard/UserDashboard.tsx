"use client"
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ExtraExpenseModal from './ExtraExpenseModal';
import AddTransactionModal from './AddTransactionModal';

interface MonthlySavings {
  month: string;
  savings: number;
  goalProgress: number;
}

const UserDashboard: React.FC = () => {
  const { user, personalInfo, goal, isAuthenticated, monthlySavings, extraExpenses } = useAuth();
  const [showExtraExpenseModal, setShowExtraExpenseModal] = useState(false);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

  // Dados de economia mensal baseados nas informações do usuário
  const mockMonthlySavings: MonthlySavings[] = personalInfo?.monthlyIncome ? [
    { month: "Jul/2025", savings: 0, goalProgress: 0 },
    { month: "Ago/2025", savings: 0, goalProgress: 0 },
    { month: "Set/2025", savings: 0, goalProgress: 0 },
    { month: "Out/2025", savings: 0, goalProgress: 0 },
    { month: "Nov/2025", savings: 0, goalProgress: 0 },
    { month: "Dez/2025", savings: 0, goalProgress: 0 }
  ] : [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Calcular total economizado (economia - gastos extras)
  const calculateTotalSavings = () => {
    const totalSavings = monthlySavings.reduce((total, savings) => total + savings.amount, 0);
    const totalExtraExpenses = extraExpenses.reduce((total, expense) => total + expense.amount, 0);
    return Math.max(0, totalSavings - totalExtraExpenses);
  };

  const calculateAverageMonthlySavings = () => {
    if (mockMonthlySavings.length === 0) return 0;
    return calculateTotalSavings() / mockMonthlySavings.length;
  };

  const calculateGoalProgress = () => {
    if (!goal || goal.targetAmount === 0) return 0;
    return (calculateTotalSavings() / goal.targetAmount) * 100;
  };

  const calculateRemainingAmount = () => {
    if (!goal) return 0;
    return Math.max(0, goal.targetAmount - calculateTotalSavings());
  };

  const calculateMonthsToGoal = () => {
    const average = calculateAverageMonthlySavings();
    if (average === 0 || !goal) return 0;
    return Math.ceil(calculateRemainingAmount() / average);
  };

  // Se não estiver logado, mostrar mensagem
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🔐 Acesso Restrito</h2>
          <p className="text-gray-300 mb-4">Você precisa estar logado para acessar o dashboard</p>
          <button 
            onClick={() => window.location.href = '/#login'}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Saudação Personalizada */}
      <div className="bg-[#1A3A1A] p-6 rounded-xl border border-[#6B8A6B] shadow-lg hover-lift">
        <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">
          Olá, {user?.name}! 👋
        </h1>
        <p className="text-[#B8D4B8]">Bem-vindo ao seu dashboard financeiro personalizado</p>
      </div>

      {/* Informações Pessoais */}
      {personalInfo && (
        <div className="bg-[#1A3A1A] p-6 rounded-xl border border-[#6B8A6B] shadow-lg hover-lift animate-slideInRight">
          <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">👤 Suas Informações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Dados Pessoais</h3>
              <div className="space-y-2">
                {personalInfo.fullName && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Nome:</span>
                    <span className="text-white font-medium">{personalInfo.fullName}</span>
                  </div>
                )}
                {personalInfo.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Email:</span>
                    <span className="text-white font-medium">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Telefone:</span>
                    <span className="text-white font-medium">{personalInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Só mostra situação financeira se tiver dados */}
            {(personalInfo.monthlyIncome || personalInfo.monthlyFixedExpenses || personalInfo.monthlyVariableExpenses) && (
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Situação Financeira</h3>
                <div className="space-y-2">
                  {personalInfo.monthlyIncome && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Receita Mensal:</span>
                      <span className="text-green-400 font-medium">{formatCurrency(personalInfo.monthlyIncome)}</span>
                    </div>
                  )}
                  {personalInfo.monthlyFixedExpenses && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Gastos Fixos:</span>
                      <span className="text-red-400 font-medium">{formatCurrency(personalInfo.monthlyFixedExpenses)}</span>
                    </div>
                  )}
                  {personalInfo.monthlyVariableExpenses && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Gastos Variáveis:</span>
                      <span className="text-orange-400 font-medium">{formatCurrency(personalInfo.monthlyVariableExpenses)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {personalInfo.notes && (
            <div className="mt-4 p-4 bg-[#122112] rounded-lg">
              <h4 className="text-yellow-400 font-semibold mb-2">📝 Observações</h4>
              <p className="text-gray-300">{personalInfo.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Meta Financeira - Só mostra se tiver meta */}
      {goal && goal.name && (
        <div className="bg-[#1A3A1A] p-6 rounded-xl border border-[#6B8A6B] shadow-lg hover-lift">
          <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">🎯 Sua Meta</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Meta</h3>
              <p className="text-white text-xl font-bold">{goal.name}</p>
              <p className="text-gray-300 text-sm">Valor: {formatCurrency(goal.targetAmount)}</p>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Progresso</h3>
              <p className="text-white text-2xl font-bold">{formatPercentage(calculateGoalProgress())}</p>
              <p className="text-gray-300 text-sm">Concluído</p>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Restante</h3>
              <p className="text-white text-xl font-bold">{formatCurrency(calculateRemainingAmount())}</p>
              <p className="text-gray-300 text-sm">
                {calculateMonthsToGoal() > 0 ? `${calculateMonthsToGoal()} meses` : 'Meta atingida!'}
              </p>
            </div>
          </div>
          
          {/* Barra de Progresso da Meta */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Progresso da Meta</span>
              <span className="text-white font-medium">{formatPercentage(calculateGoalProgress())}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, calculateGoalProgress())}%` }}
              />
            </div>
          </div>
        </div>
      )}


      {/* Mensagem se não tiver dados financeiros */}
      {(!personalInfo || (!personalInfo.monthlyIncome && !personalInfo.monthlyFixedExpenses && !personalInfo.monthlyVariableExpenses)) && (
        <div className="bg-[#3A5A3A] p-6 rounded-xl border border-[#6B8A6B] text-center">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">📝 Complete suas Informações</h3>
          <p className="text-gray-300 mb-4">
            Para ver seu dashboard completo, preencha suas informações financeiras na aba "Informações"
          </p>
          <button 
            onClick={() => window.location.href = '/#personal'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Ir para Informações
          </button>
        </div>
      )}

      {/* Gráfico de Economia Mensal - Só mostra se tiver dados financeiros */}
      {personalInfo && (personalInfo.monthlyIncome || personalInfo.monthlyFixedExpenses || personalInfo.monthlyVariableExpenses) && (
        <div className="bg-[#1A3A1A] p-6 rounded-xl border border-[#6B8A6B] shadow-lg hover-lift">
          <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">📊 Sua Economia Mensal</h2>
          
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#1A3A1A] p-4 rounded-lg text-center border border-[#6B8A6B]">
              <h3 className="text-green-400 font-semibold mb-2">Total Economizado</h3>
              <p className="text-2xl font-bold text-white">{formatCurrency(calculateTotalSavings())}</p>
            </div>
            
            <div className="bg-[#1A3A1A] p-4 rounded-lg text-center border border-[#6B8A6B]">
              <h3 className="text-blue-400 font-semibold mb-2">Média Mensal</h3>
              <p className="text-2xl font-bold text-white">{formatCurrency(calculateAverageMonthlySavings())}</p>
            </div>
            
            <div className="bg-[#1A3A1A] p-4 rounded-lg text-center border border-[#6B8A6B]">
              <h3 className="text-yellow-400 font-semibold mb-2">Último Mês</h3>
              <p className="text-2xl font-bold text-white">
                {monthlySavings.length > 0 ? formatCurrency(monthlySavings[monthlySavings.length - 1].amount) : 'R$ 0,00'}
              </p>
            </div>
          </div>

          {/* Botões para Gastos Extras e Transações */}
          <div className="mb-6 text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowExtraExpenseModal(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-red-500 font-medium"
              >
                💸 Registrar Gasto Extra
              </button>
              <button
                onClick={() => setShowAddTransactionModal(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-500 font-medium"
              >
                ➕ Adicionar Transação
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              Gastos extras descontam da meta e patrimônio líquido
            </p>
          </div>

          {/* Gráfico de Barras */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Evolução dos Últimos 6 Meses</h3>
            <div className="space-y-3">
              {mockMonthlySavings.map((month, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 text-sm text-gray-300 font-medium">{month.month}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medium">{formatCurrency(month.savings)}</span>
                      <span className="text-gray-400 text-sm">{formatPercentage(month.goalProgress)} da meta</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (month.savings / 2000) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projeção */}
          <div className="mt-6 p-4 bg-[#122112] rounded-lg">
            <h4 className="text-yellow-400 font-semibold mb-2">🔮 Projeção</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-300">Economia projetada em 12 meses:</span>
                <span className="text-green-400 font-bold ml-2">
                  {formatCurrency(calculateAverageMonthlySavings() * 12)}
                </span>
              </div>
              <div>
                <span className="text-gray-300">Tempo para atingir a meta:</span>
                <span className="text-blue-400 font-bold ml-2">
                  {calculateMonthsToGoal() > 0 ? `${calculateMonthsToGoal()} meses` : 'Meta já atingida!'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Modal de Gastos Extras */}
      <ExtraExpenseModal 
        isOpen={showExtraExpenseModal} 
        onClose={() => setShowExtraExpenseModal(false)} 
      />

      {/* Modal de Adicionar Transação */}
      <AddTransactionModal
        isOpen={showAddTransactionModal}
        onClose={() => setShowAddTransactionModal(false)}
        onSuccess={() => {
          console.log('Transação adicionada com sucesso!');
        }}
      />
    </div>
  );
};

export default UserDashboard;
