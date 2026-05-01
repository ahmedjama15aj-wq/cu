/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Logo } from './Logo';
import { Menu, X, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';
import { useAuth } from '../AuthContext';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  onNavigate?: (view: 'home' | 'dashboard' | 'search' | 'registration' | 'privacy-policy' | 'terms-of-service' | 'verification') => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, isAuthModalOpen, setIsAuthModalOpen }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const handleLogoClick = () => {
    onNavigate?.('home');
    setIsOpen(false);
  };

  const handleDashboardClick = () => {
    onNavigate?.('dashboard');
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24 items-center">
            <div 
              className="flex items-center cursor-pointer group"
              onClick={handleLogoClick}
            >
              <Logo className="w-[59px] h-[59px]" variant="square" />
              <span className="ml-3 text-2xl lg:text-3xl font-serif text-slate-900 tracking-tight hidden sm:block group-hover:text-orange-600 transition-colors">
                Cupping <span className="italic font-light">Connect</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-10">
              <button 
                onClick={() => {
                  onNavigate?.('search');
                  setIsOpen(false);
                }}
                className="text-slate-500 hover:text-teal-600 font-medium transition-colors text-sm uppercase tracking-widest whitespace-nowrap"
              >
                Find Providers
              </button>
              <button 
                onClick={() => {
                  onNavigate?.('home');
                  setTimeout(() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                  setIsOpen(false);
                }}
                className="text-slate-500 hover:text-teal-600 font-medium transition-colors text-sm uppercase tracking-widest whitespace-nowrap"
              >
                How it Works
              </button>
              <button 
                onClick={() => {
                  onNavigate?.('registration');
                  setIsOpen(false);
                }}
                className="text-slate-500 hover:text-teal-600 font-medium transition-colors text-sm uppercase tracking-widest whitespace-nowrap"
              >
                For Practitioners
              </button>
              <div className="flex items-center gap-6 ml-6">
                <CurrencySelector />
                {user ? (
                  <div className="flex items-center gap-6">
                    {user.role === 'admin' && (
                      <button 
                        onClick={() => {
                          onNavigate?.('verification');
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-rose-600 transition-all text-xs uppercase tracking-widest cursor-pointer active:scale-95 transform whitespace-nowrap shadow-lg shadow-rose-200"
                        title="Admin Access"
                      >
                        <Shield className="w-4 h-4" />
                        <span className="hidden lg:inline">Admin Access</span>
                      </button>
                    )}
                    <button 
                      onClick={handleDashboardClick}
                      className="flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors text-sm uppercase tracking-widest"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="hidden lg:inline">Dashboard</span>
                    </button>
                    <button 
                      onClick={() => logout()}
                      className="flex items-center gap-2 text-slate-400 font-semibold hover:text-rose-500 transition-colors text-sm uppercase tracking-widest"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden lg:inline">Logout</span>
                    </button>
                    <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center border border-teal-100 shrink-0">
                      <span className="text-teal-700 font-bold uppercase text-sm">{user.displayName[0]}</span>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2 text-sm uppercase tracking-widest whitespace-nowrap"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors p-2"
              >
                {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-50 py-6 px-4 space-y-4 shadow-2xl">
            <button 
              onClick={() => {
                onNavigate?.('search');
                setIsOpen(false);
              }}
              className="block w-full text-left text-lg font-medium text-slate-700 hover:text-teal-600 px-4 py-2"
            >
              Find Providers
            </button>
            <button 
              onClick={() => {
                onNavigate?.('home');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                setIsOpen(false);
              }}
              className="block w-full text-left text-lg font-medium text-slate-700 hover:text-teal-600 px-4 py-2"
            >
              How it Works
            </button>
            <button 
              onClick={() => {
                onNavigate?.('registration');
                setIsOpen(false);
              }}
              className="block w-full text-left text-lg font-medium text-slate-700 hover:text-teal-600 px-4 py-2"
            >
              For Practitioners
            </button>
            <div className="pt-4 border-t border-slate-50">
              {user ? (
                <div className="space-y-3">
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => {
                        onNavigate?.('verification');
                        setIsOpen(false);
                      }}
                      className="w-full bg-rose-50 text-rose-600 py-4 rounded-2xl font-bold shadow-sm flex items-center justify-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Admin Verification
                    </button>
                  )}
                  <button 
                    onClick={handleDashboardClick}
                    className="w-full bg-teal-50 text-teal-600 py-4 rounded-2xl font-bold shadow-sm"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => logout()}
                    className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-bold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onNavigate={onNavigate} />
    </>
  );
};
