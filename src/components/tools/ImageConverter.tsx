import React, { useState } from 'react';
import { ArrowLeftRight, Settings, Image } from 'lucide-react';
import ToolInterface from './ToolInterface';
import { User } from '../../types';

interface ImageConverterProps {
  currentUser: User;
  dailyFreeLimit: number;
  onBack: () => void;
  onOperationComplete: (filename: string, size: string, downloadUrl?: string) => void;
  onNavigate: (screen: string) => void;
}

export default function ImageConverter({
  currentUser,
  dailyFreeLimit,
  onBack,
  onOperationComplete,
  onNavigate,
}: ImageConverterProps) {
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg' | 'webp'>('webp');

  const processImageFiles = async (files: File[]): Promise<{ filename: string; size: string; downloadUrl: string }> => {
    if (files.length === 0) throw new Error("No files selected");
    
    const file = files[0];
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error("Could not create canvas context"));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          const mimeType = `image/${outputFormat}`;
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error("Could not convert image to blob"));
              return;
            }
            
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFilename = `${originalName}.${outputFormat}`;
            const downloadUrl = URL.createObjectURL(blob);
            const sizeInMb = (blob.size / (1024 * 1024)).toFixed(2);
            const formattedSize = `${sizeInMb} Mo`;
            
            resolve({
              filename: newFilename,
              size: formattedSize,
              downloadUrl,
            });
          }, mimeType, 0.9);
        };
        img.onerror = () => reject(new Error("Could not load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  };

  return (
    <ToolInterface
      toolId="imgconvert"
      name="Convertisseur d'Images"
      description="Convertissez vos clichés locaux en formats de pointe comme le WEBP pour le SEO ou ré-encodez-les en formats classiques PNG et JPEG."
      currentUser={currentUser}
      dailyFreeLimit={dailyFreeLimit}
      onBack={onBack}
      onOperationComplete={onOperationComplete}
      onNavigate={onNavigate}
      onProcessFiles={processImageFiles}
    >
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="tool-format-select">
          Option d'encodage
        </label>
        <select
          id="tool-format-select"
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value as any)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-hidden cursor-pointer font-bold font-mono"
        >
          <option value="webp">Encoder en WEBP (Optimisé Web)</option>
          <option value="png">Encoder en PNG (Sans compression)</option>
          <option value="jpeg">Encoder en JPEG (Universel)</option>
        </select>
      </div>
    </ToolInterface>
  );
}
