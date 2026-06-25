import React, { useState } from 'react';
import { Layers, Globe, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Brief */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Layers className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-white tracking-tight text-lg">SwiftPDF <span className="text-blue-500">Pro</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              La plateforme SaaS tout-en-un pour fusionner, diviser, compresser et convertir vos fichiers PDF et images directement en ligne avec une rapidité fulgurante.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-emerald-400 font-mono font-medium">Tous les systèmes opérationnels (99.98%)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Outils PDF</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-white transition cursor-pointer">Fusionner PDF</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Diviser PDF</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Compresser PDF</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Convertir PDF en Word</span></li>
            </ul>
          </div>

          {/* Conversions */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Conversions d'Images</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-white transition cursor-pointer">Image en PDF</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Convertir Formats d'Image</span></li>
              <li><span className="hover:text-white transition cursor-pointer">PDF en Image (PNG/JPG)</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Word en PDF</span></li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Infolettre SwiftPDF</h4>
            <p className="text-xs text-slate-400 leading-normal">
              Abonnez-vous pour recevoir nos mises à jour de sécurité et nos nouveaux outils d'édition.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                id="newsletter-email-input"
                type="email"
                required
                placeholder="votre-email@adresse.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
              />
              <button
                id="newsletter-subscribe-btn"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 rounded-lg transition-colors cursor-pointer"
              >
                {subscribed ? 'Inscrit avec succès ! ✓' : "S'abonner"}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-400 flex flex-wrap gap-4 justify-center md:justify-start">
            <span>© 2026 SwiftPDF SaaS. Tous droits réservés.</span>
            <span className="hover:text-white cursor-pointer">Mentions Légales</span>
            <span className="hover:text-white cursor-pointer">CGU / CGV</span>
            <span className="hover:text-white cursor-pointer">Politique RGPD</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              Sécurisé SSL 256-bit
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center gap-1 hover:text-white transition cursor-pointer">
              <Globe className="h-4 w-4" />
              <span>Français (FR)</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Fait avec</span>
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
              <span>pour le Web</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
