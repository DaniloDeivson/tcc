'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";

interface ExtraExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExtraExpenseModal: React.FC<ExtraExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExtraExpense, addTransaction } = useAuth();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    const now = new Date();
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    setCurrentMonth(months[now.getMonth()]);
    setCurrentYear(2025); // Forçar ano 2025
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSubmit = () => {
    if (description && amount && parseFloat(amount) > 0) {
      const expenseAmount = parseFloat(amount);
      const currentDate = new Date().toISOString();
      
      // Adicionar gasto extra
      addExtraExpense({
        description: description,
        amount: expenseAmount,
        date: currentDate,
        month: currentMonth,
        year: currentYear
      });
      
      // Criar transação automaticamente
      addTransaction({
        description: `Gasto Extra: ${description}`,
        amount: expenseAmount,
        type: 'expense',
        category: 'other',
        date: currentDate
      });
      
      setDescription('');
      setAmount('');
      onClose();
    }
  };

  const handleClose = () => {
    setDescription('');
    setAmount('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A3A1A] rounded-xl p-6 w-full max-w-md border border-[#6B8A6B] shadow-lg animate-fadeInUp">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent">
            💸 Gastos Extras
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[#B8D4B8] text-sm font-medium mb-3 flex items-center gap-2">
              📝 Descrição do Gasto
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#1A3A1A] border-2 border-[#6B8A6B] text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-300"
              placeholder="Ex: Emergência médica"
            />
          </div>

          <div>
            <label className="block text-[#B8D4B8] text-sm font-medium mb-3 flex items-center gap-2">
              💰 Valor Gasto (R$)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#1A3A1A] border-2 border-[#6B8A6B] text-white placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-300"
              placeholder="Ex: 500"
            />
          </div>

          <div className="bg-[#2A4A2A] rounded-xl p-4 border border-[#4A7C4A]">
            <p className="text-[#B8D4B8] text-sm mb-2">⚠️ Atenção:</p>
            <p className="text-red-400 text-sm">
              Este valor será descontado da sua meta e do patrimônio líquido do mês atual ({currentMonth}/2025).
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={!description || !amount || parseFloat(amount) <= 0}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl disabled:opacity-50 shadow-lg transform hover:scale-105 transition-all duration-300 border border-red-500 flex-1"
            >
              💸 Registrar Gasto
            </Button>
            <Button
              onClick={handleClose}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-500 flex-1"
            >
              ❌ Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtraExpenseModal;
