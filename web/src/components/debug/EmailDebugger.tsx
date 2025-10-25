'use client'
import React, { useState, useEffect } from 'react';
import { WorkingEmailService } from '@/lib/workingEmailService';

const EmailDebugger: React.FC = () => {
  const [emails, setEmails] = useState<any[]>([]);
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    setEmails(WorkingEmailService.getSentEmails());
  }, []);

  const clearEmails = () => {
    WorkingEmailService.clearSentEmails();
    setEmails([]);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  if (!showDebugger) {
    return (
      <button
        onClick={() => setShowDebugger(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50"
      >
        📧 Ver Emails ({emails.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A3A1A] rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#6B8A6B]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">📧 Emails Enviados (Debug)</h2>
          <button
            onClick={() => setShowDebugger(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {emails.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#B8D4B8]">Nenhum email enviado ainda.</p>
            <p className="text-sm text-gray-400 mt-2">
              Faça um cadastro ou recuperação de senha para ver os emails aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {emails.map((email, index) => (
              <div key={index} className="bg-[#2A4A2A] rounded-lg p-4 border border-[#6B8A6B]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold">
                    {email.type === 'verification' ? '🔐 Verificação de Email' : '🔑 Recuperação de Senha'}
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${email.isReal ? 'bg-green-600 text-white' : 'bg-yellow-600 text-black'}`}>
                      {email.isReal ? 'REAL' : 'SIMULADO'}
                    </span>
                  </h3>
                  <span className="text-xs text-gray-400">{formatDate(email.timestamp)}</span>
                </div>
                <p className="text-[#B8D4B8] mb-2">Para: {email.email}</p>
                {email.name && <p className="text-[#B8D4B8] mb-2">Nome: {email.name}</p>}
                <p className="text-[#B8D4B8] mb-2">Assunto: {email.subject}</p>
                <p className="text-[#B8D4B8] mb-2">Status: {email.deliveryStatus}</p>
                <div className="bg-[#1A3A1A] rounded p-3 text-sm mb-3">
                  <p className="text-white font-medium mb-2">Conteúdo do Email:</p>
                  <p className="text-[#B8D4B8] whitespace-pre-line text-xs">{email.content}</p>
                </div>
                <div className="bg-[#1A3A1A] rounded p-3 text-sm">
                  <p className="text-white font-medium mb-1">Link de Ação:</p>
                  <p className="text-green-400 break-all">
                    {email.type === 'verification' 
                      ? `http://localhost:3003/verify?token=${email.token}`
                      : `http://localhost:3003/reset-password?token=${email.token}`
                    }
                  </p>
                </div>
              </div>
            ))}
            
            <button
              onClick={clearEmails}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              🗑️ Limpar Todos os Emails
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-[#2A4A2A] rounded-lg border border-[#6B8A6B]">
          <h3 className="text-white font-semibold mb-2">ℹ️ Como Funciona:</h3>
          <ul className="text-sm text-[#B8D4B8] space-y-1">
            <li>• Os emails são simulados e salvos localmente</li>
            <li>• Em produção, seria integrado com SendGrid, AWS SES, etc.</li>
            <li>• Os links são funcionais para demonstração</li>
            <li>• Clique nos links para testar a funcionalidade</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailDebugger;
