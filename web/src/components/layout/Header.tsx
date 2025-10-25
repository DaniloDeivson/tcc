"use client"
import React, { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';

interface HeaderProps {
  onSelectDashboard: () => void;
  onSelectPersonal: () => void;
  onSelectMetas: () => void;
  onSelectApi: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSelectDashboard, onSelectPersonal, onSelectMetas, onSelectApi }) => {
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('nestfin_user');
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u?.name ?? null);
      }
    } catch {
      setUserName(null);
    }
  }, []);

  const handleNavClick = (callback: () => void) => {
    callback();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-[#1A3A1A] to-[#2A4A2A] border-b border-[#6B8A6B] w-full relative shadow-lg backdrop-blur-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 animate-fadeInUp">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-white to-[#B8D4B8] bg-clip-text text-transparent hover-glow">
              💰 NestFin
            </h1>
            {/* Chip com nome do usuário (mobile e desktop) */}
            {mounted && userName && (
              <div className="px-2 sm:px-3 py-1 rounded-full border border-green-600 bg-[#122112] text-green-400 text-[10px] sm:text-xs font-medium whitespace-nowrap">
                {userName}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex justify-end items-center space-x-4 xl:space-x-6">
            <button
              onClick={onSelectDashboard}
              className="text-white hover:text-[#c6ffe9] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover-lift hover-glow"
            >
              📊 Dashboard
            </button>
            <button
              onClick={onSelectPersonal}
              className="text-white hover:text-[#c6ffe9] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover-lift hover-glow"
            >
              👤 Informações
            </button>
            <button
              onClick={onSelectMetas}
              className="text-white hover:text-[#c6ffe9] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover-lift hover-glow"
            >
              🎯 Metas
            </button>
            <button
              onClick={onSelectApi}
              className="text-white hover:text-[#c6ffe9] px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover-lift hover-glow"
            >
              ✨ Cadastrar
            </button>
            {mounted && userName && (
              <button
                onClick={() => { authService.logout(); setUserName(null); window.location.reload(); }}
                className="text-red-300 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover-lift hover-glow"
              >
                🚪 Sair
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 rounded-md hover:bg-[#2B402B] transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-[#6B8A6B] mt-2 animate-slideInRight">
            <button
              onClick={() => handleNavClick(onSelectDashboard)}
              className="w-full text-left text-white hover:text-[#c6ffe9] px-3 py-2 rounded-md text-sm font-medium hover:bg-[#3A5A3A] transition-all duration-300 hover-lift"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => handleNavClick(onSelectPersonal)}
              className="w-full text-left text-white hover:text-[#c6ffe9] px-3 py-2 rounded-md text-sm font-medium hover:bg-[#3A5A3A] transition-all duration-300 hover-lift"
            >
              👤 Informações Pessoais
            </button>
            <button
              onClick={() => handleNavClick(onSelectMetas)}
              className="w-full text-left text-white hover:text-[#c6ffe9] px-3 py-2 rounded-md text-sm font-medium hover:bg-[#3A5A3A] transition-all duration-300 hover-lift"
            >
              🎯 Metas
            </button>
            <button
              onClick={() => handleNavClick(onSelectApi)}
              className="w-full text-left text-white hover:text-[#c6ffe9] px-3 py-2 rounded-md text-sm font-medium hover:bg-[#3A5A3A] transition-all duration-300 hover-lift"
            >
              ✨ Cadastrar
            </button>
            {mounted && userName && (
              <button
                onClick={() => { authService.logout(); setUserName(null); window.location.reload(); }}
                className="w-full text-left text-red-300 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium hover:bg-[#3A5A3A] transition-all duration-300 hover-lift"
              >
                🚪 Sair
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
