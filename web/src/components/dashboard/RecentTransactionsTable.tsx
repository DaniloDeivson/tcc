'use client'
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const RecentTransactionsTable = () => {
  const { transactions } = useAuth();

  return (
    <div className="w-full max-w-[960px] bg-[#2A4A2A] border border-[#4A7C4A] rounded-xl p-4 sm:p-6 shadow-md mt-8">
      <div className="text-white text-sm sm:text-base font-semibold mb-2">Transações recentes</div>
      <div className="overflow-x-auto">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">Nenhuma transação registrada</p>
            <p className="text-gray-500 text-xs mt-2">Adicione transações para ver seu histórico</p>
          </div>
        ) : (
          <table className="min-w-full border border-[#4A7C4A] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-transparent">
                <th className="px-2 sm:px-4 py-2 text-left text-[#9EBF9E] font-medium text-xs sm:text-sm">Data</th>
                <th className="px-2 sm:px-4 py-2 text-left text-[#9EBF9E] font-medium text-xs sm:text-sm">Descrição</th>
                <th className="px-2 sm:px-4 py-2 text-left text-[#9EBF9E] font-medium text-xs sm:text-sm hidden sm:table-cell">Categoria</th>
                <th className="px-2 sm:px-4 py-2 text-left text-[#9EBF9E] font-medium text-xs sm:text-sm">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-[#264526] hover:bg-[#223822] transition-colors">
                  <td className="px-2 sm:px-4 py-2 text-[#E5E8EB] whitespace-nowrap text-xs sm:text-sm">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-[#E5E8EB] text-xs sm:text-sm">{transaction.description}</td>
                  <td className="px-2 sm:px-4 py-2 text-[#E5E8EB] text-xs sm:text-sm hidden sm:table-cell">
                    {transaction.category}
                  </td>
                  <td className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentTransactionsTable; 