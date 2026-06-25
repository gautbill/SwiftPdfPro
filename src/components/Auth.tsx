import React, { useState } from 'react';
import { Layers, Mail, Lock, User, ArrowRight, Sparkles, Check, AlertCircle, Shield } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (email: string, name: string, isAdmin: boolean) => void;
  initialMode?: 'login' | 'signup' | 'admin';
}

export default function Auth({ onLoginSuccess, initialMode = 'login' }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'admin'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      const isOfficialAdmin = email.toLowerCase() === 'admin@swiftpdf.pro' && password === 'SwiftAdmin2026!';

      if (mode === 'admin') {
        if (isOfficialAdmin) {
          onLoginSuccess(email, 'Admin SwiftPDF', true);
        } else {
          setError('Identifiants administrateur incorrects. Accès refusé.');
        }
        return;
      }

      // If they try logging in using the official admin credentials in standard login, let them in as admin
      onLoginSuccess(email, isOfficialAdmin ? 'Admin SwiftPDF' : email.split('@')[0], isOfficialAdmin);
    }, 1000);
  };

  const handleQuickLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('client@gmail.com', 'Gautier', false);
    }, 450);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-100 mb-4 animate-bounce">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Ravi de vous revoir' : mode === 'admin' ? 'Espace Administrateur' : 'Créez votre compte'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {mode === 'login' 
              ? 'Accédez à votre espace et à vos conversions illimitées' 
              : mode === 'admin'
              ? 'Connexion sécurisée réservée aux administrateurs de la plateforme'
              : 'Commencez avec 3 conversions gratuites par outil et par jour'}
          </p>
        </div>

        {/* Auth Card */}
        <div className={`bg-white p-8 rounded-2xl border ${mode === 'admin' ? 'border-slate-800 shadow-slate-900/10' : 'border-slate-100 shadow-slate-100/50'} shadow-xl transition-all duration-300`}>
          {mode === 'admin' && (
            <div className="mb-5 p-3.5 bg-slate-900 text-white rounded-xl text-xs space-y-1 text-left shadow-md">
              <span className="font-extrabold flex items-center gap-1 text-blue-400 uppercase tracking-wider text-[10px]">
                <Shield className="h-3.5 w-3.5 text-blue-400 shrink-0" /> Accès Sécurisé Restreint
              </span>
              <p className="leading-relaxed text-slate-300">
                Seuls les administrateurs disposant d'identifiants valides peuvent se connecter. Toute tentative d'accès non autorisé sera bloquée.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm flex items-start gap-2 animate-shake">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="auth-name">
                  Nom Complet
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="auth-email">
                Adresse Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="votre-email@adresse.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="auth-password">
                  Mot de passe
                </label>
                {mode === 'login' && (
                  <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                    Mot de passe oublié ?
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="auth-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-100 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Se connecter' : mode === 'admin' ? 'Se connecter (Admin)' : 'Créer mon compte'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode links */}
          <div className="mt-6 text-center space-y-3 flex flex-col items-center">
            {mode !== 'admin' && (
              <button
                id="auth-toggle-mode-btn"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm text-blue-600 hover:underline font-medium cursor-pointer"
              >
                {mode === 'login' 
                  ? "Vous n'avez pas de compte ? S'inscrire" 
                  : "Vous possédez déjà un compte ? Se connecter"}
              </button>
            )}

            {mode !== 'admin' ? (
              <button
                id="auth-admin-mode-btn"
                onClick={() => {
                  setMode('admin');
                  setError('');
                }}
                className="text-xs text-slate-400 hover:text-blue-600 hover:underline font-semibold cursor-pointer flex items-center gap-1 mt-1"
              >
                <Shield className="h-3 w-3 text-slate-400" />
                Espace d'administration sécurisé
              </button>
            ) : (
              <button
                id="auth-user-mode-btn"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer flex items-center gap-1 mt-1"
              >
                Retour à la connexion client
              </button>
            )}
          </div>
        </div>

        {/* Demo Fast Login Helper */}
        <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-800 mb-2 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            Accès d'évaluation rapide (Sans Formulaire)
          </div>
          <p className="text-xs text-amber-700/85 mb-3.5 leading-normal">
            Basculez instantanément sur le profil client de test pour explorer l'ensemble du site.
          </p>
          <div className="flex gap-2">
            <button
              id="quick-user-login-btn"
              onClick={() => handleQuickLogin()}
              disabled={loading}
              className="w-full bg-white hover:bg-amber-100/50 text-amber-900 border border-amber-200 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 text-amber-600" />
              Compte Standard de Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
