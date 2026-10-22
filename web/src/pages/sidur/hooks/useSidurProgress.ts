import { useState, useEffect, useCallback } from 'react';
import { SidurProgress, SidurTefilaId } from '../../../../../packages/shared/src/types';
import {
  getStoredSidurProgress,
  toggleTefilaCompletedToday,
} from '../services/sidurService';

export function useSidurProgress(userId?: string) {
  const [progress, setProgress] = useState<SidurProgress>(() =>
    getStoredSidurProgress(userId)
  );

  useEffect(() => {
    setProgress(getStoredSidurProgress(userId));
  }, [userId]);

  const toggleCompleted = useCallback(
    async (tefilaId: SidurTefilaId) => {
      const updated = await toggleTefilaCompletedToday(tefilaId, userId);
      setProgress(updated);
      return updated;
    },
    [userId]
  );

  return {
    progress,
    toggleCompleted,
  };
}
