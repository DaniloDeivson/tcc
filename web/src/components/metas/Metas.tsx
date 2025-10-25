'use client'
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";

const Metas = () => {
  const { goal, updateGoal, monthlySavings, extraExpenses } = useAuth();
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveGoal = () => {
    if (newGoalName && newGoalAmount) {
      const newGoal = {
        id: Date.now(),
        name: newGoalName,
        targetAmount: parseFloat(newGoalAmount)
      };
      updateGoal(newGoal);
      setNewGoalName('');
      setNewGoalAmount('');
      setShowForm(false);
    }
  };

  const handleDeleteGoal = () => {
    updateGoal({ id: 0, name: '', targetAmount: 0 });
    setShowDeleteConfirm(false);
  };

  const calculateGoalProgress = () => {
    if (!goal || !goal.targetAmount) return 0;
    
    // Usar economia real dos meses menos gastos extras
    const totalSavings = monthlySavings.reduce((total, savings) => total + savings.amount, 0);
    const totalExtraExpenses = extraExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalSaved = Math.max(0, totalSavings - totalExtraExpenses);
    const progress = (totalSaved / goal.targetAmount) * 100;
    return Math.min(progress, 100);
  };

  const progress = calculateGoalProgress();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="w-full flex flex-col items-center px-4 animate-fadeInUp">
      {/* Header */}
      <div className="w-full max-w-[960px] p-6 text-white mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1A3A1A] rounded-xl border border-[#6B8A6B] shadow-lg hover-lift">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">🎯 Minhas Metas</h2>
          <p className="text-[#B8D4B8] text-sm mt-1">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm sm:text-base w-full sm:w-auto px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-500"
        >
          {showForm ? '❌ Cancelar' : '✨ Adicionar Meta'}
        </Button>
      </div>

      {/* Formulário para adicionar meta */}
      {showForm && (
        <div className="w-full max-w-[960px] bg-[#1A3A1A] rounded-xl p-6 mt-6 border border-[#6B8A6B] shadow-lg animate-slideInRight">
          <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">✨ Nova Meta</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[#B8D4B8] text-sm font-medium mb-3 flex items-center gap-2">
                📝 Nome da Meta
              </label>
              <input
                type="text"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#1A3A1A] border-2 border-[#6B8A6B] text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                placeholder="Ex: Comprar um carro novo"
              />
            </div>
            <div>
              <label className="block text-[#B8D4B8] text-sm font-medium mb-3 flex items-center gap-2">
                💰 Valor da Meta (R$)
              </label>
              <input
                type="number"
                value={newGoalAmount}
                onChange={(e) => setNewGoalAmount(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#1A3A1A] border-2 border-[#6B8A6B] text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                placeholder="Ex: 50000"
              />
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleSaveGoal}
                disabled={!newGoalName || !newGoalAmount}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl disabled:opacity-50 shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-500 flex-1"
              >
                💾 Salvar Meta
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-500 flex-1"
              >
                ❌ Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Meta atual */}
      <div className="w-full max-w-[960px] text-white mt-6 animate-slideInRight">
        <h3 className="text-xl sm:text-2xl font-bold mb-6 bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">🎯 Meta Atual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goal && goal.name ? (
            <div className="bg-[#1A3A1A] rounded-xl p-6 border border-[#6B8A6B] shadow-lg hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2">🎯 Minha Meta</h4>
                  <p className="text-sm sm:text-base text-[#B8D4B8] break-words">{goal.name}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs sm:text-sm text-[#B8D4B8] mb-1">Objetivo</p>
                  <p className="text-lg sm:text-xl text-white font-bold whitespace-nowrap bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 border border-red-500 text-sm"
                >
                  🗑️ Excluir Meta
                </Button>
              </div>
            </div>
          ) : (
            <div className="col-span-2 bg-[#1A3A1A] rounded-xl p-8 text-center border border-[#6B8A6B] shadow-lg hover-lift">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-[#B8D4B8] text-lg mb-6">Nenhuma meta cadastrada ainda.</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-500"
              >
                ✨ Criar Primeira Meta
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Progresso da meta */}
      {goal && goal.name && (
        <div className="w-full max-w-[960px] bg-[#1A3A1A] rounded-xl p-6 mt-6 border border-[#6B8A6B] shadow-lg hover-lift animate-slideInRight">
          <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">📊 Progresso da Meta</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold text-lg">{goal.name}</span>
              <span className="text-white font-bold text-xl bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {progress.toFixed(1)}%
              </span>
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
            <div className="text-center bg-[#1A3A1A] rounded-xl p-4 border border-[#6B8A6B]">
              <p className="text-[#B8D4B8] text-base">
                💰 Meta: <span className="text-white font-bold">{formatCurrency(goal.targetAmount)}</span>
              </p>
              <p className="text-[#B8D4B8] text-base">
                💵 Economizado: <span className="text-white font-bold">{formatCurrency(Math.max(0, monthlySavings.reduce((total, savings) => total + savings.amount, 0) - extraExpenses.reduce((total, expense) => total + expense.amount, 0)))}</span>
              </p>
              <p className="text-[#B8D4B8] text-base">
                🎯 Restante: <span className="text-white font-bold">{formatCurrency(goal.targetAmount - Math.max(0, monthlySavings.reduce((total, savings) => total + savings.amount, 0) - extraExpenses.reduce((total, expense) => total + expense.amount, 0)))}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A3A1A] rounded-xl p-8 w-full max-w-md border border-[#6B8A6B] shadow-lg animate-fadeInUp text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Excluir Meta?
            </h3>
            <p className="text-[#B8D4B8] text-lg mb-6">
              Tem certeza que deseja excluir a meta <span className="text-white font-bold">"{goal?.name}"</span>?
            </p>
            <p className="text-red-400 text-sm mb-6">
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={handleDeleteGoal}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-red-500 flex-1"
              >
                🗑️ Sim, Excluir
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-500 flex-1"
              >
                ❌ Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Metas; 

