import React from 'react';
import { FileArchive, FileSpreadsheet, Layers, Image, FileText } from 'lucide-react';
import ToolInterface from './ToolInterface';
import { User, ToolId } from '../../types';

interface GenericToolProps {
  toolId: ToolId;
  currentUser: User;
  dailyFreeLimit: number;
  onBack: () => void;
  onOperationComplete: (filename: string, size: string, downloadUrl?: string) => void;
  onNavigate: (screen: string) => void;
}

export default function GenericTool({
  toolId,
  currentUser,
  dailyFreeLimit,
  onBack,
  onOperationComplete,
  onNavigate,
}: GenericToolProps) {
  
  // Custom metadata configurations depending on the tool
  const getToolMetadata = () => {
    switch (toolId) {
      case 'merge':
        return {
          name: 'Fusionner PDF',
          description: 'Rassemblez et combinez plusieurs documents PDF en un fichier unique et ordonné de manière rapide.',
        };
      case 'split':
        return {
          name: 'Diviser PDF',
          description: 'Séparez des chapitres de documents ou extrayez une série de pages pour alléger vos dossiers.',
        };
      case 'compress':
        return {
          name: 'Compresser PDF',
          description: 'Réduisez le poids numérique de vos documents PDF de près de 60% sans dégrader les textes ou graphismes.',
        };
      case 'pdf2img':
        return {
          name: 'PDF en Image',
          description: 'Rendez les pages de vos PDF partageables sous forme d\'images indépendantes JPG ou PNG.',
        };
      case 'pdf2word':
        return {
          name: 'PDF en Word',
          description: 'Récupérez les textes d\'un PDF figé pour les injecter dans un format Microsoft Word .docx entièrement révisable.',
        };
      case 'word2pdf':
        return {
          name: 'Word en PDF',
          description: 'Convertissez instantanément vos fichiers .doc ou .docx en format PDF universel avec un alignement parfait.',
        };
      default:
        return {
          name: 'Outil SwiftPDF',
          description: 'Éditez, compressez ou convertissez vos fichiers de manière sécurisée en quelques clics.',
        };
    }
  };

  const meta = getToolMetadata();

  return (
    <GenericToolContainer
      toolId={toolId}
      name={meta.name}
      description={meta.description}
      currentUser={currentUser}
      dailyFreeLimit={dailyFreeLimit}
      onBack={onBack}
      onOperationComplete={onOperationComplete}
      onNavigate={onNavigate}
    />
  );
}

// Sub-component to manage state and custom options
interface ContainerProps {
  toolId: ToolId;
  name: string;
  description: string;
  currentUser: User;
  dailyFreeLimit: number;
  onBack: () => void;
  onOperationComplete: (filename: string, size: string, downloadUrl?: string) => void;
  onNavigate: (screen: string) => void;
}

function GenericToolContainer({
  toolId,
  name,
  description,
  currentUser,
  dailyFreeLimit,
  onBack,
  onOperationComplete,
  onNavigate,
}: ContainerProps) {
  return (
    <ToolInterface
      toolId={toolId}
      name={name}
      description={description}
      currentUser={currentUser}
      dailyFreeLimit={dailyFreeLimit}
      onBack={onBack}
      onOperationComplete={onOperationComplete}
      onNavigate={onNavigate}
    />
  );
}
