import { SidurTefilaId, SidurPrayerMode } from '../../../../../packages/shared/src/types';

export type SidurFontSize = 'sm' | 'base' | 'lg' | 'xl';

export interface SidurDisplayPreferences {
  showHebrew: boolean;
  showTranslit: boolean;
  showSpanish: boolean;
  fontSize: SidurFontSize;
  prayerMode: SidurPrayerMode;
}
