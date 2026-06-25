import React, { useState } from 'react';
import { 
  Shield, Users, CreditCard, Activity, Search, AlertTriangle, 
  CheckCircle, Sliders, Settings, Download, Plus, Trash, Edit3, HelpCircle 
} from 'lucide-react';
import { User, SystemLog, SystemSettings, FAQItem } from '../types';

interface AdminPanelProps {
  usersList: User[];
  logs: SystemLog[];
  settings: SystemSettings;
  onUpdateSettings: (settings: Partial<SystemSettings>) => void;
  onUpdateUserPlan: (userId: string, plan: 'free' | 'pro' | 'enterprise') => void;
  onToggleUserStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onDeleteAllUsersExceptAdmin: () => void;
  onAddLog: (action: string, details: string, type: 'info' | 'warning' | 'success') => void;
  faqsList: FAQItem[];
  onAddFaq: (question: string, answer: string, category: 'pricing' | 'tools' | 'general') => void;
  onEditFaq: (id: string, question: string, answer: string, category: 'pricing' | 'tools' | 'general') => void;
  onDeleteFaq: (id: string) => void;
}

export default function AdminPanel({
  usersList,
  logs,
  settings,
  onUpdateSettings,
  onUpdateUserPlan,
  onToggleUserStatus,
  onDeleteUser,
  onDeleteAllUsersExceptAdmin,
  onAddLog,
  faqsList,
  onAddFaq,
  onEditFaq,
  onDeleteFaq,
}: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [limitInput, setLimitInput] = useState(settings.dailyFreeLimit);
  const [proPriceInput, setProPriceInput] = useState(settings.proPriceMonthly);
  const [entPriceInput, setEntPriceInput] = useState(settings.enterprisePriceMonthly);

  // FAQ management states
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState<'pricing' | 'tools' | 'general'>('general');
  const [faqSuccessMessage, setFaqSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'settings' | 'logs' | 'faq'>('dashboard');

  // Custom dialog/confirmation states
  const [userToDeleteConfirm, setUserToDeleteConfirm] = useState<User | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmitFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    if (editingFaqId) {
      onEditFaq(editingFaqId, faqQuestion, faqAnswer, faqCategory);
      setFaqSuccessMessage('FAQ mise à jour avec succès !');
    } else {
      onAddFaq(faqQuestion, faqAnswer, faqCategory);
      setFaqSuccessMessage('FAQ ajoutée avec succès !');
    }

    // Reset Form
    setEditingFaqId(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('general');

    setTimeout(() => {
      setFaqSuccessMessage('');
    }, 3000);
  };

  const handleStartEditFaq = (faq: FAQItem) => {
    setEditingFaqId(faq.id);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqCategory(faq.category);
  };

  const handleCancelEditFaq = () => {
    setEditingFaqId(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('general');
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = usersList.reduce((acc, curr) => {
    if (curr.plan === 'pro') return acc + settings.proPriceMonthly;
    if (curr.plan === 'enterprise') return acc + settings.enterprisePriceMonthly;
    return acc;
  }, 340);

  const totalActiveUsersCount = usersList.length + 154;
  const totalConversions = usersList.reduce((acc, curr) => {
    return acc + Object.values(curr.creditsUsed).reduce((a, b) => a + b, 0);
  }, 1248);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      dailyFreeLimit: Number(limitInput),
      proPriceMonthly: Number(proPriceInput),
      enterprisePriceMonthly: Number(entPriceInput),
    });
    onAddLog('Configuration Système', `Modification des tarifs et de la limite gratuite journalière (${limitInput} fois)`, 'success');
  };

  const handleToggleMaintenance = () => {
    const nextMode = !settings.maintenanceMode;
    onUpdateSettings({ maintenanceMode: nextMode });
    onAddLog(
      'Mode Maintenance',
      `Le mode maintenance a été ${nextMode ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`,
      nextMode ? 'warning' : 'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-rose-600 animate-pulse" />
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight">Console d'Administration</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Supervisez les indicateurs de performance, gérez les abonnements des utilisateurs et modifiez les limites globales de la plateforme.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="admin-export-csv"
            onClick={() => {
              onAddLog('Export Données', "Exportation des rapports d'utilisation au format CSV", 'info');
              setToastMessage("Exportation simulée : SwiftPDF_Rapport_SaaS_2026.csv téléchargé !");
            }}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-300 font-bold text-xs py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button
            id="admin-maintenance-toggle"
            onClick={handleToggleMaintenance}
            className={`font-bold text-xs py-2 px-3.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              settings.maintenanceMode
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-100/35 dark:shadow-none'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {settings.maintenanceMode ? 'Maintenance active' : 'Activer Maintenance'}
          </button>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Menu */}
        <div className="w-full lg:w-64 shrink-0 space-y-2 lg:sticky lg:top-24 h-fit">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Outils de gestion
            </div>
            
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: Sliders, badge: null },
              { id: 'users', label: 'Utilisateurs', icon: Users, badge: usersList.length },
              { id: 'settings', label: 'Paramètres Système', icon: Settings, badge: null },
              { id: 'logs', label: 'Journaux Système', icon: Activity, badge: logs.length },
              { id: 'faq', label: 'Gestion FAQ', icon: HelpCircle, badge: faqsList.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`admin-sidebar-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== null && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                      isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick System Info in Sidebar */}
          <div className="hidden lg:block bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-100/80 dark:border-slate-800 p-4 space-y-2.5 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Statut Plateforme</div>
            <div className="flex justify-between">
              <span>Mode Maintenance :</span>
              <span className={`font-semibold ${settings.maintenanceMode ? 'text-amber-600' : 'text-emerald-600'}`}>
                {settings.maintenanceMode ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Limite gratuite :</span>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">{settings.dailyFreeLimit} conversions</span>
            </div>
            <div className="flex justify-between">
              <span>Prix Plan Pro :</span>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">{settings.proPriceMonthly.toFixed(2)} €/mois</span>
            </div>
          </div>
        </div>

        {/* Right Active Panel Pane */}
        <div className="flex-1 min-w-0 space-y-8">
          
          {/* 1. TABLEAU DE BORD (DASHBOARD) TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Chiffre d'Affaires</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 block mt-1">{totalRevenue.toFixed(2)} €</span>
                    <span className="text-xs font-medium text-emerald-600 mt-1 block">▲ +12.4% ce mois-ci</span>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-xl">
                    <CreditCard className="h-6 w-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Utilisateurs Actifs</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 block mt-1">{totalActiveUsersCount}</span>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1 block">● 14 en ligne en ce moment</span>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-xl">
                    <Users className="h-6 w-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Conversions Réalisées</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 block mt-1">{totalConversions} fichiers</span>
                    <span className="text-xs font-medium text-emerald-600 mt-1 block">✓ Taux de succès 99.8%</span>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-xl">
                    <Activity className="h-6 w-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Abonnés Payants</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-zinc-100 block mt-1">
                      {usersList.filter(u => u.plan !== 'free').length} abonnés
                    </span>
                    <span className="text-xs font-medium text-amber-600 mt-1 block">★ Taux conversion 15.8%</span>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-xl">
                    <Sliders className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 lg:col-span-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm tracking-wide uppercase mb-4">Popularité des Outils</h3>
                    <div className="space-y-3.5">
                      {[
                        { name: 'Fusionner PDF', count: 485, width: '92%', color: 'bg-blue-600' },
                        { name: 'Convertisseur Image', count: 320, width: '68%', color: 'bg-purple-500' },
                        { name: 'Compresser PDF', count: 245, width: '52%', color: 'bg-emerald-500' },
                        { name: 'Image en PDF', count: 180, width: '38%', color: 'bg-amber-500' },
                        { name: 'PDF en Word', count: 140, width: '28%', color: 'bg-blue-500' },
                      ].map((tool, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                            <span className="font-medium">{tool.name}</span>
                            <span className="font-mono text-slate-400">{tool.count} ops</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className={`${tool.color} h-full rounded-full transition-all duration-1000`} style={{ width: tool.width }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-4 leading-normal">
                    Le fusionneur de PDF représente l'outil principal sollicité par nos utilisateurs ce mois-ci.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm tracking-wide uppercase">Évolution des Revenus Mensuels (2026)</h3>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-md">Total : {totalRevenue + 2150} €</span>
                  </div>

                  <div className="relative">
                    <svg viewBox="0 0 500 150" className="w-full h-44 text-blue-500 overflow-visible">
                      <defs>
                        <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgb(37, 99, 235)" stopOpacity="0.2"/>
                          <stop offset="100%" stopColor="rgb(37, 99, 235)" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="1" />
                      <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="1" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="1" />
                      <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" className="dark:stroke-slate-800" strokeWidth="1" strokeDasharray="3" />

                      <path
                        d="M 10 140 Q 90 90, 150 100 T 290 50 T 420 30 L 490 20 L 490 140 Z"
                        fill="url(#revenue-gradient)"
                      />
                      <path
                        d="M 10 140 Q 90 90, 150 100 T 290 50 T 420 30 L 490 20"
                        fill="none"
                        stroke="rgb(37, 99, 235)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      <circle cx="10" cy="140" r="5" fill="white" stroke="rgb(37, 99, 235)" strokeWidth="3" />
                      <circle cx="110" cy="110" r="5" fill="white" stroke="rgb(37, 99, 235)" strokeWidth="3" />
                      <circle cx="210" cy="80" r="5" fill="white" stroke="rgb(37, 99, 235)" strokeWidth="3" />
                      <circle cx="310" cy="50" r="5" fill="white" stroke="rgb(37, 99, 235)" strokeWidth="3" />
                      <circle cx="410" cy="30" r="5" fill="white" stroke="rgb(37, 99, 235)" strokeWidth="3" />
                      <circle cx="490" cy="20" r="5" fill="white" stroke="rgb(37, 99, 235)" strokeWidth="3" />
                    </svg>

                    <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-3 px-1">
                      <span>Janvier</span>
                      <span>Février</span>
                      <span>Mars</span>
                      <span>Avril</span>
                      <span>Mai</span>
                      <span>Juin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. UTILISATEURS (USERS) TAB */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-lg tracking-tight">Utilisateurs enregistrés ({filteredUsers.length})</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Gérez les comptes des utilisateurs de la plateforme, ajustez leurs abonnements et contrôlez leur accès.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
                  <div className="relative w-full sm:max-w-xs shrink-0">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      id="admin-users-search"
                      type="text"
                      placeholder="Rechercher par nom, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs dark:text-zinc-100 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <button
                    id="admin-delete-all-except-admin"
                    onClick={() => setShowDeleteAllConfirm(true)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 font-bold text-xs py-2.5 px-3.5 rounded-xl border border-rose-100 dark:border-rose-900/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash className="h-3.5 w-3.5" /> Supprimer tous sauf l'admin
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Utilisateur</th>
                      <th className="py-3 px-4">Créé le</th>
                      <th className="py-3 px-4">Abonnement</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm uppercase">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900 dark:text-zinc-100 text-xs">{user.name}</span>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                          {user.createdAt}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            aria-label={`Changer d'abonnement pour ${user.name}`}
                            value={user.plan}
                            onChange={(e) => {
                              onUpdateUserPlan(user.id, e.target.value as any);
                              onAddLog('Plan Modifié', `Surclassement manuel de ${user.email} vers ${e.target.value.toUpperCase()}`, 'info');
                            }}
                            className="bg-slate-100 dark:bg-slate-800 border-none text-[10px] font-black uppercase rounded-lg px-2.5 py-1.5 focus:outline-hidden cursor-pointer dark:text-zinc-200"
                          >
                            <option value="free">Gratuit</option>
                            <option value="pro">Pro</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                            user.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' 
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                          }`}>
                            {user.status === 'active' ? 'Actif' : 'Suspendu'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex justify-end items-center gap-1">
                            <button
                              id={`toggle-status-${user.id}`}
                              onClick={() => {
                                onToggleUserStatus(user.id);
                                onAddLog('Statut Modifié', `Changement de statut pour ${user.email}`, 'warning');
                              }}
                              className={`text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                                user.status === 'active'
                                  ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40'
                                  : 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40'
                              }`}
                            >
                                {user.status === 'active' ? 'Suspendre' : 'Réactiver'}
                            </button>
                            {!user.isAdmin && (
                              <button
                                id={`delete-user-${user.id}`}
                                onClick={() => setUserToDeleteConfirm(user)}
                                className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 rounded-lg transition cursor-pointer"
                                title="Supprimer définitivement"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                          Aucun utilisateur trouvé pour cette recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. PARAMÈTRES SYSTÈME TAB */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-lg tracking-tight">Configuration Générale</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Ajustez les quotas gratuits pour l'évaluation des outils et modifiez la tarification des abonnements premium.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 max-w-xl">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="admin-quota-limit">
                    Limite d'utilisation gratuite par jour
                  </label>
                  <input
                    id="admin-quota-limit"
                    type="number"
                    min={1}
                    max={50}
                    value={limitInput}
                    onChange={(e) => setLimitInput(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs dark:text-zinc-100 focus:outline-hidden focus:border-blue-500"
                  />
                  <p className="text-[10px] text-slate-400">Le nombre de crédits de conversion accordés quotidiennement aux comptes gratuits.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="admin-pro-price">
                    Tarif Mensuel Plan Pro (€)
                  </label>
                  <input
                    id="admin-pro-price"
                    type="number"
                    step="0.01"
                    value={proPriceInput}
                    onChange={(e) => setProPriceInput(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs dark:text-zinc-100 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider" htmlFor="admin-ent-price">
                    Tarif Mensuel Plan Enterprise (€)
                  </label>
                  <input
                    id="admin-ent-price"
                    type="number"
                    step="0.01"
                    value={entPriceInput}
                    onChange={(e) => setEntPriceInput(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs dark:text-zinc-100 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="pt-4">
                  <button
                    id="admin-save-settings-btn"
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition cursor-pointer text-xs"
                  >
                    Enregistrer les Paramètres globaux
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. JOURNAUX SYSTÈME TAB */}
          {activeTab === 'logs' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 flex flex-col h-[520px] animate-in fade-in duration-200">
              <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-5 w-5 text-blue-600 animate-spin" />
                  <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm tracking-wide uppercase">Journaux système en temps réel</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold tracking-widest">FIL DE SÉCURITÉ</span>
              </div>

              <div className="overflow-y-auto flex-1 space-y-2.5 pr-2">
                {logs.map((log) => (
                  <div key={log.id} className="text-xs p-3.5 bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                    <div className="font-mono">
                      <span className="text-slate-400 dark:text-slate-500 mr-2">[{log.timestamp}]</span>
                      <span className="font-semibold text-slate-700 dark:text-zinc-300 mr-1.5">{log.action}:</span>
                      <span className="text-slate-500 dark:text-slate-400">{log.details}</span>
                    </div>
                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold font-mono">{log.email}</span>
                      {log.type === 'success' && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                      {log.type === 'warning' && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-center py-24 text-slate-400 dark:text-slate-500 font-medium">
                    Aucun journal d'activité enregistré pour le moment.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. GESTION FAQ TAB */}
          {activeTab === 'faq' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-lg tracking-tight">Gestion de la Foire aux Questions (FAQ)</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Créez et modifiez les questions-réponses interactives affichées en accordéon sur la page d'accueil de la plateforme.
                </p>
              </div>

              {faqSuccessMessage && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-900 border border-emerald-100 text-emerald-800 dark:text-emerald-400 text-xs p-3.5 rounded-xl font-medium animate-in fade-in duration-200">
                  {faqSuccessMessage}
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                
                {/* FAQ list table - 3 cols */}
                <div className="xl:col-span-3 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Questions enregistrées ({faqsList.length})</h4>
                  
                  <div className="space-y-3 max-h-[440px] overflow-y-auto pr-2">
                    {faqsList.map((faq) => (
                      <div key={faq.id} className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-2 flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                              faq.category === 'pricing'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                                : faq.category === 'tools'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400'
                            }`}>
                              {faq.category === 'pricing' ? 'Tarifs' : faq.category === 'tools' ? 'Outils' : 'Général'}
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{faq.question}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            id={`edit-faq-${faq.id}`}
                            onClick={() => handleStartEditFaq(faq)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition cursor-pointer"
                            title="Modifier cette FAQ"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            id={`delete-faq-${faq.id}`}
                            onClick={() => onDeleteFaq(faq.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition cursor-pointer"
                            title="Supprimer cette FAQ"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {faqsList.length === 0 && (
                      <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-800/10 border border-dashed border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 text-xs">
                        Aucune FAQ enregistrée. Utilisez le formulaire pour en ajouter une.
                      </div>
                    )}
                  </div>
                </div>

                {/* Add/Edit Form - 2 cols */}
                <div className="xl:col-span-2 bg-slate-50/60 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <span>{editingFaqId ? 'Modifier la FAQ' : 'Ajouter une FAQ'}</span>
                    {editingFaqId && <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded-sm">MODE ÉDITION</span>}
                  </h4>

                  <form onSubmit={handleSubmitFaq} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1" htmlFor="faq-form-question">
                        Question
                      </label>
                      <input
                        id="faq-form-question"
                        type="text"
                        required
                        placeholder="Ex: Quelle est la taille maximale des fichiers ?"
                        value={faqQuestion}
                        onChange={(e) => setFaqQuestion(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs dark:text-zinc-100 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1" htmlFor="faq-form-category">
                        Catégorie
                      </label>
                      <select
                        id="faq-form-category"
                        value={faqCategory}
                        onChange={(e) => setFaqCategory(e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs cursor-pointer focus:outline-hidden dark:text-zinc-100"
                      >
                        <option value="general">Général & Sécurité</option>
                        <option value="pricing">Tarifs & Abonnements</option>
                        <option value="tools">Utilisation des outils</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1" htmlFor="faq-form-answer">
                        Réponse
                      </label>
                      <textarea
                        id="faq-form-answer"
                        required
                        rows={4}
                        placeholder="Ex: Tous vos fichiers sont chiffrés et stockés temporairement pour être supprimés 2 heures après..."
                        value={faqAnswer}
                        onChange={(e) => setFaqAnswer(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed resize-none dark:text-zinc-100 focus:outline-hidden"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        id="faq-form-submit-btn"
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                      >
                        {editingFaqId ? <CheckCircle className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        <span>{editingFaqId ? 'Enregistrer' : 'Créer la FAQ'}</span>
                      </button>
                      
                      {editingFaqId && (
                        <button
                          id="faq-form-cancel-btn"
                          type="button"
                          onClick={handleCancelEditFaq}
                          className="bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-slate-700 font-bold py-2.5 px-3.5 rounded-xl transition cursor-pointer text-xs"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Custom Toast Notifications */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-zinc-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 dark:border-zinc-700 flex items-center gap-2 animate-in slide-in-from-bottom duration-300">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold font-mono">{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white text-xs cursor-pointer">✕</button>
            </div>
          )}

          {/* Custom Modal for Single User Delete Confirm */}
          {userToDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-100 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3 text-rose-600 mb-4">
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-rose-500" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight dark:text-zinc-100">Confirmer la suppression</h3>
                </div>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur{' '}
                  <strong className="text-slate-900 dark:text-zinc-100">{userToDeleteConfirm.name}</strong> ({userToDeleteConfirm.email}) ?
                  <span className="block mt-2 text-xs text-rose-500 font-semibold font-mono">
                    ⚠️ Cette opération est irréversible et supprimera tout son historique.
                  </span>
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setUserToDeleteConfirm(null)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-zinc-300 font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      onDeleteUser(userToDeleteConfirm.id);
                      setToastMessage(`Utilisateur ${userToDeleteConfirm.email} supprimé.`);
                      setUserToDeleteConfirm(null);
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer shadow-sm shadow-rose-100 dark:shadow-none"
                  >
                    Supprimer définitivement
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Custom Modal for Delete All Except Admin Confirm */}
          {showDeleteAllConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-100 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3 text-rose-600 mb-4">
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-rose-500" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight dark:text-zinc-100">SUPPRESSION TOTALE</h3>
                </div>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer <strong className="text-rose-600">TOUS les utilisateurs</strong> de la base de données (à l'exception des administrateurs) ?
                  <span className="block mt-2 text-xs text-rose-500 font-semibold font-mono border border-rose-100 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/10 p-2 rounded-lg">
                    ⚠️ DANGER : Cette action est définitive et effacera l'intégralité des clients de démonstration.
                  </span>
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteAllConfirm(false)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-zinc-300 font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
                  >
                    Annuler et préserver
                  </button>
                  <button
                    onClick={() => {
                      onDeleteAllUsersExceptAdmin();
                      setToastMessage("Tous les utilisateurs non-administrateurs ont été supprimés.");
                      setShowDeleteAllConfirm(false);
                    }}
                    className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer shadow-md shadow-rose-100 dark:shadow-none"
                  >
                    Tout détruire sauf l'admin
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
