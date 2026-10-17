import React from 'react';
import { StudyBlock, LearningMethod } from '../types/hebrewSrs.types';
import { METHOD_LABELS } from '../services/srsAlgorithm';
import {
  Settings,
  Sparkles,
  PenTool,
  Volume2,
  BookOpen,
  Info,
  Check,
} from 'lucide-react';

interface BlockSettingsViewProps {
  blocks: StudyBlock[];
  blockSettings: Record<string, LearningMethod>;
  onUpdateMethod: (blockId: string, method: LearningMethod) => void;
}

export const BlockSettingsView: React.FC<BlockSettingsViewProps> = ({
  blocks,
  blockSettings,
  onUpdateMethod,
}) => {
  const methodDescriptions: Record<string, { desc: string; icon: React.ReactNode }> = {
    srs_puro: {
      desc: 'Tarjeta tradicional de volteo rápido sin pistas. Control base del experimento.',
      icon: <Sparkles className="w-4 h-4 text-indigo-500" />,
    },
    kinetic: {
      desc: 'Exige o promueve trazar la consonante en papel antes de calificar para activar memoria motora.',
      icon: <PenTool className="w-4 h-4 text-amber-500" />,
    },
    auditory: {
      desc: 'Síntesis automática de voz en hebreo (he-IL) para reforzar el vínculo grafema-fonema.',
      icon: <Volume2 className="w-4 h-4 text-blue-500" />,
    },
    analytic: {
      desc: 'Desglose detallado de la regla gramatical (oclusiva/fricativa, daguesh, longitud vocálica).',
      icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
    },
  };

  const methodsList: LearningMethod[] = ['srs_puro', 'kinetic', 'auditory', 'analytic'];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Banner Explicativo de la Metodología Anti-Sesgo */}
      <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
          <strong className="text-indigo-900 dark:text-indigo-200 block font-bold">
            Diseño Experimental con Aislamiento de Bloques (Anti-Sesgo)
          </strong>
          <p>
            Para comparar científicamente los métodos de aprendizaje sin que el conocimiento previo
            contamine los resultados (*sesgo de arrastre*), asigna un método diferente a cada bloque
            de estudio (ej. Bloque A con <em>SRS Puro</em> y Bloque B con <em>Kinético</em>).
          </p>
        </div>
      </div>

      {/* Lista de Bloques y Selector de Métodos */}
      <div className="space-y-4">
        {blocks.map((block) => {
          const currentMethod = blockSettings[block.id] || 'srs_puro';

          return (
            <div
              key={block.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Vocal focalizada: {block.vowel_focus}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {block.name}
                  </h3>
                </div>
                <div className="text-xs text-slate-500">
                  Método asignado:{' '}
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {METHOD_LABELS[currentMethod]}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">{block.description}</p>

              {/* Selector de Métodos para este Bloque */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {methodsList.map((methodKey) => {
                  const isSelected = currentMethod === methodKey;
                  const item = methodDescriptions[methodKey];

                  return (
                    <button
                      key={methodKey}
                      type="button"
                      onClick={() => onUpdateMethod(block.id, methodKey)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/40 dark:bg-slate-900/30'
                      }`}
                    >
                      <div className="mt-0.5">{item.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {METHOD_LABELS[methodKey]}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
