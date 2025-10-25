"use client"
import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
      notCommon: !['password', '123456', 'qwerty', 'abc123', 'senha'].includes(password.toLowerCase())
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score <= 2) return { score, label: 'Muito fraca', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Fraca', color: 'bg-orange-500' };
    if (score <= 4) return { score, label: 'Média', color: 'bg-yellow-500' };
    if (score <= 5) return { score, label: 'Forte', color: 'bg-green-500' };
    return { score, label: 'Muito forte', color: 'bg-green-600' };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Força da senha:</span>
        <span className={strength.score > 0 ? 'text-white' : ''}>{strength.label}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${(strength.score / 6) * 100}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-400">
        <div className="grid grid-cols-2 gap-1">
          <div className={`flex items-center ${password.length >= 8 ? 'text-green-400' : 'text-gray-500'}`}>
            <span className="mr-1">{password.length >= 8 ? '✓' : '○'}</span>
            8+ caracteres
          </div>
          <div className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
            <span className="mr-1">{/[a-z]/.test(password) ? '✓' : '○'}</span>
            Minúscula
          </div>
          <div className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
            <span className="mr-1">{/[A-Z]/.test(password) ? '✓' : '○'}</span>
            Maiúscula
          </div>
          <div className={`flex items-center ${/\d/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
            <span className="mr-1">{/\d/.test(password) ? '✓' : '○'}</span>
            Número
          </div>
          <div className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) ? 'text-green-400' : 'text-gray-500'}`}>
            <span className="mr-1">{/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) ? '✓' : '○'}</span>
            Símbolo
          </div>
          <div className={`flex items-center ${!['password', '123456', 'qwerty', 'abc123', 'senha'].includes(password.toLowerCase()) ? 'text-green-400' : 'text-gray-500'}`}>
            <span className="mr-1">{!['password', '123456', 'qwerty', 'abc123', 'senha'].includes(password.toLowerCase()) ? '✓' : '○'}</span>
            Não comum
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;

