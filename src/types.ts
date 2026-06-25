export type ToolId =
  | 'merge'
  | 'split'
  | 'compress'
  | 'pdf2img'
  | 'img2pdf'
  | 'pdf2word'
  | 'word2pdf'
  | 'imgconvert';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  creditsUsed: Record<ToolId, number>;
  createdAt: string;
  isAdmin: boolean;
  status: 'active' | 'suspended';
}

export interface Operation {
  id: string;
  toolId: ToolId;
  filename: string;
  date: string;
  size: string;
  status: 'success' | 'failed';
  downloadUrl?: string;
  userId?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  plan: string;
  status: 'paid' | 'pending';
  pdfName: string;
  userId?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  email: string;
  action: string;
  details: string;
  type: 'info' | 'warning' | 'success';
}

export interface SystemSettings {
  dailyFreeLimit: number;
  proPriceMonthly: number;
  enterprisePriceMonthly: number;
  maintenanceMode: boolean;
}

export interface ToolDefinition {
  id: ToolId;
  name: string;
  description: string;
  icon: string;
  category: 'pdf' | 'image';
  popular?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'pricing' | 'tools' | 'general';
}

