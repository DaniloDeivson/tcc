'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";

const EconomiaDashboard: React.FC = () => {
  const { goal, updateGoal, personalInfo, monthlySavings, addMonthlySavings, extraExpenses } = useAuth();
  const [goalValueInput, setGoalValueInput] = useState('');
  const [showAddValue, setShowAddValue] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(2025);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [currentGoalValue, setCurrentGoalValue] = useState(0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  useEffect(() => {
    const now = new Date();
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    setCurrentMonth(months[now.getMonth()]);
    setCurrentYear(2025); // Forçar ano 2025
  }, []);

  // Resetar valor quando a meta mudar
  useEffect(() => {
    if (goal && goal.id) {
      setCurrentGoalValue(0);
    }
  }, [goal?.id]);

  // Monitorar quando a meta é atingida
  useEffect(() => {
    if (goal && goal.targetAmount && currentGoalValue >= goal.targetAmount && !showCongratulations) {
      setShowCongratulations(true);
      // Excluir a meta após 3 segundos
      setTimeout(() => {
        updateGoal({ id: 0, name: '', targetAmount: 0 });
        setShowCongratulations(false);
        setCurrentGoalValue(0);
      }, 3000);
    }
  }, [currentGoalValue, goal, showCongratulations]);

  const getCurrentMonthSavings = () => {
    const currentMonthSavings = monthlySavings.find(savings => 
      savings.month === currentMonth && savings.year === currentYear
    );
    return currentMonthSavings ? currentMonthSavings.amount : 0;
  };

  const getTotalSavings = () => {
    const totalSavings = monthlySavings.reduce((total, savings) => total + savings.amount, 0);
    const totalExtraExpenses = extraExpenses.reduce((total, expense) => total + expense.amount, 0);
    const result = Math.max(0, totalSavings - totalExtraExpenses);
    
    console.log('EconomiaDashboard getTotalSavings:', {
      monthlySavings,
      totalSavings,
      extraExpenses,
      totalExtraExpenses,
      result
    });
    
    return result;
  };

  const calculateGoalProgress = () => {
    if (!goal || !goal.targetAmount) return 0;
    
    const progress = (currentGoalValue / goal.targetAmount) * 100;
    return Math.min(progress, 100);
  };

  const handleAddValue = () => {
    if (goalValueInput && parseFloat(goalValueInput) > 0) {
      const amount = parseFloat(goalValueInput);
      
      console.log('EconomiaDashboard: Adding value to goal:', {
        amount: amount,
        currentGoalValue: currentGoalValue,
        newValue: currentGoalValue + amount
      });
      
      setCurrentGoalValue(prev => prev + amount);
      setGoalValueInput('');
      setShowAddValue(false);
    }
  };

  const progress = calculateGoalProgress();

  return (
    <div className="w-full max-w-[960px] mx-auto px-4 sm:px-0 animate-fadeInUp">
      {/* Header */}
      <div className="bg-[#1A3A1A] p-6 rounded-xl border border-[#6B8A6B] shadow-lg hover-lift mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">
              💰 Valor para a Meta
            </h2>
            <p className="text-[#B8D4B8] text-sm mt-1">Adicione valores para atingir sua meta atual</p>
          </div>
          <Button 
            onClick={() => setShowAddValue(!showAddValue)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-500"
          >
            {showAddValue ? '❌ Cancelar' : '➕ Adicionar Valor'}
          </Button>
        </div>
      </div>

      {/* Formulário para adicionar valor */}
      {showAddValue && (
        <div className="bg-[#1A3A1A] rounded-xl p-6 mb-6 border border-[#6B8A6B] shadow-lg animate-slideInRight">
          <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">
            ➕ Adicionar Valor para a Meta
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[#B8D4B8] text-sm font-medium mb-3 flex items-center gap-2">
                💰 Valor (R$)
              </label>
              <input
                type="number"
                value={goalValueInput}
                onChange={(e) => setGoalValueInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#1A3A1A] border-2 border-[#6B8A6B] text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                placeholder="Ex: 500"
              />
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleAddValue}
                disabled={!goalValueInput || parseFloat(goalValueInput) <= 0}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl disabled:opacity-50 shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-500 flex-1"
              >
                💾 Adicionar Valor
              </Button>
              <Button
                onClick={() => setShowAddValue(false)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-500 flex-1"
              >
                ❌ Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resumo do Valor para a Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#1A3A1A] rounded-xl p-6 border border-[#6B8A6B] shadow-lg hover-lift text-center">
          <h3 className="text-lg font-semibold text-green-400 mb-2">💰 Valor Atual</h3>
          <p className="text-2xl font-bold text-white">{formatCurrency(currentGoalValue)}</p>
          <p className="text-sm text-[#B8D4B8] mt-1">Para a meta atual</p>
        </div>
        
        <div className="bg-[#1A3A1A] rounded-xl p-6 border border-[#6B8A6B] shadow-lg hover-lift text-center">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">🎯 Meta</h3>
          <p className="text-2xl font-bold text-white">{goal ? formatCurrency(goal.targetAmount) : 'R$ 0,00'}</p>
          <p className="text-sm text-[#B8D4B8] mt-1">{goal ? goal.name : 'Nenhuma meta'}</p>
        </div>
        
        <div className="bg-[#1A3A1A] rounded-xl p-6 border border-[#6B8A6B] shadow-lg hover-lift text-center">
          <h3 className="text-lg font-semibold text-purple-400 mb-2">📊 Progresso</h3>
          <p className="text-2xl font-bold text-white">{progress.toFixed(1)}%</p>
          <p className="text-sm text-[#B8D4B8] mt-1">da meta</p>
        </div>
      </div>

      {/* Progresso da Meta - Barra Interativa */}
      {goal && goal.name && (
        <div className="bg-[#1A3A1A] rounded-xl p-6 border border-[#6B8A6B] shadow-lg hover-lift">
          <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">
            📊 Progresso da Meta: {goal.name}
          </h3>
          <div className="space-y-6">
            {/* Header com informações */}
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold text-lg">{goal.name}</span>
              <div className="text-right">
                <span className="text-white font-bold text-xl bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {progress.toFixed(1)}%
                </span>
                <p className="text-[#B8D4B8] text-sm">
                  {formatCurrency(currentGoalValue)} / {formatCurrency(goal.targetAmount)}
                </p>
              </div>
            </div>

            {/* Barra de Progresso Interativa */}
            <div className="relative">
              {/* Barra de fundo */}
              <div className="w-full bg-[#122112] rounded-full h-12 border-2 border-[#6B8A6B] overflow-hidden shadow-inner">
                {/* Barra de progresso com gradiente animado */}
                <div 
                  className="h-full rounded-full transition-all duration-2000 ease-out relative overflow-hidden"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                >
                  {/* Gradiente principal */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 animate-pulse-custom"></div>
                  
                  {/* Efeito de brilho */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  
                  {/* Texto do progresso */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-sm font-bold drop-shadow-lg">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Marcadores de progresso */}
              <div className="flex justify-between mt-2 text-xs text-[#B8D4B8]">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>

              {/* Indicador de meta atingida */}
              {progress >= 100 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                  🎉 META ATINGIDA!
                </div>
              )}
            </div>

            {/* Cards de informações */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-4 border border-green-500/30 text-center">
                <div className="text-green-400 text-2xl mb-2">💰</div>
                <p className="text-[#B8D4B8] text-sm mb-1">Meta Total</p>
                <p className="text-white font-bold text-lg">{formatCurrency(goal.targetAmount)}</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-4 border border-blue-500/30 text-center">
                <div className="text-blue-400 text-2xl mb-2">💵</div>
                <p className="text-[#B8D4B8] text-sm mb-1">Valor Atual</p>
                <p className="text-white font-bold text-lg">{formatCurrency(currentGoalValue)}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-4 border border-purple-500/30 text-center">
                <div className="text-purple-400 text-2xl mb-2">🎯</div>
                <p className="text-[#B8D4B8] text-sm mb-1">Restante</p>
                <p className="text-white font-bold text-lg">{formatCurrency(Math.max(0, goal.targetAmount - currentGoalValue))}</p>
              </div>
            </div>

            {/* Barra de progresso adicional com estilo diferente */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-center">Progresso Visual Detalhado</h4>
              <div className="relative">
                <div className="w-full bg-[#122112] rounded-full h-6 border border-[#6B8A6B] overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1500 ease-out relative"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-[#B8D4B8]">
                  <span>R$ 0</span>
                  <span className="font-semibold text-white">{formatCurrency(currentGoalValue)}</span>
                  <span>{formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sem Meta */}
      {(!goal || !goal.name) && (
        <div className="bg-[#1A3A1A] rounded-xl p-8 text-center border border-[#6B8A6B] shadow-lg hover-lift">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-white mb-4">Nenhuma Meta Definida</h3>
          <p className="text-[#B8D4B8] text-lg mb-6">
            Defina uma meta primeiro para acompanhar seu progresso de economia mensal.
          </p>
          <Button
            onClick={() => window.location.href = '/#metas'}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-500"
          >
            🎯 Ir para Metas
          </Button>
        </div>
      )}

      {/* Modal de Parabéns */}
      {showCongratulations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A3A1A] rounded-xl p-8 w-full max-w-md border border-[#6B8A6B] shadow-lg animate-fadeInUp text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
              Parabéns!
            </h3>
            <p className="text-[#B8D4B8] text-lg mb-6">
              Você atingiu sua meta de <span className="text-white font-bold">{goal?.name}</span>!
            </p>
            <p className="text-green-400 text-sm">
              Meta de {formatCurrency(goal?.targetAmount || 0)} atingida com sucesso!
            </p>
            <div className="mt-6">
              <div className="animate-pulse text-yellow-400 text-sm">
                Meta será removida automaticamente...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EconomiaDashboard;
