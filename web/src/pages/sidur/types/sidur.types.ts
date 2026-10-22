import { SidurTefilaId } from '../../../../../packages/shared/src/types';
import { SacredNameOption } from '../../../lib/hebrewPhonetics';

export type SidurFontSize = 'sm' | 'base' | 'lg' | 'xl';

export interface SidurDisplayPreferences {
  showHebrew: boolean;
  showTranslit: boolean;
  showSpanish: boolean;
  fontSize: SidurFontSize;
  sacredNameMode: SacredNameOption;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  sources?: string[];
  isError?: boolean;
}

export interface QuickQuestion {
  id: string;
  label: string;
  query: string;
  category: 'halaja' | 'minhag' | 'kavana';
}
