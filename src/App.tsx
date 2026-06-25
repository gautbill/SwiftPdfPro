import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import ImageConverter from './components/tools/ImageConverter';
import ImageToPdf from './components/tools/ImageToPdf';
import GenericTool from './components/tools/GenericTool';
import { User, Operation, Invoice, SystemLog, SystemSettings, ToolId, FAQItem } from './types';
import { Sparkles, Mail, User as UserIcon, Calendar, Check, Shield, AlertTriangle } from 'lucide-react';

const SEED_USERS: User[] = [
  {
    id: 'user_1',
    email: 'gautierck@gmail.com',
    name: 'Gautier C.',
    plan: 'free',
    creditsUsed: {
      merge: 1, split: 0, compress: 1, pdf2img: 0,
      img2pdf: 2, pdf2word: 0, word2pdf: 0, imgconvert: 0
    },
    createdAt: '2026-06-12',
    isAdmin: false,
    status: 'active',
  },
  {
    id: 'user_2',
    email: 'sophie.martin@entreprise.fr',
    name: 'Sophie Martin',
    plan: 'pro',
    creditsUsed: {
      merge: 12, split: 4, compress: 8, pdf2img: 15,
      img2pdf: 22, pdf2word: 5, word2pdf: 3, imgconvert: 19
    },
    createdAt: '2026-05-20',
    isAdmin: false,
    status: 'active',
  },
  {
    id: 'user_3',
    email: 'clara.lefevre@agence-web.com',
    name: 'Clara Lefèvre',
    plan: 'enterprise',
    creditsUsed: {
      merge: 85, split: 34, compress: 50, pdf2img: 90,
      img2pdf: 110, pdf2word: 40, word2pdf: 25, imgconvert: 80
    },
    createdAt: '2026-04-10',
    isAdmin: false,
    status: 'active',
  },
  {
    id: 'user_4',
    email: 'pierre.dubois@gmail.com',
    name: 'Pierre Dubois',
    plan: 'free',
    creditsUsed: {
      merge: 3, split: 1, compress: 2, pdf2img: 0,
      img2pdf: 0, pdf2word: 1, word2pdf: 0, imgconvert: 1
    },
    createdAt: '2026-06-22',
    isAdmin: false,
    status: 'active',
  },
  {
    id: 'user_5',
    email: 'test-suspendu@lemonde.fr',
    name: 'Sébastien L.',
    plan: 'free',
    creditsUsed: {
      merge: 0, split: 0, compress: 0, pdf2img: 0,
      img2pdf: 0, pdf2word: 0, word2pdf: 0, imgconvert: 0
    },
    createdAt: '2026-06-01',
    isAdmin: false,
    status: 'suspended',
  }
];

const SEED_LOGS: SystemLog[] = [
  {
    id: 'log_1',
    timestamp: '23:12:04',
    email: 'gautierck@gmail.com',
    action: 'Connexion',
    details: 'Utilisateur connecté avec succès',
    type: 'success',
  },
  {
    id: 'log_2',
    timestamp: '22:45:12',
    email: 'sophie.martin@entreprise.fr',
    action: 'Abonnement',
    details: 'Souscription au forfait Professionnel (Pro)',
    type: 'success',
  },
  {
    id: 'log_3',
    timestamp: '22:15:30',
    email: 'clara.lefevre@agence-web.com',
    action: 'Traitement',
    details: 'Lancement de l\'outil Image en PDF (album 14 pages)',
    type: 'info',
  },
  {
    id: 'log_4',
    timestamp: '21:05:19',
    email: 'pierre.dubois@gmail.com',
    action: 'Alerte Quota',
    details: 'Tentative de conversion bloquée : Quota Fusionner PDF atteint',
    type: 'warning',
  }
];

const SEED_OPERATIONS: Operation[] = [
  {
    id: 'op_1',
    toolId: 'merge',
    filename: 'swiftpdf_fusion_contrats_signes.pdf',
    date: '2026-06-24 15:30',
    size: '4.2 Mo',
    status: 'success',
    downloadUrl: '#',
    userId: 'user_1',
  },
  {
    id: 'op_2',
    toolId: 'img2pdf',
    filename: 'swiftpdf_reçu_frais_deplacement.pdf',
    date: '2026-06-23 11:15',
    size: '1.1 Mo',
    status: 'success',
    downloadUrl: '#',
    userId: 'user_1',
  },
  {
    id: 'op_3',
    toolId: 'compress',
    filename: 'rapport_financier_annuel_compresse.pdf',
    date: '2026-06-22 09:40',
    size: '8.5 Mo',
    status: 'success',
    downloadUrl: '#',
    userId: 'user_1',
  }
];

const SEED_SETTINGS: SystemSettings = {
  dailyFreeLimit: 3,
  proPriceMonthly: 9.99,
  enterprisePriceMonthly: 29.99,
  maintenanceMode: false,
};

const SEED_FAQS: FAQItem[] = [
  {
    id: 'faq_1',
    question: "Mes documents restent-ils confidentiels et sécurisés ?",
    answer: "Absolument. La sécurité est notre priorité absolue. Tous vos fichiers sont chiffrés de bout en bout (SSL 256-bit) lors du transfert. De plus, ils sont définitivement supprimés de nos serveurs sécurisés 2 heures après le traitement, conformément aux exigences strictes du RGPD.",
    category: 'general',
  },
  {
    id: 'faq_2',
    question: "Quelles sont les limites du forfait gratuit ?",
    answer: "Avec le forfait gratuit, vous disposez de 3 crédits de conversion par jour à utiliser sur l'ensemble de nos outils. Il n'y a aucune fonctionnalité cachée ou bridée, vous testez la puissance maximale de nos serveurs en toute liberté.",
    category: 'pricing',
  },
  {
    id: 'faq_3',
    question: "Comment fonctionne l'abonnement SwiftPDF Pro ?",
    answer: "L'abonnement Pro supprime toutes les limites quotidiennes de fichiers et débloque le traitement ultra-rapide par lot. Vous pouvez convertir et modifier autant de fichiers que vous le souhaitez sans attente. L'engagement est mensuel et résiliable en 1 clic.",
    category: 'pricing',
  },
  {
    id: 'faq_4',
    question: "Puis-je utiliser SwiftPDF sur mon smartphone ?",
    answer: "Oui ! SwiftPDF Pro est une application web progressive, entièrement responsive. Elle fonctionne à la perfection sur iPhone, Android, tablettes et ordinateurs, sans qu'aucune installation ne soit requise.",
    category: 'tools',
  }
];

export default function App() {
  // Load initial states from LocalStorage or Fallback to seeds
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('swiftpdf_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem('swiftpdf_users_list');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [recentOperations, setRecentOperations] = useState<Operation[]>(() => {
    const saved = localStorage.getItem('swiftpdf_operations');
    return saved ? JSON.parse(saved) : SEED_OPERATIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('swiftpdf_invoices');
    if (saved) return JSON.parse(saved);
    // Seed standard invoice if logged in as Gautier
    return [
      {
        id: 'INV-2026-4859',
        date: '2026-06-24',
        amount: 9.99,
        plan: 'Professionnel (Pro)',
        status: 'paid',
        pdfName: 'facture_swiftpdf_pro_2026_4859.pdf',
        userId: 'user_1',
      }
    ];
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('swiftpdf_settings');
    return saved ? JSON.parse(saved) : SEED_SETTINGS;
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    const saved = localStorage.getItem('swiftpdf_logs');
    return saved ? JSON.parse(saved) : SEED_LOGS;
  });

  const [faqsList, setFaqsList] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem('swiftpdf_faqs');
    return saved ? JSON.parse(saved) : SEED_FAQS;
  });

  const [activeScreen, setActiveScreen] = useState<string>(() => {
    const savedUser = localStorage.getItem('swiftpdf_current_user');
    return savedUser ? 'dashboard' : 'landing';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('swiftpdf_dark_mode') === 'true';
  });

  // Sync dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('swiftpdf_dark_mode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('swiftpdf_dark_mode', 'false');
    }
  }, [darkMode]);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('swiftpdf_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('swiftpdf_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('swiftpdf_users_list', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('swiftpdf_operations', JSON.stringify(recentOperations));
  }, [recentOperations]);

  useEffect(() => {
    localStorage.setItem('swiftpdf_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('swiftpdf_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('swiftpdf_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('swiftpdf_faqs', JSON.stringify(faqsList));
  }, [faqsList]);

  // Auth screen redirection logic
  useEffect(() => {
    if (!currentUser && !['landing', 'auth_login', 'auth_signup', 'pricing'].includes(activeScreen)) {
      setActiveScreen('landing');
    }
  }, [currentUser, activeScreen]);

  // Logging helper
  const addSystemLog = (action: string, details: string, type: 'info' | 'warning' | 'success') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: SystemLog = {
      id: `log_${Date.now()}`,
      timestamp: timeStr,
      email: currentUser?.email || 'Visiteur Anonyme',
      action,
      details,
      type,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // User Actions
  const handleLoginSuccess = (email: string, name: string, isAdmin: boolean): boolean => {
    // Check if user already exists in user database
    let existingUser = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!existingUser) {
      existingUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        plan: 'free',
        creditsUsed: {
          merge: 0, split: 0, compress: 0, pdf2img: 0,
          img2pdf: 0, pdf2word: 0, word2pdf: 0, imgconvert: 0
        },
        createdAt: new Date().toISOString().split('T')[0],
        isAdmin,
        status: 'active',
      };
      setUsersList((prev) => [...prev, existingUser!]);
    } else {
      // Keep admin status synced if they log in via Admin option
      if (isAdmin) {
        existingUser = { ...existingUser, isAdmin: true };
        setUsersList((prev) => prev.map((u) => u.email.toLowerCase() === email.toLowerCase() ? { ...u, isAdmin: true } : u));
      }
    }

    if (existingUser.status === 'suspended') {
      return false;
    }

    setCurrentUser(existingUser);
    setActiveScreen('dashboard');
    
    // Add connection log
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog: SystemLog = {
      id: `log_${Date.now()}`,
      timestamp: timeStr,
      email: existingUser.email,
      action: 'Connexion',
      details: 'Utilisateur connecté avec succès',
      type: 'success',
    };
    setLogs((prev) => [newLog, ...prev]);
    return true;
  };

  const handleLogout = () => {
    addSystemLog('Déconnexion', 'Utilisateur déconnecté', 'info');
    setCurrentUser(null);
    setActiveScreen('auth_login');
  };

  const handleUpgradePlan = (plan: 'free' | 'pro' | 'enterprise', price: number) => {
    if (!currentUser) return;

    const updatedUser: User = { ...currentUser, plan };
    setCurrentUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    // Generate Invoice if paid plan
    if (price > 0) {
      const invId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newInvoice: Invoice = {
        id: invId,
        date: new Date().toISOString().split('T')[0],
        amount: price,
        plan: plan === 'pro' ? 'Professionnel (Pro)' : 'Entreprise',
        status: 'paid',
        pdfName: `facture_swiftpdf_${plan}_2026_${invId.split('-')[2]}.pdf`,
        userId: currentUser.id,
      };
      setInvoices((prev) => [newInvoice, ...prev]);
      addSystemLog('Abonnement', `Passage au forfait ${plan.toUpperCase()} (${price} €)`, 'success');
    } else {
      addSystemLog('Forfait Modifié', `Retour au plan gratuit`, 'info');
    }
  };

  const handleToggleAdmin = () => {
    if (!currentUser) return;
    const nextAdminState = !currentUser.isAdmin;
    const updatedUser: User = { ...currentUser, isAdmin: nextAdminState };
    setCurrentUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    addSystemLog('Droits Modifiés', `${currentUser.name} a ${nextAdminState ? 'ACTIVÉ' : 'DÉSACTIVÉ'} son mode administrateur temporaire`, 'warning');
  };

  const handleChangePlan = (plan: 'free' | 'pro' | 'enterprise') => {
    if (!currentUser) return;
    const updatedUser: User = { ...currentUser, plan };
    setCurrentUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    addSystemLog('Plan Test Modifié', `Changement de plan rapide de test vers ${plan.toUpperCase()}`, 'info');
  };

  // Operation Completed pipeline
  const handleOperationComplete = (filename: string, size: string, downloadUrl?: string) => {
    if (!currentUser) return;

    const toolId = activeScreen as ToolId;
    
    // Increment credits used
    const currentCredits = currentUser.creditsUsed[toolId] || 0;
    const updatedUser: User = {
      ...currentUser,
      creditsUsed: {
        ...currentUser.creditsUsed,
        [toolId]: currentCredits + 1,
      },
    };

    setCurrentUser(updatedUser);
    setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    // Register operation in history table
    const newOp: Operation = {
      id: `op_${Date.now()}`,
      toolId,
      filename,
      date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5),
      size,
      status: 'success',
      downloadUrl,
      userId: currentUser.id,
    };
    setRecentOperations((prev) => [newOp, ...prev]);

    addSystemLog(
      'Conversion',
      `Outil ${toolId.toUpperCase()} utilisé avec succès (${filename})`,
      'success'
    );
  };

  const handleDeleteOperation = (id: string) => {
    setRecentOperations((prev) => prev.filter((op) => op.id !== id));
    addSystemLog('Suppression', 'Suppression d\'un fichier de l\'historique', 'info');
  };

  // Admin Actions
  const handleUpdateSettings = (updated: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateUserPlan = (userId: string, plan: 'free' | 'pro' | 'enterprise') => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, plan } : u))
    );
    // Sync with currentUser if they upgraded themselves in the admin table
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, plan } : null));
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    // If user suspends themselves, log out
    if (currentUser && currentUser.id === userId) {
      handleLogout();
    }
  };

  const handleAddFaq = (question: string, answer: string, category: 'pricing' | 'tools' | 'general') => {
    const newFaq: FAQItem = {
      id: `faq_${Date.now()}`,
      question,
      answer,
      category,
    };
    setFaqsList((prev) => [...prev, newFaq]);
    addSystemLog('FAQ Ajoutée', `Nouvelle FAQ créée : "${question.substring(0, 30)}..."`, 'success');
  };

  const handleEditFaq = (id: string, question: string, answer: string, category: 'pricing' | 'tools' | 'general') => {
    setFaqsList((prev) =>
      prev.map((faq) => (faq.id === id ? { ...faq, question, answer, category } : faq))
    );
    addSystemLog('FAQ Modifiée', `FAQ mise à jour : "${question.substring(0, 30)}..."`, 'info');
  };

  const handleDeleteFaq = (id: string) => {
    const faqToDelete = faqsList.find(f => f.id === id);
    setFaqsList((prev) => prev.filter((faq) => faq.id !== id));
    if (faqToDelete) {
      addSystemLog('FAQ Supprimée', `FAQ supprimée : "${faqToDelete.question.substring(0, 30)}..."`, 'warning');
    }
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = usersList.find((u) => u.id === userId);
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    if (userToDelete) {
      addSystemLog('Suppression Utilisateur', `Utilisateur supprimé : ${userToDelete.email}`, 'warning');
    }
  };

  const handleDeleteAllUsersExceptAdmin = () => {
    setUsersList((prev) => prev.filter((u) => u.isAdmin || u.email === currentUser?.email));
    addSystemLog('Base de données', 'Tous les utilisateurs sauf l\'administrateur ont été supprimés', 'warning');
  };

  // Render proper screen
  const renderScreen = () => {
    // Maintenance override screen
    if (settings.maintenanceMode && !currentUser?.isAdmin) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Maintenance en cours</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              La plateforme SwiftPDF subit actuellement une mise à niveau d'infrastructure pour accélérer les temps de traitement. Revenez dans quelques minutes !
            </p>
          </div>
        </div>
      );
    }

    if (!currentUser) {
      if (activeScreen === 'landing') {
        return <LandingPage onNavigate={setActiveScreen} currentUser={currentUser} faqsList={faqsList} />;
      }
      if (activeScreen === 'pricing') {
        return (
          <Pricing
            currentUser={currentUser}
            onUpgrade={handleUpgradePlan}
            onNavigate={setActiveScreen}
          />
        );
      }
      if (activeScreen === 'auth_signup') {
        return <Auth onLoginSuccess={handleLoginSuccess} initialMode="signup" />;
      }
      return <Auth onLoginSuccess={handleLoginSuccess} initialMode="login" />;
    }

    // Tools Redirections
    if (activeScreen === 'imgconvert') {
      return (
        <ImageConverter
          currentUser={currentUser}
          dailyFreeLimit={settings.dailyFreeLimit}
          onBack={() => setActiveScreen('dashboard')}
          onOperationComplete={handleOperationComplete}
          onNavigate={setActiveScreen}
        />
      );
    }

    if (activeScreen === 'img2pdf') {
      return (
        <ImageToPdf
          currentUser={currentUser}
          dailyFreeLimit={settings.dailyFreeLimit}
          onBack={() => setActiveScreen('dashboard')}
          onOperationComplete={handleOperationComplete}
          onNavigate={setActiveScreen}
        />
      );
    }

    const availableToolIds: string[] = ['merge', 'split', 'compress', 'pdf2img', 'pdf2word', 'word2pdf'];
    if (availableToolIds.includes(activeScreen)) {
      return (
        <GenericTool
          toolId={activeScreen as ToolId}
          currentUser={currentUser}
          dailyFreeLimit={settings.dailyFreeLimit}
          onBack={() => setActiveScreen('dashboard')}
          onOperationComplete={handleOperationComplete}
          onNavigate={setActiveScreen}
        />
      );
    }

    switch (activeScreen) {
      case 'landing':
        return (
          <LandingPage
            onNavigate={setActiveScreen}
            currentUser={currentUser}
            faqsList={faqsList}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            currentUser={currentUser}
            recentOperations={recentOperations.filter((op) => op.userId === currentUser.id)}
            invoices={invoices.filter((inv) => inv.userId === currentUser.id)}
            dailyFreeLimit={settings.dailyFreeLimit}
            onSelectTool={(toolId) => setActiveScreen(toolId)}
            onNavigate={setActiveScreen}
            onDeleteOperation={handleDeleteOperation}
          />
        );
      case 'pricing':
        return (
          <Pricing
            currentUser={currentUser}
            onUpgrade={handleUpgradePlan}
            onNavigate={setActiveScreen}
          />
        );
      case 'admin':
        return currentUser.isAdmin ? (
          <AdminPanel
            usersList={usersList}
            logs={logs}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onUpdateUserPlan={handleUpdateUserPlan}
            onToggleUserStatus={handleToggleUserStatus}
            onDeleteUser={handleDeleteUser}
            onDeleteAllUsersExceptAdmin={handleDeleteAllUsersExceptAdmin}
            onAddLog={addSystemLog}
            faqsList={faqsList}
            onAddFaq={handleAddFaq}
            onEditFaq={handleEditFaq}
            onDeleteFaq={handleDeleteFaq}
          />
        ) : (
          <div className="p-8 text-center text-rose-600 font-bold">Accès Non Autorisé</div>
        );
      case 'profile':
        return (
          <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900">{currentUser.name}</h1>
                  <span className="text-xs font-mono text-slate-400">{currentUser.email}</span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <h3 className="font-bold text-slate-950 uppercase text-[10px] tracking-widest text-slate-400">Informations du compte</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="block text-xs text-slate-400">{currentUser.isAdmin ? 'Rôle Système' : 'Forfait actuel'}</span>
                    <span className={`block font-bold capitalize text-sm mt-0.5 ${currentUser.isAdmin ? 'text-rose-600' : 'text-blue-700'}`}>
                      {currentUser.isAdmin ? 'Administrateur' : currentUser.plan}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="block text-xs text-slate-400">Date d'inscription</span>
                    <span className="block font-bold text-slate-800 text-sm mt-0.5">{currentUser.createdAt}</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-800 leading-relaxed">
                  Votre compte SwiftPDF Pro dispose d'un espace de stockage temporaire chiffré de bout en bout. Toutes les opérations effectuées sont sécurisées à l'aide d'algorithmes de hachage SSL 256-bit conformes aux normes RGPD.
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  id="profile-back-dashboard-btn"
                  onClick={() => setActiveScreen('dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
                >
                  Retour au Tableau de bord
                </button>
                <button
                  id="profile-logout-btn"
                  onClick={handleLogout}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="p-8 text-center text-slate-500">Page non trouvée</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header navbar */}
      <Navbar
        currentUser={currentUser}
        onNavigate={setActiveScreen}
        onLogout={handleLogout}
        onToggleAdmin={handleToggleAdmin}
        onChangePlan={handleChangePlan}
        activeScreen={activeScreen}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main app screen canvas */}
      <main className="flex-1 bg-slate-50/50 pb-16">{renderScreen()}</main>

      {/* Footer copyright and references */}
      <Footer />
    </div>
  );
}
