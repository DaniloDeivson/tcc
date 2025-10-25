"use client"
import React, { useState, useEffect } from 'react';

interface RealTimeDashboardProps {
  onAddTransaction?: () => void;
}

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  averageDailySpending: number;
  projectedMonthlyExpenses: number;
  netWorth: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  netIncome: number;
  savingsRate: number;
}

const RealTimeDashboard: React.FC<RealTimeDashboardProps> = ({ onAddTransaction }) => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Simular dados reais - em produção, fazer chamadas para a API
      const mockData: FinancialData = {
        totalIncome: 8500.00,
        totalExpenses: 6200.00,
        netIncome: 2300.00,
        savingsRate: 27.06,
        averageDailySpending: 206.67,
        projectedMonthlyExpenses: 6200.00,
        netWorth: 2300.00
      };

      const mockCategories: CategoryData[] = [
        { category: 'Alimentação', amount: 1200.00, percentage: 19.35, transactionCount: 45 },
        { category: 'Transporte', amount: 800.00, percentage: 12.90, transactionCount: 23 },
        { category: 'Moradia', amount: 2000.00, percentage: 32.26, transactionCount: 8 },
        { category: 'Entretenimento', amount: 600.00, percentage: 9.68, transactionCount: 15 },
        { category: 'Saúde', amount: 400.00, percentage: 6.45, transactionCount: 12 },
        { category: 'Compras', amount: 1000.00, percentage: 16.13, transactionCount: 28 }
      ];

      const mockTrends: MonthlyTrend[] = [
        { month: 'Jan/2025', income: 8000, expenses: 5800, netIncome: 2200, savingsRate: 27.5 },
        { month: 'Fev/2025', income: 8200, expenses: 6100, netIncome: 2100, savingsRate: 25.6 },
        { month: 'Mar/2025', income: 8500, expenses: 6200, netIncome: 2300, savingsRate: 27.1 }
      ];

      setFinancialData(mockData);
      setCategories(mockCategories);
      setMonthlyTrends(mockTrends);
    } catch (err) {
      setError('Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando dados financeiros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center p-4">
        {error}
      </div>
    );
  }

  if (!financialData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#3A5A3A] p-6 rounded-xl border border-[#6B8A6B]">
          <h3 className="text-green-400 text-sm font-medium mb-2">Receitas Totais</h3>
          <p className="text-2xl font-bold text-white">{formatCurrency(financialData.totalIncome)}</p>
          <p className="text-xs text-gray-400 mt-1">Últimos 6 meses</p>
        </div>

        <div className="bg-[#3A5A3A] p-6 rounded-xl border border-[#6B8A6B]">
          <h3 className="text-red-400 text-sm font-medium mb-2">Gastos Totais</h3>
          <p className="text-2xl font-bold text-white">{formatCurrency(financialData.totalExpenses)}</p>
          <p className="text-xs text-gray-400 mt-1">Últimos 6 meses</p>
        </div>

        <div className="bg-[#3A5A3A] p-6 rounded-xl border border-[#6B8A6B]">
          <h3 className="text-blue-400 text-sm font-medium mb-2">Patrimônio Líquido</h3>
          <p className="text-2xl font-bold text-white">{formatCurrency(financialData.netWorth)}</p>
          <p className="text-xs text-gray-400 mt-1">Saldo atual</p>
        </div>

        <div className="bg-[#3A5A3A] p-6 rounded-xl border border-[#6B8A6B]">
          <h3 className="text-yellow-400 text-sm font-medium mb-2">Taxa de Poupança</h3>
          <p className="text-2xl font-bold text-white">{formatPercentage(financialData.savingsRate)}</p>
          <p className="text-xs text-gray-400 mt-1">Meta: 20%</p>
        </div>
      </div>

      {/* Análise de Gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#3A5A3A] p-6 rounded-xl border border-[#6B8A6B]">
          <h3 className="text-white text-lg font-semibold mb-4">Gastos por Categoria</h3>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-sm">{category.category}</span>
                    <span className="text-white text-sm font-medium">{formatCurrency(category.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-400 text-xs">{formatPercentage(category.percentage)}</span>
                    <span className="text-gray-400 text-xs">{category.transactionCount} transações</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#3A5A3A] p-6 rounded-xl border border-[#6B8A6B]">
          <h3 className="text-white text-lg font-semibold mb-4">Tendências Mensais</h3>
          <div className="space-y-4">
            {monthlyTrends.map((trend, index) => (
              <div key={index} className="border-b border-gray-700 pb-3 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{trend.month}</span>
                  <span className="text-green-400 font-bold">{formatCurrency(trend.netIncome)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Receitas: </span>
                    <span className="text-green-400">{formatCurrency(trend.income)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Gastos: </span>
                    <span className="text-red-400">{formatCurrency(trend.expenses)}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-400 text-xs">Poupança: </span>
                  <span className="text-yellow-400 text-xs font-medium">{formatPercentage(trend.savingsRate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#3A5A3A] p-6 rounded-xl border border-[#6B8A6B]">
          <h3 className="text-white text-lg font-semibold mb-2">Gasto Médio Diário</h3>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(financialData.averageDailySpending)}</p>
          <p className="text-xs text-gray-400 mt-1">Baseado nos últimos 30 dias</p>
        </div>

        <div className="bg-[#3A5A3A] p-6 rounded-xl border border-[#6B8A6B]">
          <h3 className="text-white text-lg font-semibold mb-2">Projeção Mensal</h3>
          <p className="text-2xl font-bold text-orange-400">{formatCurrency(financialData.projectedMonthlyExpenses)}</p>
          <p className="text-xs text-gray-400 mt-1">Baseado no histórico</p>
        </div>

        <div className="bg-[#3A5A3A] p-6 rounded-xl border border-[#6B8A6B]">
          <h3 className="text-white text-lg font-semibold mb-2">Saldo Líquido</h3>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(financialData.netIncome)}</p>
          <p className="text-xs text-gray-400 mt-1">Receitas - Gastos</p>
        </div>
      </div>

      {/* Botão para Adicionar Transação */}
      <div className="text-center">
        <button 
          onClick={onAddTransaction}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          + Adicionar Transação
        </button>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
