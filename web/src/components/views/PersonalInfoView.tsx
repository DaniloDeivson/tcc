'use client'
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FormSection from '@/components/ui/FormSection';

const PersonalInfoView = () => {
  const { personalInfo, updatePersonalInfo, goal, updateGoal } = useAuth();
  const [info, setInfo] = useState({
    fullName: personalInfo?.fullName || '',
    email: personalInfo?.email || '',
    phone: personalInfo?.phone || '',
    monthlyIncome: personalInfo?.monthlyIncome || 0,
    monthlyFixedExpenses: personalInfo?.monthlyFixedExpenses || 0,
    monthlyVariableExpenses: personalInfo?.monthlyVariableExpenses || 0,
    notes: personalInfo?.notes || ''
  });
  const [goalName, setGoalName] = useState(goal?.name || '');
  const [goalValue, setGoalValue] = useState(goal?.targetAmount || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSave = async () => {
    setIsLoading(true);
    setFeedback('');
    
    try {
      // Simular salvamento (em produção, fazer chamada para API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar informações pessoais
      updatePersonalInfo(info);
      
      // Atualizar meta
      if (goalName && goalValue > 0) {
        updateGoal({
          id: goal?.id || Date.now(),
          name: goalName,
          targetAmount: goalValue
        });
      }
      
      setFeedback('Informações salvas com sucesso!');
    } catch (error) {
      setFeedback('Erro ao salvar informações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-[960px] grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <FormSection title="Informações Pessoais">
          <div className="space-y-3">
            <input
              className="w-full p-3 rounded bg-[#122112] border border-[#6B8A6B] text-sm text-white placeholder-gray-400"
              placeholder="Nome completo"
              value={info.fullName}
              onChange={(e) => setInfo({ ...info, fullName: e.target.value })}
            />
            <input
              className="w-full p-3 rounded bg-[#122112] border border-[#6B8A6B] text-sm text-white placeholder-gray-400"
              placeholder="Email"
              type="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
            />
            <input
              className="w-full p-3 rounded bg-[#122112] border border-[#6B8A6B] text-sm text-white placeholder-gray-400"
              placeholder="Telefone"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
            />
          </div>
        </FormSection>

        <FormSection title="Financeiro Mensal">
          <div className="space-y-3">
            <input
              className="w-full p-3 rounded bg-[#122112] border border-[#6B8A6B] text-sm text-white placeholder-gray-400"
              placeholder="Receita mensal (R$)"
              type="number"
              value={info.monthlyIncome || ''}
              onChange={(e) => setInfo({ ...info, monthlyIncome: Number(e.target.value) || 0 })}
            />
            <input
              className="w-full p-3 rounded bg-[#122112] border border-[#6B8A6B] text-sm text-white placeholder-gray-400"
              placeholder="Gastos fixos mensais (R$)"
              type="number"
              value={info.monthlyFixedExpenses || ''}
              onChange={(e) => setInfo({ ...info, monthlyFixedExpenses: Number(e.target.value) || 0 })}
            />
            <input
              className="w-full p-3 rounded bg-[#122112] border border-[#6B8A6B] text-sm text-white placeholder-gray-400"
              placeholder="Gastos variáveis mensais (R$)"
              type="number"
              value={info.monthlyVariableExpenses || ''}
              onChange={(e) => setInfo({ ...info, monthlyVariableExpenses: Number(e.target.value) || 0 })}
            />
          </div>
        </FormSection>

        <FormSection title="Definir Meta" className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="w-full p-3 rounded bg-[#122112] border border-[#6B8A6B] md:col-span-2 text-sm text-white placeholder-gray-400"
              placeholder="Nome da meta"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
            />
            <input
              className="w-full p-3 rounded bg-[#122112] border border-[#6B8A6B] text-sm text-white placeholder-gray-400"
              placeholder="Valor da meta (R$)"
              type="number"
              value={goalValue || ''}
              onChange={(e) => setGoalValue(Number(e.target.value) || 0)}
            />
          </div>
        </FormSection>

        <FormSection title="Outras Informações" className="md:col-span-2">
          <textarea
            className="w-full p-3 rounded bg-[#122112] border border-[#6B8A6B] h-32 text-sm text-white placeholder-gray-400"
            placeholder="Observações, objetivos financeiros, etc."
            value={info.notes}
            onChange={(e) => setInfo({ ...info, notes: e.target.value })}
          />
        </FormSection>

        <div className="md:col-span-2 flex justify-end">
          <button
            className="px-6 sm:px-8 py-3 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base text-white"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Tudo'}
          </button>
        </div>

        {feedback && (
          <div className="md:col-span-2 text-sm text-center opacity-80 text-white">{feedback}</div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoView;
