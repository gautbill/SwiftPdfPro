import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Sparkles, CreditCard, ArrowRight, X, Award, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface PricingProps {
  currentUser: User | null;
  onUpgrade: (plan: 'free' | 'pro' | 'enterprise', invoiceAmount: number) => void;
  onNavigate: (screen: string) => void;
}

export default function Pricing({ currentUser, onUpgrade, onNavigate }: PricingProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise' | null>(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: 0,
      description: 'Pour les besoins d\'édition occasionnels.',
      features: [
        '3 conversions gratuites par jour pour chaque outil',
        'Limite de fichier de 15 Mo',
        'Vitesse de traitement standard',
        'Sécurité de cryptage SSL standard',
      ],
      icon: Zap,
      cta: 'Sélectionné par défaut',
      color: 'border-slate-200 bg-white',
    },
    {
      id: 'pro',
      name: 'Professionnel (Pro)',
      price: 9.99,
      description: 'Accès illimité pour les professionnels et indépendants.',
      features: [
        'Conversions & Outils 100% ILLIMITÉS',
        'Fichiers volumineux jusqu\'à 500 Mo',
        'Traitement prioritaire ultra-rapide',
        'Extraction OCR de texte standard',
        'Historique des opérations disponible pendant 30 jours',
        'Support client prioritaire sous 24h',
      ],
      icon: Sparkles,
      cta: 'Passer à la vitesse supérieure',
      popular: true,
      color: 'border-blue-500 bg-white shadow-xl shadow-blue-100/50 relative',
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      price: 29.99,
      description: 'Pour les équipes exigeantes nécessitant une automatisation.',
      features: [
        'Tout le plan Professionnel',
        'Taille de fichier illimitée',
        'Traitement par lots multi-fichiers simultanés',
        'OCR Avancé multi-langues de pointe',
        'Clés API SwiftPDF pour intégration logicielle',
        'Gestionnaire de compte & Support dédié 24h/7j',
        'SLA garanti de 99.99%',
      ],
      icon: Award,
      cta: 'Contacter le service commercial',
      color: 'border-slate-800 bg-slate-900 text-white shadow-xl shadow-slate-900/10',
    },
  ];

  const handleSubscribeClick = (planId: 'free' | 'pro' | 'enterprise', price: number) => {
    if (!currentUser) {
      onNavigate('auth_login');
      return;
    }
    if (planId === 'free') {
      onUpgrade('free', 0);
      return;
    }
    setSelectedPlan(planId);
    // Autofill mock details
    setCardName(currentUser.name);
    setCardNumber('4242 •••• •••• 4242');
    setExpiry('12/28');
    setCvc('123');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cardName || !cardNumber || !expiry || !cvc) {
      setError('Veuillez remplir toutes les informations de facturation.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        const planPrice = selectedPlan === 'pro' ? 9.99 : 29.99;
        onUpgrade(selectedPlan!, planPrice);
        setSelectedPlan(null);
        setSuccess(false);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
          Tarification Simple et Transparente
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-950 mt-4 tracking-tight">
          Passez au niveau supérieur
        </h1>
        <p className="text-lg text-slate-500 mt-4 leading-relaxed">
          Essayez nos outils gratuitement chaque jour ou déverrouillez le traitement illimité, ultra-rapide et sécurisé sans publicité ni limites de taille.
        </p>
      </div>

      {/* Grid plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((p) => {
          const PlanIcon = p.icon;
          const isCurrentPlan = currentUser?.plan === p.id;
          return (
            <div
              id={`pricing-card-${p.id}`}
              key={p.id}
              className={`rounded-3xl border p-8 flex flex-col justify-between transition hover:scale-[1.01] duration-300 ${p.color}`}
            >
              <div>
                {/* Popular badge */}
                {p.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-bold text-xs uppercase px-4 py-1.5 rounded-full tracking-wider shadow-md">
                    Recommandé
                  </span>
                )}

                <div className="flex justify-between items-center mb-6">
                  <div className={`p-3 rounded-xl ${p.id === 'enterprise' ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <PlanIcon className="h-6 w-6" />
                  </div>
                  {isCurrentPlan && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Plan actif
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold tracking-tight">{p.name}</h3>
                <p className={`text-sm mt-2 leading-relaxed ${p.id === 'enterprise' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {p.description}
                </p>

                <div className="my-6 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">{p.price} €</span>
                  <span className={`text-sm ml-2 ${p.id === 'enterprise' ? 'text-slate-400' : 'text-slate-500'}`}>/ mois</span>
                </div>

                <ul className="space-y-3.5 border-t border-slate-100/10 py-6 text-sm">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className={p.id === 'enterprise' ? 'text-slate-300' : 'text-slate-700'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  id={`upgrade-btn-${p.id}`}
                  onClick={() => handleSubscribeClick(p.id as any, p.price)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : p.id === 'enterprise'
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'
                  }`}
                >
                  <span>{isCurrentPlan ? 'Votre forfait actuel' : p.cta}</span>
                  {!isCurrentPlan && p.id !== 'free' && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal Overlay */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                <h3 className="font-bold text-lg">Facturation Sécurisée Stripe</h3>
              </div>
              <button
                id="checkout-close-btn"
                onClick={() => setSelectedPlan(null)}
                className="hover:bg-white/20 p-1.5 rounded-full transition cursor-pointer text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            {success ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-up">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <h4 className="text-2xl font-bold text-slate-950">Abonnement Confirmé !</h4>
                <p className="text-slate-500">
                  Votre compte a été surclassé avec succès. Merci de votre confiance !
                </p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-5">
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Option choisie</p>
                    <h4 className="font-bold text-slate-900 mt-0.5">
                      SwiftPDF {selectedPlan === 'pro' ? 'Professionnel' : 'Entreprise'}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-blue-700">
                      {selectedPlan === 'pro' ? '9.99 €' : '29.99 €'}
                    </span>
                    <p className="text-[10px] text-blue-500 font-mono">Facturation mensuelle</p>
                  </div>
                </div>

                {error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm flex gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Simulated Visual Credit Card */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 relative overflow-hidden shadow-lg h-44 flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full -translate-y-12 translate-x-12 blur-xl"></div>
                  <div className="flex justify-between items-start">
                    <div className="p-1.5 bg-slate-800 rounded-md">
                      <CreditCard className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest text-slate-400">
                      {cardNumber.startsWith('4') ? 'Visa' : 'Mock Card'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-mono tracking-widest text-slate-400 mb-1">NUMÉRO DE CARTE</p>
                    <p className="font-mono text-lg tracking-widest font-bold">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] font-mono text-slate-400">TITULAIRE</p>
                      <p className="font-semibold text-xs truncate max-w-[150px] uppercase">
                        {cardName || 'NOM DU CLIENT'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-slate-400">EXPIRATION</p>
                      <p className="font-mono text-xs font-semibold">{expiry || 'MM/AA'}</p>
                    </div>
                  </div>
                </div>

                {/* Card Fields inputs */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="billing-cardname">
                      Titulaire de la carte
                    </label>
                    <input
                      id="billing-cardname"
                      type="text"
                      required
                      placeholder="Gautier C"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="billing-cardnumber">
                      Numéro de carte
                    </label>
                    <input
                      id="billing-cardnumber"
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="billing-expiry">
                        Date d'expiration
                      </label>
                      <input
                        id="billing-expiry"
                        type="text"
                        required
                        placeholder="MM/AA"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition text-center font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="billing-cvc">
                        Code CVC
                      </label>
                      <input
                        id="billing-cvc"
                        type="password"
                        required
                        placeholder="123"
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white transition text-center font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  id="checkout-pay-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-100 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Payer {selectedPlan === 'pro' ? '9.99 €' : '29.99 €'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
