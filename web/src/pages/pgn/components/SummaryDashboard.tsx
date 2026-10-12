import React from 'react';
import { PGN_MODULES, PGN_CLASSES } from '../data/pgnCurriculumData';
import { UserPgnProgress } from '../types/pgn.types';
import {
  Award,
  CheckCircle2,
  BookOpen,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface SummaryDashboardProps {
  progress: UserPgnProgress;
  onSelectClass: (classId: number) => void;
  onSelectModule: (moduleId: number) => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  progress,
  onSelectClass,
  onSelectModule,
}) => {
  const completedCount = progress.completedClasses.length;
  const progressPercentage = Math.round((completedCount / PGN_CLASSES.length) * 100);

  // Checkpoints acertados
  const answeredCount = Object.keys(progress.checkpointAnswers).length;
  const correctCheckpoints = Object.entries(progress.checkpointAnswers).reduce((acc, [classIdStr, ansKey]) => {
    const classItem = PGN_CLASSES.find((c) => c.id === Number(classIdStr));
    return classItem && classItem.checkpoint.correctKey === ansKey ? acc + 1 : acc;
  }, 0);

  const checkpointAccuracy = answeredCount > 0 ? Math.round((correctCheckpoints / answeredCount) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Tarjeta de Bienvenida y Progreso */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-emerald-200 border border-white/15">
              Convocatoria Mérito Construyendo Excelencia
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
              Preparación al Mérito: Profesional 3PU-15
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
              10 Semanas • 40 Clases Microlearning • 170 Preguntas de Juicio Situacional • Universidad de Antioquia
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl sm:text-4xl font-black">{progressPercentage}%</span>
            <span className="text-xs text-emerald-200 block">Progreso del Curso</span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Métricas destacadas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div>
            <span className="text-emerald-200/70 block">Clases Estudiadas</span>
            <strong className="text-base font-bold">{completedCount} / 40</strong>
          </div>
          <div>
            <span className="text-emerald-200/70 block">Checkpoints Resueltos</span>
            <strong className="text-base font-bold">{answeredCount} / 40</strong>
          </div>
          <div>
            <span className="text-emerald-200/70 block">Precisión en Preguntas</span>
            <strong className="text-base font-bold">{checkpointAccuracy}%</strong>
          </div>
          <div>
            <span className="text-emerald-200/70 block">Corte Eliminatorio</span>
            <strong className="text-base font-bold text-amber-300">65,00 / 100</strong>
          </div>
        </div>
      </div>

      {/* Módulos Curriculares */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          Módulos de Formación
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {PGN_MODULES.map((mod) => {
            const moduleClasses = PGN_CLASSES.filter((c) => c.moduleId === mod.id);
            const modCompleted = moduleClasses.filter((c) => progress.completedClasses.includes(c.id)).length;
            const modPct = Math.round((modCompleted / moduleClasses.length) * 100);

            return (
              <div
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition shadow-xs cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {mod.weeks}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {modPct}%
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    {mod.shortTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Clases {mod.classRange[0]} a {mod.classRange[1]}</span>
                  <span className="text-emerald-600 font-medium">Ver Módulo →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ficha de Términos Críticos & Jurisprudencia (Resumen Exprés) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-4">
          <Clock className="w-4 h-4" />
          <span>Ficha de Términos Críticos & Jurisprudencia (Preguntas Típicas de Examen)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <strong className="text-slate-900 dark:text-white block mb-1">Indagación Previa (Art. 208 CGD):</strong>
            <p className="text-slate-600 dark:text-slate-400">
              <strong>6 meses</strong> prorrogables por <strong>3 meses</strong>. Solo procede si hay duda sobre el autor o los hechos.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <strong className="text-slate-900 dark:text-white block mb-1">Investigación Disciplinaria (Art. 213 CGD):</strong>
            <p className="text-slate-600 dark:text-slate-400">
              <strong>6 + 6 meses</strong> ordinario. En faltas gravísimas o pluralidad: <strong>18 + 18 meses</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <strong className="text-slate-900 dark:text-white block mb-1">Caducidad y Prescripción (Art. 33 CGD):</strong>
            <p className="text-slate-600 dark:text-slate-400">
              Caducidad: <strong>5 años</strong> desde la falta para notificar pliego. Prescripción: <strong>5 años</strong> desde el pliego para fallar.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <strong className="text-slate-900 dark:text-white block mb-1">Sentencia C-030 de 2023 (Elegidos por Voto Popular):</strong>
            <p className="text-slate-600 dark:text-slate-400">
              La PGN mantiene la potestad sancionatoria, pero la destitución queda sujeta a <strong>revisión automática del Consejo de Estado</strong> para su eficacia.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <strong className="text-slate-900 dark:text-white block mb-1">Descargos y Alegatos en Juzgamiento:</strong>
            <p className="text-slate-600 dark:text-slate-400">
              Descargos: <strong>15 días hábiles</strong>. Alegatos de conclusión: <strong>10 días hábiles</strong> de traslado común.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <strong className="text-slate-900 dark:text-white block mb-1">Función Pública y Contratación:</strong>
            <p className="text-slate-600 dark:text-slate-400">
              Período de prueba PGN: <strong>6 meses</strong>. Retiro forzoso: <strong>70 años</strong>. Liquidación contractual bilateral: <strong>4 meses</strong>; unilateral: <strong>2 meses</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Decálogo del Aspirante Sobresaliente */}
      <div className="bg-amber-500/5 dark:bg-amber-950/10 border border-amber-500/20 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Decálogo para la Prueba Escrita de la Universidad de Antioquia</span>
        </div>

        <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          <li>La PGN es autónoma: no recibe órdenes del Presidente ni coadministra con alcaldes o gobernadores.</li>
          <li>En disciplinario, la <strong>ilicitud sustancial</strong> (afectación al deber funcional) prevalece sobre formalismos vacíos.</li>
          <li>Quien instruye y formula pliego de cargos NO juzga ni falla (Separación funcional estricta).</li>
          <li>Contra el auto de formulación de pliego de cargos <strong>no procede recurso alguno</strong>.</li>
          <li>El recurso de apelación contra el fallo de primera instancia se concede siempre en el efecto <strong>suspensivo</strong>.</li>
          <li>La consultoría e interventoría se contratan obligatoriamente por <strong>Concurso de Méritos</strong> (precio no se califica).</li>
          <li>Los <strong>Pliegos Tipo</strong> son de obligatorio cumplimiento e inmodificables por entidades territoriales.</li>
          <li>En preguntas de juicio situacional, descarta la opción ilegal en 10 seg y la opción pasiva en 20 seg.</li>
          <li>Elige siempre la conducta con <strong>liderazgo ético, proactividad y apego irrestricto a la ley</strong>.</li>
          <li>Administra 2.5 minutos por pregunta y <strong>nunca dejes respuestas en blanco</strong>.</li>
        </ol>
      </div>
    </div>
  );
};
