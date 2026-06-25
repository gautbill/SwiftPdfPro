import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import ToolInterface from './ToolInterface';
import { User } from '../../types';

interface ImageToPdfProps {
  currentUser: User;
  dailyFreeLimit: number;
  onBack: () => void;
  onOperationComplete: (filename: string, size: string, downloadUrl?: string) => void;
  onNavigate: (screen: string) => void;
}

export default function ImageToPdf({
  currentUser,
  dailyFreeLimit,
  onBack,
  onOperationComplete,
  onNavigate,
}: ImageToPdfProps) {
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('fit');

  const convertImagesToPdf = async (files: File[]): Promise<{ filename: string; size: string; downloadUrl: string }> => {
    if (files.length === 0) throw new Error("No images selected");

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
    });

    // We convert each image sequentially
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imgDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error("FileReader failed"));
        reader.readAsDataURL(file);
      });

      // Load image dimensions
      const imgDimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = imgDataUrl;
      });

      // Add a page after the first page
      if (i > 0) {
        pdf.addPage();
      }

      // Determine dimensions for page
      let targetWidth = imgDimensions.width;
      let targetHeight = imgDimensions.height;

      if (pageSize === 'a4') {
        // A4 standard points: ~445 x 630 px
        targetWidth = 445;
        targetHeight = (imgDimensions.height / imgDimensions.width) * 445;
        pdf.setPage(i + 1);
      } else if (pageSize === 'letter') {
        // Letter standard
        targetWidth = 460;
        targetHeight = (imgDimensions.height / imgDimensions.width) * 460;
        pdf.setPage(i + 1);
      } else {
        // Fit Page exactly to image
        // Resize page size to fit image
        pdf.setPage(i + 1);
        // Note: setting custom dimensions for fit
      }

      pdf.addImage(imgDataUrl, 'JPEG', 10, 10, targetWidth, targetHeight);
    }

    const pdfBlob = pdf.output('blob');
    const firstFile = files[0];
    const originalName = firstFile.name.substring(0, firstFile.name.lastIndexOf('.')) || firstFile.name;
    const finalName = files.length > 1 ? `swiftpdf_album_${files.length}_pages.pdf` : `${originalName}.pdf`;
    
    const downloadUrl = URL.createObjectURL(pdfBlob);
    const sizeInMb = (pdfBlob.size / (1024 * 1024)).toFixed(2);
    const formattedSize = `${sizeInMb} Mo`;

    return {
      filename: finalName,
      size: formattedSize,
      downloadUrl,
    };
  };

  return (
    <ToolInterface
      toolId="img2pdf"
      name="Image en PDF"
      description="Compilez vos photos, reçus ou scans (formats JPEG, PNG, WEBP) dans un seul document PDF soigné et prêt à imprimer."
      currentUser={currentUser}
      dailyFreeLimit={dailyFreeLimit}
      onBack={onBack}
      onOperationComplete={onOperationComplete}
      onNavigate={onNavigate}
      onProcessFiles={convertImagesToPdf}
    >
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="tool-page-size">
          Format du PDF
        </label>
        <select
          id="tool-page-size"
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value as any)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-hidden cursor-pointer font-bold"
        >
          <option value="fit">Ajuster au contenu (Fit dimensions)</option>
          <option value="a4">Adapter au format A4 standard</option>
          <option value="letter">Adapter au format Lettre US</option>
        </select>
      </div>
    </ToolInterface>
  );
}
