"use client"
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addTransaction } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    location: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = {
    income: [
      { value: 'salary', label: 'Salário' },
      { value: 'freelance', label: 'Freelance' },
      { value: 'investment', label: 'Investimentos' },
      { value: 'business', label: 'Negócios' },
      { value: 'other', label: 'Outras Receitas' }
    ],
    expense: [
      { value: 'food', label: 'Alimentação' },
      { value: 'transportation', label: 'Transporte' },
      { value: 'housing', label: 'Moradia' },
      { value: 'health', label: 'Saúde' },
      { value: 'education', label: 'Educação' },
      { value: 'entertainment', label: 'Entretenimento' },
      { value: 'shopping', label: 'Compras' },
      { value: 'bills', label: 'Contas' },
      { value: 'insurance', label: 'Seguros' },
      { value: 'other', label: 'Outras Despesas' }
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Adicionar transação usando o contexto
      addTransaction({
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        date: new Date(formData.date).toISOString()
      });
      
      console.log('Transação adicionada:', formData);
      
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        location: ''
      });
    } catch (err) {
      setError('Erro ao adicionar transação');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData(prev => ({
      ...prev,
      type,
      category: type === 'income' ? 'salary' : 'food'
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#3A5A3A] rounded-xl p-6 w-full max-w-md border border-[#6B8A6B]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Nova Transação</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-600 text-white p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Tipo de Transação */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Tipo</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.type === 'income'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Receita
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.type === 'expense'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Despesa
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Descrição</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 rounded-lg bg-[#122112] border border-[#6B8A6B] text-white placeholder-gray-400"
              placeholder="Ex: Supermercado, Salário, etc."
              required
            />
          </div>

          {/* Valor */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full p-3 rounded-lg bg-[#122112] border border-[#6B8A6B] text-white placeholder-gray-400"
              placeholder="0,00"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 rounded-lg bg-[#122112] border border-[#6B8A6B] text-white"
            >
              {categories[formData.type].map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Data</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-3 rounded-lg bg-[#122112] border border-[#6B8A6B] text-white"
              required
            />
          </div>

          {/* Localização */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Localização (opcional)</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-3 rounded-lg bg-[#122112] border border-[#6B8A6B] text-white placeholder-gray-400"
              placeholder="Ex: Shopping Center, etc."
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Observações (opcional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full p-3 rounded-lg bg-[#122112] border border-[#6B8A6B] text-white placeholder-gray-400 h-20 resize-none"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Botões */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {loading ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;

