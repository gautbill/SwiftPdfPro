import React, { useState } from 'react';
import { FileText, Image, ArrowRight, Clock, Trash2, Download, CreditCard, Sparkles, AlertCircle, FileSpreadsheet, FileArchive, Layers, ArrowLeftRight, Check, Printer, X, Shield } from 'lucide-react';
import { User, Operation, ToolId, Invoice } from '../types';

interface DashboardProps {
  currentUser: User;
  recentOperations: Operation[];
  invoices: Invoice[];
  dailyFreeLimit: number;
  onSelectTool: (toolId: ToolId) => void;
  onNavigate: (screen: string) => void;
  onDeleteOperation: (id: string) => void;
}

export default function Dashboard({
  currentUser,
  recentOperations,
  invoices,
  dailyFreeLimit,
  onSelectTool,
  onNavigate,
  onDeleteOperation,
}: DashboardProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const tools = [
    {
      id: 'merge' as ToolId,
      name: 'Fusionner PDF',
      description: 'Assemblez plusieurs fichiers PDF en un seul document structuré.',
      icon: FileArchive,
      category: 'pdf',
      popular: true,
      color: 'border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md hover:shadow-blue-50/50',
      iconColor: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'split' as ToolId,
      name: 'Diviser PDF',
      description: 'Extrayez des pages spécifiques ou séparez un PDF en plusieurs fichiers.',
      icon: FileSpreadsheet,
      category: 'pdf',
      popular: false,
      color: 'border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md hover:shadow-blue-50/50',
      iconColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'compress' as ToolId,
      name: 'Compresser PDF',
      description: 'Réduisez le poids de vos PDF tout en conservant une qualité maximale.',
      icon: Layers,
      category: 'pdf',
      popular: true,
      color: 'border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md hover:shadow-blue-50/50',
      iconColor: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'pdf2img' as ToolId,
      name: 'PDF en Image',
      description: 'Convertissez instantanément chaque page de votre PDF en JPEG ou PNG.',
      icon: Image,
      category: 'pdf',
      popular: false,
      color: 'border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md hover:shadow-blue-50/50',
      iconColor: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'img2pdf' as ToolId,
      name: 'Image en PDF',
      description: 'Compilez vos images (PNG, JPG, WEBP) dans un seul document PDF.',
      icon: FileText,
      category: 'image',
      popular: true,
      color: 'border-slate-200 hover:border-teal-500 shadow-xs hover:shadow-md hover:shadow-teal-50/50',
      iconColor: 'bg-teal-50 text-teal-600',
    },
    {
      id: 'pdf2word' as ToolId,
      name: 'PDF en Word',
      description: 'Convertissez vos documents PDF en fichiers Microsoft Word modifiables.',
      icon: FileText,
      category: 'pdf',
      popular: false,
      color: 'border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md hover:shadow-blue-50/50',
      iconColor: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'word2pdf' as ToolId,
      name: 'Word en PDF',
      description: 'Transformez vos fichiers Word .docx en documents PDF impeccables.',
      icon: FileText,
      category: 'pdf',
      popular: false,
      color: 'border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md hover:shadow-blue-50/50',
      iconColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'imgconvert' as ToolId,
      name: 'Formats d\'Image',
      description: 'Convertissez vos images à la volée entre PNG, JPG et WEBP.',
      icon: ArrowLeftRight,
      category: 'image',
      popular: true,
      color: 'border-slate-200 hover:border-teal-500 shadow-xs hover:shadow-md hover:shadow-teal-50/50',
      iconColor: 'bg-rose-50 text-rose-600',
    },
  ];

  // Group tools by category
  const pdfTools = tools.filter((t) => t.category === 'pdf');
  const imageTools = tools.filter((t) => t.category === 'image');

  // Track global credits usage for Free Plan
  const totalCreditsUsed = Object.values(currentUser.creditsUsed).reduce((a, b) => a + b, 0);
  const remainingTotalCredits = Math.max(0, (dailyFreeLimit * tools.length) - totalCreditsUsed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Welcome Message Card banner */}
      <div className={`relative bg-gradient-to-br ${currentUser.isAdmin ? 'from-slate-900 to-rose-950 border-rose-500/20' : 'from-blue-600 to-blue-950 border-blue-500/20'} rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden border`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="text-rose-300 text-xs font-extrabold uppercase tracking-widest font-mono flex items-center gap-1.5">
              {currentUser.isAdmin ? (
                <>
                  <Shield className="h-3.5 w-3.5 text-rose-400 fill-rose-500/25 animate-pulse" />
                  Mode Super-Administrateur Actif
                </>
              ) : (
                "Espace Client Sécurisé"
              )}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Bonjour, {currentUser.name} !
            </h1>
            <p className="text-slate-100 text-sm max-w-xl leading-relaxed opacity-95">
              {currentUser.isAdmin 
                ? "Vous êtes connecté avec les privilèges de gestion de la plateforme. Vous pouvez tester n'importe quel outil sans aucune limitation et superviser le système."
                : "Sélectionnez un outil ci-dessous pour démarrer l'édition de vos fichiers en toute sécurité. Vos documents sont traités localement et supprimés après conversion."
              }
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/25 shrink-0 self-stretch sm:self-auto flex flex-col justify-center">
            {currentUser.isAdmin ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-rose-300 fill-rose-300/30" />
                  <span className="text-xs text-slate-100 font-bold uppercase">Rôle :</span>
                  <span className="text-xs bg-rose-600 text-white font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Admin
                  </span>
                </div>
                <div className="text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <Check className="h-4 w-4" /> Droits système illimités
                </div>
                <button
                  id="dashboard-goto-admin"
                  onClick={() => onNavigate('admin')}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:shadow-md"
                >
                  Ouvrir la Console Admin <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300" />
                  <span className="text-xs text-slate-100 font-bold uppercase">Formule :</span>
                  <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {currentUser.plan}
                  </span>
                </div>
                {currentUser.plan === 'free' ? (
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-xs text-slate-200">
                      <span>Crédits restants :</span>
                      <span className="font-mono font-bold text-white">{remainingTotalCredits}</span>
                    </div>
                    <button
                      id="dashboard-upgrade-link"
                      onClick={() => onNavigate('pricing')}
                      className="w-full bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs py-2 px-4 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      Passer au plan Pro <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <Check className="h-4 w-4" /> Accès illimité débloqué
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Tools Launcher & Stats Column */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column (3/4): Tools Launchpad */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* PDF tools Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Outils Édition PDF</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pdfTools.map((t) => {
                const Icon = t.icon;
                const toolUsage = currentUser.creditsUsed[t.id] || 0;
                const limitLeft = Math.max(0, dailyFreeLimit - toolUsage);
                const isLimitExceeded = currentUser.plan === 'free' && limitLeft === 0;

                return (
                  <button
                    id={`tool-btn-${t.id}`}
                    key={t.id}
                    onClick={() => onSelectTool(t.id)}
                    className={`text-left p-5 bg-white rounded-2xl border ${t.color} transition hover:-translate-y-0.5 duration-200 cursor-pointer flex gap-4 shadow-xs`}
                  >
                    <div className={`p-3 rounded-xl ${t.iconColor} shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">{t.name}</span>
                        {t.popular && (
                          <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Populaire
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">{t.description}</p>
                      
                      {/* Quota feedback per tool */}
                      {currentUser.plan === 'free' && (
                        <div className="text-[10px] flex items-center gap-1 font-mono">
                          <span className={isLimitExceeded ? 'text-rose-500 font-bold' : 'text-slate-400'}>
                            {limitLeft} / {dailyFreeLimit} lancements restants aujourd'hui
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image tools Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                <Image className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Outils d'Image & Conception</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {imageTools.map((t) => {
                const Icon = t.icon;
                const toolUsage = currentUser.creditsUsed[t.id] || 0;
                const limitLeft = Math.max(0, dailyFreeLimit - toolUsage);
                const isLimitExceeded = currentUser.plan === 'free' && limitLeft === 0;

                return (
                  <button
                    id={`tool-btn-${t.id}`}
                    key={t.id}
                    onClick={() => onSelectTool(t.id)}
                    className={`text-left p-5 bg-white rounded-2xl border ${t.color} transition hover:-translate-y-0.5 duration-200 cursor-pointer flex gap-4 shadow-xs`}
                  >
                    <div className={`p-3 rounded-xl ${t.iconColor} shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">{t.name}</span>
                        {t.popular && (
                          <span className="text-[9px] font-bold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                            Recommandé
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">{t.description}</p>
                      
                      {currentUser.plan === 'free' && (
                        <div className="text-[10px] flex items-center gap-1 font-mono">
                          <span className={isLimitExceeded ? 'text-rose-500 font-bold' : 'text-slate-400'}>
                            {limitLeft} / {dailyFreeLimit} lancements restants aujourd'hui
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1/4): Usage & Subscriptions Invoices info */}
        <div className="space-y-6">
          {/* Quick Stats usage panel */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">État de l'utilisation</h3>
            
            <div className="space-y-3 text-sm">
              {currentUser.isAdmin ? (
                <>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Formule :</span>
                    <span className="font-bold uppercase text-rose-600 bg-rose-50 border border-rose-100/40 px-2.5 py-0.5 rounded-md">ADMINISTRATEUR</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Privilèges :</span>
                    <span className="font-bold text-emerald-600 font-mono text-xs">Illimités & Système</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Compte créé le :</span>
                    <span className="font-mono text-slate-400">{currentUser.createdAt}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-50 text-xs text-slate-500 leading-normal space-y-2">
                    <div className="flex items-center gap-1.5 text-rose-600 font-bold uppercase text-[10px] tracking-wider">
                      <Shield className="h-4 w-4 fill-rose-100" />
                      Accès de démonstration système
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      En tant qu'administrateur, vos conversions contournent toutes les limitations de volume ou de taille pour vous permettre de tester les serveurs SwiftPDF en conditions réelles.
                    </p>
                    <button
                      id="sidebar-goto-admin-btn"
                      onClick={() => onNavigate('admin')}
                      className="w-full mt-1 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                    >
                      Console d'administration <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Formule actuelle :</span>
                    <span className="font-bold uppercase text-blue-600 bg-blue-50 border border-blue-100/40 px-2.5 py-0.5 rounded-md">{currentUser.plan}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Compte créé le :</span>
                    <span className="font-mono text-slate-400">{currentUser.createdAt}</span>
                  </div>

                  {currentUser.plan === 'free' ? (
                    <div className="pt-2 border-t border-slate-50 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Quota quotidien global</span>
                        <span className="font-mono text-blue-600">
                          {totalCreditsUsed} / {dailyFreeLimit * tools.length}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (totalCreditsUsed / (dailyFreeLimit * tools.length)) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        La limite de l'usage gratuit est renouvelée chaque jour à minuit.
                      </p>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-50 text-xs text-slate-500 leading-normal">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold uppercase text-[10px] tracking-wider mb-1">
                        <Sparkles className="h-4 w-4 fill-emerald-100" />
                        Utilisation illimitée
                      </div>
                      Vous bénéficiez du traitement prioritaire haute performance, du support 24/7 et d'une taille de fichiers illimitée.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Billing Receipts / invoices history */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Facturation & Reçus</h3>
              <CreditCard className="h-4 w-4 text-slate-400" />
            </div>

            {invoices.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">Aucune facture émise pour le moment.</p>
            ) : (
              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs hover:bg-slate-100/50 transition"
                  >
                    <div>
                      <span className="block font-bold text-slate-800">{inv.plan}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{inv.date}</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="font-bold text-blue-600">{inv.amount.toFixed(2)} €</span>
                      <button
                        id={`invoice-print-${inv.id}`}
                        aria-label="Voir la facture"
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg border border-slate-200 transition cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Conversions History Table */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base tracking-tight">Historique récent des opérations</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{recentOperations.length} fichier(s) converti(s)</span>
        </div>

        {recentOperations.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FileText className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-sm font-medium">Aucune opération n'a été effectuée.</p>
            <p className="text-xs text-slate-400">Vos fichiers convertis récemment s'afficheront dans cette section.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Outil</th>
                  <th className="py-3 px-4">Nom du Fichier</th>
                  <th className="py-3 px-4">Date de Traitement</th>
                  <th className="py-3 px-4">Taille</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentOperations.map((op) => {
                  const toolObj = tools.find((t) => t.id === op.toolId);
                  return (
                    <tr key={op.id} className="hover:bg-slate-50/50 transition border-b border-slate-100 last:border-0">
                      <td className="py-3.5 px-4 font-semibold text-slate-950 text-xs">
                        <span className="bg-blue-50 text-blue-700 font-bold py-1 px-2.5 rounded-lg border border-blue-100/30">
                          {toolObj?.name || op.toolId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium max-w-[200px] truncate" title={op.filename}>
                        {op.filename}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                        {op.date}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                        {op.size}
                      </td>
                      <td className="py-3.5 px-4 text-right flex justify-end gap-2">
                        {op.downloadUrl && (
                          <a
                            id={`history-download-${op.id}`}
                            href={op.downloadUrl}
                            download={op.filename}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Télécharger à nouveau"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          id={`history-delete-${op.id}`}
                          onClick={() => onDeleteOperation(op.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Supprimer l'historique"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Details view Receipt modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Invoice print header */}
            <div className="bg-slate-950 text-white p-6 flex justify-between items-center">
              <div>
                <h4 className="font-extrabold tracking-wider text-sm text-blue-400 font-mono uppercase">SwiftPDF Facturation</h4>
                <p className="text-xs text-slate-400">Facture officielle #{selectedInvoice.id}</p>
              </div>
              <button
                id="invoice-close-btn"
                onClick={() => setSelectedInvoice(null)}
                className="hover:bg-slate-800 p-1.5 rounded-full transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Receipt invoice details */}
            <div className="p-8 space-y-6 text-slate-700" id="invoice-print-area">
              <div className="flex justify-between items-start">
                <div>
                  <span className="block font-bold text-lg text-slate-900">SwiftPDF SaaS</span>
                  <span className="block text-xs text-slate-400">Paris, France</span>
                  <span className="block text-xs text-slate-400">SIRET: 854 965 231 00018</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Payée
                  </span>
                  <span className="block text-xs text-slate-400 mt-2">Date : {selectedInvoice.date}</span>
                </div>
              </div>

              <div className="border-t border-b border-slate-100 py-4 space-y-1">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Facturé à</p>
                <p className="font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-xs font-mono text-slate-500">{currentUser.email}</p>
              </div>

              <div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold text-left text-xs uppercase">
                      <th className="py-2">Description</th>
                      <th className="py-2 text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50 text-slate-800">
                      <td className="py-3">
                        <span className="font-semibold block">Abonnement Mensuel SwiftPDF</span>
                        <span className="text-xs text-slate-400 block">Formule {selectedInvoice.plan} — Accès Illimité</span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold">{(selectedInvoice.amount / 1.2).toFixed(2)} €</td>
                    </tr>
                    <tr className="text-xs text-slate-500">
                      <td className="py-1.5 text-right font-medium">TVA (20%) :</td>
                      <td className="py-1.5 text-right font-mono">{(selectedInvoice.amount * 0.2 / 1.2).toFixed(2)} €</td>
                    </tr>
                    <tr className="text-sm border-t border-slate-100">
                      <td className="py-3 font-extrabold text-slate-900">Total payé TTC :</td>
                      <td className="py-3 text-right font-mono font-black text-blue-600 text-base">
                        {selectedInvoice.amount.toFixed(2)} €
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-400 leading-normal text-center">
                Ce reçu fait office de preuve de paiement de votre abonnement SwiftPDF. Le prélèvement apparaîtra sous l'intitulé "SwiftPDF SaaS". Pour toute question, contactez notre équipe de support.
              </div>
            </div>

            {/* Receipt Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                id="invoice-print-btn"
                onClick={() => {
                  window.print();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
              >
                <Printer className="h-3.5 w-3.5" /> Imprimer le reçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
