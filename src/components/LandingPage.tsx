import React, { useState } from 'react';
import { 
  Layers, Shield, Zap, Sparkles, ArrowRight, Lock, FileText, Image as ImageIcon, 
  Check, Play, Star, ChevronDown, RefreshCw, FileCode, Users, X
} from 'lucide-react';
import { FAQItem } from '../types';

interface LandingPageProps {
  onNavigate: (screen: string) => void;
  currentUser: any;
  faqsList?: FAQItem[];
}

export default function LandingPage({ onNavigate, currentUser, faqsList = [] }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pricing' | 'tools' | 'general'>('all');

  const stats = [
    { label: 'Fichiers convertis', value: '1.2M+' },
    { label: 'Taux de satisfaction', value: '99.8%' },
    { label: 'Vitesse moyenne', value: '< 2.4s' },
    { label: 'Entreprises actives', value: '450+' },
  ];

  const toolsList = [
    {
      id: 'merge',
      name: 'Fusionner PDF',
      desc: 'Assemblez plusieurs fichiers PDF en un seul document de manière ordonnée.',
      icon: Layers,
      badge: 'Populaire',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      id: 'split',
      name: 'Diviser PDF',
      desc: 'Séparez vos PDF par pages ou extrayez des plages de pages spécifiques.',
      icon: Layers,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      id: 'compress',
      name: 'Compresser PDF',
      desc: 'Réduisez la taille de vos fichiers PDF sans perte de qualité visuelle.',
      icon: Zap,
      badge: '-80%',
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      id: 'img2pdf',
      name: 'Images en PDF',
      desc: 'Convertissez instantanément vos images JPG, PNG, WEBP en document PDF.',
      icon: ImageIcon,
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      id: 'pdf2img',
      name: 'PDF en Image',
      desc: 'Extrayez toutes les pages de vos PDF sous forme d\'images haute résolution.',
      icon: ImageIcon,
      color: 'bg-rose-500/10 text-rose-600',
    },
    {
      id: 'imgconvert',
      name: 'Convertisseur Image',
      desc: 'Changez le format de vos images à la volée (PNG, JPG, WEBP, GIF, etc.).',
      icon: RefreshCw,
      color: 'bg-indigo-500/10 text-indigo-600',
    },
    {
      id: 'pdf2word',
      name: 'PDF en Word',
      desc: 'Convertissez vos PDF en fichiers Word modifiables (.docx) fidèles.',
      icon: FileText,
      color: 'bg-cyan-500/10 text-cyan-600',
    },
    {
      id: 'word2pdf',
      name: 'Word en PDF',
      desc: 'Transformez vos rapports et lettres Microsoft Word en PDF parfaits.',
      icon: FileText,
      color: 'bg-teal-500/10 text-teal-600',
    },
  ];

  const filteredFaqs = faqsList.filter(
    (faq) => selectedCategory === 'all' || faq.category === selectedCategory
  );

  const handleStart = (toolId?: string) => {
    if (currentUser) {
      onNavigate(toolId || 'dashboard');
    } else {
      onNavigate('auth_signup');
    }
  };

  return (
    <div className="space-y-24 bg-slate-50/50 pb-16">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-12 overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-400/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider animate-bounce">
            <Sparkles className="h-3.5 w-3.5 fill-blue-500/20" />
            Solution PDF & Image Nouvelle Génération
          </div>

          {/* Main Display Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none max-w-4xl mx-auto">
            Gérez tous vos documents <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              sans aucune limite de taille
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SwiftPDF Pro est la boîte à outils SaaS la plus rapide pour fusionner, diviser, compresser et convertir vos PDF et images. Sécurisé, conforme au RGPD et conçu pour les professionnels exigeants.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-3">
            <button
              id="landing-hero-signup-btn"
              onClick={() => handleStart()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              <span>{currentUser ? "Aller au Tableau de Bord" : "Commencer Gratuitement"}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              id="landing-hero-pricing-btn"
              onClick={() => onNavigate('pricing')}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold px-8 py-4 rounded-2xl shadow-xs transition duration-200 cursor-pointer text-base"
            >
              Découvrir les Tarifs
            </button>
          </div>

          {/* Security & GDPR Badge */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-emerald-500" /> Chiffrement SSL 256-bit
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-4 w-4 text-emerald-500" /> RGPD / Suppression auto sous 2h
            </span>
          </div>

          {/* Visual Platform Mockup / Interactive Dashboard preview */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-4 sm:p-6 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              
              {/* Header inside the Mockup */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="text-xs text-slate-400 font-mono ml-2">app.swiftpdf.pro/dashboard</span>
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                  ● Serveurs en ligne
                </div>
              </div>

              {/* Mockup Dashboard content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3 relative overflow-hidden">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Glisser-Déposer vos Fichiers</h4>
                  <p className="text-xs text-slate-500">Fichiers multiples, PDF volumineux ou images lourdes acceptés.</p>
                  <div className="w-full h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-blue-600 rounded-full"></div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Traitement Instantané</h4>
                  <p className="text-xs text-slate-500">Optimisé par notre moteur Cloud de conversion ultra-rapide.</p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <Check className="h-4 w-4" /> Fichier prêt en 1.8 seconde
                  </div>
                </div>

                <div className="bg-slate-950 text-white rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/30 rounded-full blur-xl"></div>
                  <h4 className="font-bold text-sm flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-400" /> SwiftPDF Premium
                  </h4>
                  <p className="text-[11px] text-slate-400">Libérez la puissance illimitée. Téléchargement instantané de dossiers compressés ZIP.</p>
                  <button 
                    onClick={() => onNavigate('pricing')} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-lg text-xs transition cursor-pointer"
                  >
                    Essayer Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-slate-900 py-12 text-white relative overflow-hidden rounded-3xl max-w-7xl mx-auto px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-purple-900/40 opacity-70"></div>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="block text-3xl sm:text-4xl font-black text-blue-400 tracking-tight">
                {stat.value}
              </span>
              <span className="block text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features/Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            8 Outils Professionnels <span className="text-blue-600">Tout-en-Un</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Pas besoin d'installer de logiciels lourds. Tout se passe dans votre navigateur de manière ultra-sécurisée.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {toolsList.map((tool) => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.id}
                onClick={() => handleStart(tool.id)}
                className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
              >
                {tool.badge && (
                  <span className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                    {tool.badge}
                  </span>
                )}
                <div className="space-y-4">
                  <div className={`w-10 h-10 ${tool.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
                  <span>Utiliser l'outil</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-100/50 py-20 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-bold uppercase tracking-wider">
              Simplicité extrême
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Comment ça marche ? <br />
              <span className="text-blue-600">3 étapes suffisent.</span>
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Nous avons conçu l'interface la plus intuitive possible. Pas de menus compliqués, pas d'options superflues. Juste de l'efficacité pure.
            </p>
            <button
              onClick={() => handleStart()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-blue-200 transition cursor-pointer text-xs flex items-center gap-1.5"
            >
              Faire ma première conversion <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-xs">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-sm">1</span>
              <h3 className="font-bold text-slate-900 text-sm">Déposez vos fichiers</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Glissez vos documents dans la zone de dépôt ou sélectionnez-les localement.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-xs">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-sm">2</span>
              <h3 className="font-bold text-slate-900 text-sm">Cliquez sur Convertir</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Notre moteur cloud traite le document de manière optimale en quelques secondes.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-xs">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-sm">3</span>
              <h3 className="font-bold text-slate-900 text-sm">Téléchargez en 1 clic</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Récupérez instantanément votre fichier final. Aucune perte de qualité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security emphasis */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Shield className="h-8 w-8" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Confidentialité & RGPD Garantie</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Nous comprenons que vos documents contiennent des données sensibles. C'est pourquoi tous les fichiers traités sur SwiftPDF Pro sont chiffrés et automatiquement détruits de nos bases après 2 heures de traitement. Nous ne consultons, ne partageons et n'analysons jamais votre contenu.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left">
          <div className="p-5 bg-white border border-slate-100 rounded-2xl flex gap-3.5 items-start">
            <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">Suppression Automatique</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Fichiers effacés définitivement sous 120 minutes de nos serveurs.</p>
            </div>
          </div>
          <div className="p-5 bg-white border border-slate-100 rounded-2xl flex gap-3.5 items-start">
            <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">Conformité Européenne RGPD</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Traitement des fichiers hébergés exclusivement au sein de l'Union Européenne.</p>
            </div>
          </div>
          <div className="p-5 bg-white border border-slate-100 rounded-2xl flex gap-3.5 items-start">
            <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs">Aucun stockage permanent</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Vos documents ne sont jamais conservés à des fins d'entraînement ou de revente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="bg-slate-900 py-20 rounded-3xl text-white max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Tarification simple & transparente</span>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
              Choisissez la vitesse et la liberté
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Commencez gratuitement avec notre quota quotidien de 3 fichiers ou passez au forfait professionnel pour éliminer toutes les barrières de votre flux de travail.
            </p>
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs">
                <Check className="h-4 w-4 text-blue-400" /> <span>Aucun engagement, annulez quand vous voulez</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <Check className="h-4 w-4 text-blue-400" /> <span>Facturation simplifiée conforme en 1 clic</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {/* Free Card */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base">Plan Gratuit</h3>
                  <p className="text-xs text-slate-400 mt-1">Idéal pour un usage occasionnel ou rapide.</p>
                </div>
                <div className="text-3xl font-black text-white">
                  0 € <span className="text-xs font-medium text-slate-400">/ toujours</span>
                </div>
                <div className="border-t border-slate-700/50 my-2"></div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-blue-400" /> 3 fichiers par jour</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-blue-400" /> Tous les 8 outils inclus</li>
                  <li className="flex items-center gap-1.5 text-slate-500"><X className="h-3.5 w-3.5 text-slate-600" /> Vitesse ultra-rapide par lot</li>
                </ul>
              </div>
              <button 
                onClick={() => onNavigate('auth_signup')} 
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-xl text-xs mt-6 transition cursor-pointer"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Pro Card */}
            <div className="bg-white text-slate-900 border border-blue-500 p-6 rounded-2xl flex flex-col justify-between relative shadow-xl shadow-blue-900/20">
              <span className="absolute -top-3 right-4 bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md">RECOMMANDÉ</span>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Plan Pro</h3>
                  <p className="text-xs text-slate-500 mt-1">Pour les professionnels et créateurs de contenu.</p>
                </div>
                <div className="text-3xl font-black text-slate-900">
                  9,99 € <span className="text-xs font-medium text-slate-500">/ mois</span>
                </div>
                <div className="border-t border-slate-100 my-2"></div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-blue-600 font-extrabold" /> Traitements 100% ILLIMITÉS</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-blue-600 font-extrabold" /> Vitesse Cloud Prioritaire</li>
                  <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-blue-600 font-extrabold" /> Support client 24/7 VIP</li>
                </ul>
              </div>
              <button 
                onClick={() => onNavigate('pricing')} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs mt-6 transition shadow-md shadow-blue-100 cursor-pointer"
              >
                Passer au Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Foire aux Questions</h2>
          <p className="text-slate-500 text-sm">Tout ce que vous devez savoir pour démarrer avec SwiftPDF Pro.</p>
        </div>

        {/* Catégories Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'all', label: 'Toutes les questions' },
            { id: 'pricing', label: 'Tarifs & Abonnements' },
            { id: 'tools', label: 'Utilisation des outils' },
            { id: 'general', label: 'Sécurité & Général' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as any);
                setActiveFaq(null); // Reset open accordion on category switch
              }}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/60 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-4 text-left">
          {filteredFaqs.map((faq, idx) => (
            <div 
              key={faq.id} 
              className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden transition dark:bg-slate-900 dark:border-slate-800"
            >
              <button
                id={`faq-btn-${idx}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400 transition cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform text-slate-400 ${activeFaq === idx ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-50 dark:border-slate-800 dark:text-zinc-300 animate-in slide-in-from-top duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl dark:bg-slate-900/40 dark:border-slate-800">
              <p className="text-slate-400 text-sm font-medium">Aucune question fréquente enregistrée dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 relative">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-10 md:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
              Prêt à accélérer votre gestion documentaire ?
            </h2>
            <p className="text-sm md:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Rejoignez des milliers de professionnels qui font confiance à SwiftPDF Pro pour optimiser leur quotidien.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleStart()}
                className="bg-white hover:bg-slate-100 text-blue-600 font-black px-8 py-4 rounded-2xl shadow-lg transition duration-200 cursor-pointer text-base inline-flex items-center gap-2"
              >
                <span>Commencer gratuitement dès maintenant</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
