import React from 'react';
import { SidurPosture } from '../../../../../packages/shared/src/types';

interface PostureBadgeProps {
  posture?: SidurPosture;
  isSilent?: boolean;
}

export const PostureBadge: React.FC<PostureBadgeProps> = ({ posture, isSilent }) => {
  if (!posture && !isSilent) return null;

  const getPostureStyle = (type?: string) => {
    switch (type) {
      case 'standing':
        return {
          icon: '🧍',
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        };
      case 'bowing':
        return {
          icon: '🙇',
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        };
      case 'chest_beat':
        return {
          icon: '✊',
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        };
      case 'cover_eyes':
        return {
          icon: '👁️',
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        };
      case 'tzitzit':
        return {
          icon: '🪢',
          bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        };
      case 'sitting':
      default:
        return {
          icon: '🪑',
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const style = getPostureStyle(posture?.type);

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {posture && (
        <span
          title={posture.instruction || posture.label}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium border shadow-xs transition-colors ${style.bg}`}
        >
          <span className="text-sm">{style.icon}</span>
          <span>{posture.label}</span>
          {posture.instruction && (
            <span className="hidden sm:inline opacity-75 font-normal border-l border-current/20 pl-1.5">
              {posture.instruction}
            </span>
          )}
        </span>
      )}

      {isSilent && (
        <span
          title="Rezo personal en susurro o devoto silencio"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium border bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
        >
          <span>🤫</span>
          <span>Silencio absoluto</span>
        </span>
      )}
    </div>
  );
};
