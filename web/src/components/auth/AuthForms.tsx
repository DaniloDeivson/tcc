"use client"
// Form de Login/Cadastro simples com redirect pós-login
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/auth';
import { ValidationService } from '@/lib/validation';
import { WorkingEmailService } from '@/lib/workingEmailService';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

type AuthFormsProps = {
  // Chamado após login bem-sucedido (para redirecionar)
  onSuccessLogin?: () => void;
};

const AuthForms = ({ onSuccessLogin }: AuthFormsProps) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [forgotData, setForgotData] = useState({ email: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  
  // Estados para validação em tempo real
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  const onLogin = async () => {
    setError(null); setMessage(null); setLoading(true);
    try {
      const success = await login(loginData.email, loginData.password);
      if (success) {
        setMessage('Login realizado com sucesso!');
        // Redireciona para o dashboard quando houver handler
        if (onSuccessLogin) onSuccessLogin();
      } else {
        setError('Falha no login. Verifique suas credenciais.');
      }
    } catch (e: any) {
      // Exibir mensagem de erro específica
      setError(e.message || 'Falha no login. Verifique suas credenciais.');
    } finally { setLoading(false); }
  };

  const onRegister = async () => {
    setError(null); setMessage(null);
    
    // Validação antes de enviar
    const validation = ValidationService.validateRegistration(
      registerData.name, 
      registerData.email, 
      registerData.password
    );
    
    if (!validation.isValid) {
      setError(validation.errorMessage);
      return;
    }
    
    setLoading(true);
    try {
      // Registrar usuário no sistema
      const registrationSuccess = await register(registerData.name, registerData.email, registerData.password);
      
      if (registrationSuccess) {
        // Enviar email de verificação
        const emailSent = await WorkingEmailService.sendVerificationEmail(registerData.email, registerData.name);
        
        if (emailSent) {
          setVerificationSent(true);
          setMessage(`✅ Cadastro realizado com sucesso! Email de verificação enviado para ${registerData.email}. Verifique sua caixa de entrada e spam.`);
          setRegisterData({ name: '', email: '', password: '' });
          setValidationErrors({ name: '', email: '', password: '' });
        } else {
          setMessage(`✅ Cadastro realizado com sucesso! (Email de verificação não pôde ser enviado)`);
          setRegisterData({ name: '', email: '', password: '' });
          setValidationErrors({ name: '', email: '', password: '' });
        }
      }
    } catch (e: any) {
      setError(e.message || 'Falha no cadastro. E-mail pode já estar em uso.');
    } finally { setLoading(false); }
  };

  const onForgotPassword = async () => {
    setError(null); setMessage(null);
    
    if (!forgotData.email) {
      setError('Por favor, digite seu email.');
      return;
    }
    
    setLoading(true);
    try {
      // Enviar email de recuperação
      const emailSent = await WorkingEmailService.sendPasswordResetEmail(forgotData.email);
      
      if (emailSent) {
        setEmailSent(true);
        setMessage(`✅ Email de recuperação enviado para ${forgotData.email}! Verifique sua caixa de entrada e spam.`);
        setForgotData({ email: '' });
      } else {
        setError('Falha ao enviar email de recuperação. Tente novamente.');
      }
    } catch (e) {
      setError('Falha ao enviar email de recuperação. Tente novamente.');
    } finally { setLoading(false); }
  };

  // Validação em tempo real
  const validateField = (field: 'name' | 'email' | 'password', value: string) => {
    let result = { isValid: true, errorMessage: '' };
    
    switch (field) {
      case 'name':
        result = ValidationService.validateName(value);
        break;
      case 'email':
        result = ValidationService.validateEmail(value);
        break;
      case 'password':
        result = ValidationService.validatePassword(value);
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: result.isValid ? '' : result.errorMessage
    }));
  };

  return (
    <div className="w-full max-w-2xl justify-center align-center mx-auto bg-[#1A3A1A] rounded-2xl p-10 md:p-12 text-white shadow-2xl min-h-[600px] border border-[#6B8A6B]">
      {/* Header com título */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">💰 NestFin</h1>
        <p className="text-[#B8D4B8] text-sm">Sua plataforma financeira pessoal</p>
      </div>
      
      {/* Tabs melhorados */}
      <div className="flex space-x-2 mb-8 bg-[#1A3A1A] p-1 rounded-xl border border-[#6B8A6B]">
        <button 
          onClick={() => setTab('login')} 
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm ${
            tab === 'login' 
              ? 'bg-[#4A7C4A] text-white shadow-lg transform scale-105 border border-[#6B8A6B]' 
              : 'text-[#B8D4B8] hover:text-white hover:bg-[#2A4A2A]'
          }`}
        >
          🔐 Login
        </button>
        <button 
          onClick={() => setTab('register')} 
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm ${
            tab === 'register' 
              ? 'bg-[#4A7C4A] text-white shadow-lg transform scale-105 border border-[#6B8A6B]' 
              : 'text-[#B8D4B8] hover:text-white hover:bg-[#2A4A2A]'
          }`}
        >
          ✨ Cadastro
        </button>
        <button 
          onClick={() => setTab('forgot')} 
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm ${
            tab === 'forgot' 
              ? 'bg-[#4A7C4A] text-white shadow-lg transform scale-105 border border-[#6B8A6B]' 
              : 'text-[#B8D4B8] hover:text-white hover:bg-[#2A4A2A]'
          }`}
        >
          🔑 Recuperar
        </button>
      </div>
      {/* Mensagens melhoradas */}
      {error && (
        <div className="mb-6 p-4 bg-[#1A3A1A] rounded-xl text-base border border-[#6B8A6B] shadow-lg">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        </div>
      )}
      {message && (
        <div className="mb-6 p-4 bg-[#1A3A1A] rounded-xl text-base border border-[#6B8A6B] shadow-lg">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            {message}
          </div>
        </div>
      )}

      {tab === 'login' && (
        <div className="space-y-6">
          {/* Campo Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-[#B8D4B8] text-lg">📧</span>
            </div>
            <input 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1A3A1A] border-2 border-[#6B8A6B] text-lg text-white placeholder-[#B8D4B8] focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300" 
              placeholder="Digite seu email" 
              type="email" 
              value={loginData.email} 
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} 
            />
          </div>
          
          {/* Campo Senha */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-[#B8D4B8] text-lg">🔒</span>
            </div>
            <input 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1A3A1A] border-2 border-[#6B8A6B] text-lg text-white placeholder-[#B8D4B8] focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300" 
              placeholder="Digite sua senha" 
              type="password" 
              value={loginData.password} 
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} 
            />
          </div>
          
          {/* Botão Login */}
          <button 
            disabled={loading} 
            onClick={onLogin} 
            className="w-full p-4 text-lg bg-[#4A7C4A] rounded-xl disabled:opacity-50 hover:bg-[#5A8C5A] transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#6B8A6B]"
          >
            {loading ? '🔄 Entrando...' : '🚀 Entrar'}
          </button>
          
          {/* Link Esqueci a senha */}
          <button 
            type="button" 
            onClick={() => setTab('forgot')}
            className="w-full text-center text-sm text-[#B8D4B8] hover:text-white hover:underline transition-colors duration-300"
          >
            🔗 Esqueci a senha
          </button>
        </div>
      )}

      {tab === 'register' && (
        <div className="space-y-6">
          {/* Campo Nome */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-[#B8D4B8] text-lg">👤</span>
              </div>
              <input 
                className={`w-full pl-12 pr-4 py-4 rounded-xl bg-[#1A3A1A] border-2 text-lg text-white placeholder-[#B8D4B8] focus:ring-2 focus:ring-green-400/20 transition-all duration-300 ${
                  validationErrors.name ? 'border-red-500 focus:border-red-400' : 'border-[#6B8A6B] focus:border-green-400'
                }`} 
                placeholder="Digite seu nome completo" 
                value={registerData.name} 
                onChange={(e) => {
                  setRegisterData({ ...registerData, name: e.target.value });
                  validateField('name', e.target.value);
                }} 
              />
            </div>
            {validationErrors.name && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {validationErrors.name}
              </p>
            )}
          </div>
          
          {/* Campo Email */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-[#B8D4B8] text-lg">📧</span>
              </div>
              <input 
                className={`w-full pl-12 pr-4 py-4 rounded-xl bg-[#1A3A1A] border-2 text-lg text-white placeholder-[#B8D4B8] focus:ring-2 focus:ring-green-400/20 transition-all duration-300 ${
                  validationErrors.email ? 'border-red-500 focus:border-red-400' : 'border-[#6B8A6B] focus:border-green-400'
                }`} 
                placeholder="Digite seu email" 
                type="email" 
                value={registerData.email} 
                onChange={(e) => {
                  setRegisterData({ ...registerData, email: e.target.value });
                  validateField('email', e.target.value);
                }} 
              />
            </div>
            {validationErrors.email && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {validationErrors.email}
              </p>
            )}
          </div>
          
          {/* Campo Senha */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-[#B8D4B8] text-lg">🔒</span>
              </div>
              <input 
                className={`w-full pl-12 pr-4 py-4 rounded-xl bg-[#1A3A1A] border-2 text-lg text-white placeholder-[#B8D4B8] focus:ring-2 focus:ring-green-400/20 transition-all duration-300 ${
                  validationErrors.password ? 'border-red-500 focus:border-red-400' : 'border-[#6B8A6B] focus:border-green-400'
                }`} 
                placeholder="Crie uma senha forte" 
                type="password" 
                value={registerData.password} 
                onChange={(e) => {
                  setRegisterData({ ...registerData, password: e.target.value });
                  validateField('password', e.target.value);
                }} 
              />
            </div>
            {validationErrors.password && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {validationErrors.password}
              </p>
            )}
            <PasswordStrengthIndicator password={registerData.password} />
          </div>
          
          {/* Botão Cadastrar */}
          <button 
            disabled={loading || !ValidationService.validateRegistration(registerData.name, registerData.email, registerData.password).isValid} 
            onClick={onRegister} 
            className="w-full p-4 text-lg bg-[#4A7C4A] rounded-xl disabled:opacity-50 hover:bg-[#5A8C5A] transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#6B8A6B]"
          >
            {loading ? '🔄 Cadastrando...' : '✨ Criar Conta'}
          </button>
        </div>
      )}

      {tab === 'forgot' && (
        <div className="space-y-6">
          {/* Campo Email para recuperação */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-[#B8D4B8] text-lg">📧</span>
            </div>
            <input 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1A3A1A] border-2 border-[#6B8A6B] text-lg text-white placeholder-[#B8D4B8] focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300" 
              placeholder="Digite seu email cadastrado" 
              type="email" 
              value={forgotData.email} 
              onChange={(e) => setForgotData({ email: e.target.value })} 
            />
          </div>
          
          {/* Botão Enviar */}
          <button 
            disabled={loading || !forgotData.email} 
            onClick={onForgotPassword} 
            className="w-full p-4 text-lg bg-[#4A7C4A] rounded-xl disabled:opacity-50 hover:bg-[#5A8C5A] transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#6B8A6B]"
          >
            {loading ? '🔄 Enviando...' : '📧 Enviar Email de Recuperação'}
          </button>
          
          {/* Link Voltar ao Login */}
          <button 
            type="button" 
            onClick={() => setTab('login')}
            className="w-full text-center text-sm text-[#B8D4B8] hover:text-white hover:underline transition-colors duration-300"
          >
            🔙 Voltar ao Login
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthForms;
