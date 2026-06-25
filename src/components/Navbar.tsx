import React, { useState } from 'react';
import { Layers, User, LogOut, Shield, Zap, Sparkles, Menu, X, CreditCard, Sun, Moon } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentUser: UserType | null;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  onToggleAdmin: () => void;
  onChangePlan: (plan: 'free' | 'pro' | 'enterprise') => void;
  activeScreen: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navbar({
  currentUser,
  onNavigate,
  onLogout,
  onToggleAdmin,
  onChangePlan,
  activeScreen,
  darkMode,
  onToggleDarkMode,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Calculate total daily usage
  const totalFreeLimit = 3;
  const showCredits = currentUser && currentUser.plan === 'free';

  const handleNav = (screen: string) => {
    onNavigate(screen);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center">
            <button
              id="navbar-logo-btn"
              onClick={() => handleNav(currentUser ? 'dashboard' : 'landing')}
              className="flex items-center space-x-2.5 hover:opacity-90 transition group cursor-pointer"
            >
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-200 group-hover:scale-105 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="block font-extrabold text-slate-900 tracking-tight text-lg">
                  SwiftPDF <span className="text-blue-600">Pro</span>
                </span>
                <span className="block text-[10px] text-blue-600 font-mono font-bold uppercase tracking-widest">
                  SaaS PDF & Image
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              id="nav-landing-btn"
              onClick={() => handleNav('landing')}
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeScreen === 'landing'
                  ? 'text-blue-600 bg-blue-50/70 border border-blue-100/50'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Accueil
            </button>
            {currentUser && (
              <button
                id="nav-dashboard-btn"
                onClick={() => handleNav('dashboard')}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeScreen === 'dashboard'
                    ? 'text-blue-600 bg-blue-50/70 border border-blue-100/50'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                Tableau de bord
              </button>
            )}
            <button
              id="nav-pricing-btn"
              onClick={() => handleNav('pricing')}
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeScreen === 'pricing'
                  ? 'text-blue-600 bg-blue-50/70 border border-blue-100/50'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Abonnements
            </button>

            {currentUser?.isAdmin && (
              <button
                id="nav-admin-btn"
                onClick={() => handleNav('admin')}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeScreen === 'admin'
                    ? 'text-rose-600 bg-rose-50 border border-rose-100/50'
                    : 'text-slate-700 hover:text-rose-600 hover:bg-rose-50/50'
                }`}
              >
                <Shield className="h-4 w-4" />
                Administration
              </button>
            )}

            {/* Quick Testing Controls (Header Badge) */}
            {currentUser && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50/50 rounded-full border border-blue-100/60">
                <span className="text-[10px] uppercase font-mono font-bold text-blue-500">
                  Plan :
                </span>
                <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  currentUser.plan === 'enterprise' 
                    ? 'bg-purple-100 text-purple-700' 
                    : currentUser.plan === 'pro' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {currentUser.plan}
                </span>
                {/* Simulated quick switches */}
                <select
                  aria-label="Changer de forfait (Test)"
                  value={currentUser.plan}
                  onChange={(e) => onChangePlan(e.target.value as any)}
                  className="bg-transparent border-none text-xs text-blue-700 font-bold focus:outline-hidden cursor-pointer"
                >
                  <option value="free">Test: Gratuit</option>
                  <option value="pro">Test: Pro</option>
                  <option value="enterprise">Test: Enterprise</option>
                </select>
              </div>
            )}

            {/* Global Dark Mode Toggle */}
            <button
              id="desktop-dark-mode-toggle"
              onClick={onToggleDarkMode}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
              title={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
              aria-label="Basculer le mode sombre"
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="nav-profile-dropdown-trigger"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200/60 py-2 animate-in fade-in duration-100">
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Connecté en tant que</p>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {currentUser.email}
                      </p>
                    </div>

                    <button
                      id="nav-profile-btn"
                      onClick={() => {
                        handleNav('profile');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 transition flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <User className="h-4 w-4 text-blue-500" />
                      Mon Profil
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      id="nav-logout-btn"
                      onClick={() => {
                        onLogout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50/50 transition flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  id="nav-login-btn"
                  onClick={() => onNavigate('auth_login')}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition cursor-pointer"
                >
                  Connexion
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => onNavigate('auth_signup')}
                  className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition shadow-md shadow-blue-100 cursor-pointer"
                >
                  S'enregistrer
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-blue-600 p-2 rounded-lg cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 py-3 px-4 space-y-3 shadow-md animate-in slide-in-from-top duration-200">
          <button
            id="mobile-nav-landing-btn"
            onClick={() => handleNav('landing')}
            className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
              activeScreen === 'landing'
                ? 'text-blue-600 bg-blue-50 border border-blue-100/30'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Accueil
          </button>
          {currentUser && (
            <button
              id="mobile-nav-dashboard-btn"
              onClick={() => handleNav('dashboard')}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
                activeScreen === 'dashboard'
                  ? 'text-blue-600 bg-blue-50 border border-blue-100/30'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Tableau de bord
            </button>
          )}
          <button
            id="mobile-nav-pricing-btn"
            onClick={() => handleNav('pricing')}
            className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
              activeScreen === 'pricing'
                ? 'text-blue-600 bg-blue-50 border border-blue-100/30'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Abonnements
          </button>

          {/* Global Dark Mode Toggle */}
          <button
            id="mobile-dark-mode-toggle"
            onClick={onToggleDarkMode}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <span>Thème {darkMode ? "Sombre" : "Clair"}</span>
            {darkMode ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-500" />
            )}
          </button>

          {currentUser?.isAdmin && (
            <button
              id="mobile-nav-admin-btn"
              onClick={() => handleNav('admin')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-rose-600 bg-rose-50"
            >
              Administration
            </button>
          )}

          {currentUser && (
            <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-100/50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Abonnement actuel:</span>
                <span className="font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                  {currentUser.plan}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Forfait test :</span>
                <select
                  aria-label="Changer de forfait mobile (Test)"
                  value={currentUser.plan}
                  onChange={(e) => onChangePlan(e.target.value as any)}
                  className="bg-transparent text-xs text-slate-700 font-bold focus:outline-hidden"
                >
                  <option value="free">Gratuit</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          )}

          {currentUser ? (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <button
                id="mobile-nav-profile-btn"
                onClick={() => handleNav('profile')}
                className="block w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg"
              >
                Mon Profil
              </button>
              <button
                id="mobile-nav-logout-btn"
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 text-sm font-medium rounded-lg"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                id="mobile-nav-login-btn"
                onClick={() => onNavigate('auth_login')}
                className="w-full text-center py-2.5 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
              >
                Connexion
              </button>
              <button
                id="mobile-nav-signup-btn"
                onClick={() => onNavigate('auth_signup')}
                className="w-full text-center py-2.5 rounded-lg font-bold bg-blue-600 text-white shadow-md shadow-blue-100"
              >
                S'enregistrer
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
