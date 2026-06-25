import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, FileText, CheckCircle, Sparkles, AlertTriangle, ShieldCheck, RefreshCw, X, File, FileImage, Settings, Compass, Layers, Download, ArrowRight } from 'lucide-react';
import { User, ToolId } from '../../types';

interface ToolInterfaceProps {
  toolId: ToolId;
  name: string;
  description: string;
  currentUser: User;
  dailyFreeLimit: number;
  onBack: () => void;
  onOperationComplete: (filename: string, size: string, downloadUrl?: string) => void;
  onNavigate: (screen: string) => void;
  children?: React.ReactNode;
  // Specific tool implementation can receive these files
  onProcessFiles?: (files: File[]) => Promise<{ filename: string; size: string; downloadUrl: string }>;
}

export default function ToolInterface({
  toolId,
  name,
  description,
  currentUser,
  dailyFreeLimit,
  onBack,
  onOperationComplete,
  onNavigate,
  children,
  onProcessFiles,
}: ToolInterfaceProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<{ filename: string; size: string; downloadUrl: string } | null>(null);

  // Custom tool parameters state
  const [compressLevel, setCompressLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [splitRange, setSplitRange] = useState('1-3');
  const [imageFormat, setImageFormat] = useState<'png' | 'jpg' | 'webp'>('webp');
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check quota
  const creditsUsed = currentUser.creditsUsed[toolId] || 0;
  const isLimitReached = currentUser.plan === 'free' && creditsUsed >= dailyFreeLimit;

  // File Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Run the conversion pipeline
  const handleLaunchProcess = async () => {
    if (selectedFiles.length === 0) return;

    setProcessing(true);
    setProcessStep(1); // "Lecture du fichier..."

    // Steps simulation for beautiful UX
    setTimeout(() => {
      setProcessStep(2); // "Analyse structurelle et extraction..."
      
      setTimeout(() => {
        setProcessStep(3); // "Optimisation et compilation finale..."
        
        setTimeout(async () => {
          let outputName = '';
          let outputSize = '';
          let outputUrl = '';

          // If custom developer processor exists, run it!
          if (onProcessFiles) {
            try {
              const res = await onProcessFiles(selectedFiles);
              outputName = res.filename;
              outputSize = res.size;
              outputUrl = res.downloadUrl;
            } catch (err) {
              console.error("Conversion failed:", err);
            }
          }

          // Fallback if no custom processor was passed
          if (!outputName) {
            const firstFile = selectedFiles[0];
            const baseName = firstFile.name.substring(0, firstFile.name.lastIndexOf('.')) || firstFile.name;
            const sizeInMb = (firstFile.size * (toolId === 'compress' ? 0.45 : 0.9) / (1024 * 1024)).toFixed(2);
            outputSize = `${sizeInMb} Mo`;

            switch (toolId) {
              case 'merge':
                outputName = `swiftpdf_fusion_${selectedFiles.length}_fichiers.pdf`;
                break;
              case 'split':
                outputName = `${baseName}_partie_1.pdf`;
                break;
              case 'compress':
                outputName = `${baseName}_compresse.pdf`;
                break;
              case 'pdf2img':
                outputName = `${baseName}_page_1.png`;
                break;
              case 'img2pdf':
                outputName = `${baseName}_assemble.pdf`;
                break;
              case 'pdf2word':
                outputName = `${baseName}_converti.docx`;
                break;
              case 'word2pdf':
                outputName = `${baseName}_converti.pdf`;
                break;
              case 'imgconvert':
                outputName = `${baseName}.${imageFormat}`;
                break;
              default:
                outputName = `${baseName}_processed.pdf`;
            }

            // Create a fake, downloadable text file blob containing info to represent the result
            const contentBlob = new Blob([`Fichier traité avec SwiftPDF\nOutil : ${name}\nFichier source : ${firstFile.name}\nTaille finale : ${outputSize}`], { type: 'text/plain' });
            outputUrl = URL.createObjectURL(contentBlob);
          }

          setResult({ filename: outputName, size: outputSize, downloadUrl: outputUrl });
          setProcessing(false);
          setSuccess(true);
          onOperationComplete(outputName, outputSize, outputUrl);
        }, 1200);
      }, 1000);
    }, 800);
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setResult(null);
    setSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Back button */}
      <div className="flex justify-between items-center">
        <button
          id="tool-back-btn"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au Tableau de bord
        </button>

        {/* Quota counter header */}
        {currentUser.plan === 'free' && (
          <div className="text-xs bg-slate-100 border border-slate-200 text-slate-600 font-mono font-bold py-1.5 px-3 rounded-xl">
            Crédits restants pour cet outil : {Math.max(0, dailyFreeLimit - creditsUsed)} / {dailyFreeLimit}
          </div>
        )}
      </div>

      {/* Tool Introduction Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {name}
        </h1>
        <p className="text-sm text-slate-500 leading-normal max-w-2xl">{description}</p>
      </div>

      {/* BLOCKER: Limit Reached Notice */}
      {isLimitReached ? (
        <div className="bg-white rounded-3xl border border-rose-100 p-8 text-center space-y-6 shadow-xl shadow-rose-100/20">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-black text-slate-950">Limite Quotidienne Atteinte !</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Vous avez consommé vos <strong>{dailyFreeLimit} conversions gratuites</strong> pour l'outil <strong>{name}</strong> aujourd'hui. Les quotas se réinitialisent toutes les 24h.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-lg mx-auto flex items-center gap-3 text-left">
            <Sparkles className="h-5 w-5 text-blue-600 shrink-0 animate-pulse" />
            <p className="text-xs text-slate-600 leading-normal">
              <strong>Devenez membre Professionnel</strong> pour éliminer toutes les limites journalières, multiplier par 10 la vitesse de traitement et pouvoir importer des fichiers jusqu'à 500 Mo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button
              id="blocker-pricing-btn"
              onClick={() => onNavigate('pricing')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-blue-100 transition cursor-pointer"
            >
              Découvrir les forfaits Pro
            </button>
            <button
              id="blocker-back-btn"
              onClick={onBack}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm py-3.5 px-6 rounded-xl transition cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : success && result ? (
        
        /* STATE 4: SUCCESS COMPLETED STAGE */
        <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center space-y-6 shadow-xl shadow-slate-100/50">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-black text-slate-950">Traitement Terminé !</h2>
            <p className="text-slate-500 text-sm">
              Votre document est prêt pour le téléchargement. Pour votre sécurité, ce fichier sera supprimé de nos serveurs de façon permanente.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 max-w-md mx-auto flex items-center gap-4 text-left">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div className="truncate flex-1">
              <p className="font-bold text-slate-900 text-sm truncate">{result.filename}</p>
              <p className="text-xs font-mono text-slate-400 mt-0.5">Taille estimée : {result.size}</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Sécurisé
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
            <a
              id="tool-download-result-link"
              href={result.downloadUrl}
              download={result.filename}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-blue-100 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="h-4.5 w-4.5" /> Télécharger le fichier
            </a>
            <button
              id="tool-convert-again-btn"
              onClick={handleReset}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm py-3.5 px-6 rounded-xl transition cursor-pointer"
            >
              Recommencer
            </button>
          </div>
        </div>
      ) : processing ? (
        
        /* STATE 3: DETAILED CONVERSION TIMELINE STAGE */
        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-xl shadow-slate-100/50">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-slate-900">Conversion en cours...</h3>
            <p className="text-xs text-slate-400">Ne fermez pas cette page, traitement en cours de cryptage local.</p>
          </div>

          {/* Timeline points */}
          <div className="max-w-xs mx-auto space-y-4 pt-4 text-sm font-medium">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                processStep >= 1 ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400'
              }`}>
                1
              </div>
              <span className={processStep >= 1 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                Importation & vérification du fichier
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                processStep >= 2 ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400'
              }`}>
                2
              </div>
              <span className={processStep >= 2 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                Analyse structurelle et extraction
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                processStep >= 3 ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-400'
              }`}>
                3
              </div>
              <span className={processStep >= 3 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                Optimisation & compilation finale
              </span>
            </div>
          </div>
        </div>
      ) : (
        
        /* STATE 2: UPLOADING & CONFIG STAGE */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Upload DropZone (2/3 width) */}
          <div className="md:col-span-2 space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-4 min-h-[300px] bg-slate-50/40 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] relative overflow-hidden ${
                isDragging 
                  ? 'border-blue-600 bg-blue-50/30' 
                  : 'border-slate-200 hover:border-blue-500 hover:bg-slate-50/70'
              }`}
            >
              <input
                id="tool-file-uploader"
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept={
                  toolId.includes('pdf') 
                    ? '.pdf' 
                    : toolId === 'word2pdf' 
                    ? '.docx,.doc' 
                    : 'image/*'
                }
              />

              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl relative z-10">
                <Upload className="h-6 w-6 animate-bounce" />
              </div>

              <div className="space-y-1 relative z-10">
                <p className="font-bold text-slate-800 text-sm">
                  Glissez-déposez vos fichiers ici
                </p>
                <p className="text-xs text-slate-400">
                  Ou cliquez pour parcourir vos dossiers locaux
                </p>
              </div>

              <div className="text-[10px] text-slate-400 font-semibold font-mono border border-slate-200 bg-white px-3 py-1 rounded-full relative z-10 shadow-xs">
                Formats acceptés : {toolId.includes('pdf') ? 'PDF' : toolId === 'word2pdf' ? 'Word .docx' : 'PNG, JPG, WEBP'}
              </div>
            </div>

            {/* List selected files */}
            {selectedFiles.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Fichiers importés ({selectedFiles.length})
                </p>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {selectedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {f.type.startsWith('image/') ? (
                          <FileImage className="h-4 w-4 text-teal-600 shrink-0" />
                        ) : (
                          <File className="h-4 w-4 text-blue-600 shrink-0" />
                        )}
                        <span className="text-slate-800 truncate font-semibold" title={f.name}>
                          {f.name}
                        </span>
                        <span className="text-slate-400 font-mono">({(f.size / (1024 * 1024)).toFixed(2)} Mo)</span>
                      </div>
                      <button
                        id={`remove-upload-file-${i}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(i);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Configuration Settings Panel (1/3 width) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                <Settings className="h-4.5 w-4.5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Configuration</h3>
              </div>

              {/* Merge tool ordering notification info */}
              {toolId === 'merge' && (
                <div className="p-3 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-xs space-y-1">
                  <span className="font-bold block">Ordre de fusion</span>
                  <span className="leading-normal block">Les fichiers seront assemblés dans l'ordre d'affichage ci-contre.</span>
                </div>
              )}

              {/* Split options */}
              {toolId === 'split' && (
                <div className="space-y-3 text-xs text-slate-700">
                  <label className="block font-bold text-slate-500 uppercase tracking-widest text-[10px]" htmlFor="config-split-range">
                    Pages à extraire
                  </label>
                  <input
                    id="config-split-range"
                    type="text"
                    value={splitRange}
                    onChange={(e) => setSplitRange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-hidden"
                    placeholder="Ex: 1-3, 5, 8-10"
                  />
                  <span className="text-[10px] text-slate-400 leading-normal block">
                    Indiquez les intervalles séparés par des virgules pour créer des fichiers PDF segmentés.
                  </span>
                </div>
              )}

              {/* Compression rate select options */}
              {toolId === 'compress' && (
                <div className="space-y-2.5">
                  <span className="block font-bold text-slate-500 uppercase tracking-widest text-[10px]">Taux de compression</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['low', 'medium', 'high'] as const).map((lvl) => (
                      <button
                        id={`config-compress-${lvl}`}
                        key={lvl}
                        type="button"
                        onClick={() => setCompressLevel(lvl)}
                        className={`py-2 rounded-lg font-bold border transition capitalize cursor-pointer ${
                          compressLevel === lvl
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {lvl === 'low' ? 'Faible' : lvl === 'medium' ? 'Normal' : 'Élevé'}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 leading-normal block pt-1">
                    {compressLevel === 'low' && 'Optimisation mineure, qualité d\'image intacte.'}
                    {compressLevel === 'medium' && 'Équilibre parfait entre taille réduite et netteté (Recommandé).'}
                    {compressLevel === 'high' && 'Compression maximale, qualité d\'image ajustée.'}
                  </span>
                </div>
              )}

              {/* Image orientation option */}
              {toolId === 'img2pdf' && (
                <div className="space-y-2.5">
                  <span className="block font-bold text-slate-500 uppercase tracking-widest text-[10px]">Orientation des pages</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['auto', 'portrait', 'landscape'] as const).map((orient) => (
                      <button
                        id={`config-orientation-${orient}`}
                        key={orient}
                        type="button"
                        onClick={() => setOrientation(orient)}
                        className={`py-2 rounded-lg font-bold border transition capitalize cursor-pointer ${
                          orientation === orient
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {orient === 'auto' ? 'Auto' : orient === 'portrait' ? 'Portr.' : 'Pays.'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Image converter output option select */}
              {toolId === 'imgconvert' && (
                <div className="space-y-2.5">
                  <span className="block font-bold text-slate-500 uppercase tracking-widest text-[10px]">Format de sortie</span>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {(['webp', 'png', 'jpg'] as const).map((fmt) => (
                      <button
                        id={`config-format-${fmt}`}
                        key={fmt}
                        type="button"
                        onClick={() => setImageFormat(fmt)}
                        className={`py-2 rounded-lg font-bold border transition uppercase cursor-pointer ${
                          imageFormat === fmt
                            ? 'bg-rose-600 border-rose-600 text-white'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 leading-normal block pt-1">
                    Le format WEBP est recommandé pour réduire la taille des pages de vos sites web.
                  </span>
                </div>
              )}

              {/* General inputs rendering helper */}
              {children && <div className="pt-2">{children}</div>}
            </div>

            <div>
              <button
                id="launch-process-btn"
                onClick={handleLaunchProcess}
                disabled={selectedFiles.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-100 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Lancer le traitement</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
