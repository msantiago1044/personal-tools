import React from 'react';

interface SidurBookPageProps {
  id?: string;
  tefilaTitleHebrew: string;
  tefilaTitleSpanish: string;
  sectionTitleHebrew?: string;
  sectionTitleSpanish?: string;
  folioNumber?: number;
  children: React.ReactNode;
}

// Conversión a numerales hebreos clásicos (Alef-Bet) para el folio
function toHebrewNumeral(num: number): string {
  const letters: [number, string][] = [
    [400, 'ת'], [300, 'ש'], [200, 'ר'], [100, 'ק'],
    [90, 'צ'], [80, 'פ'], [70, 'ע'], [60, 'ס'],
    [50, 'נ'], [40, 'מ'], [30, 'ל'], [20, 'כ'],
    [10, 'י'], [9, 'ט'], [8, 'ח'], [7, 'ז'],
    [6, 'ו'], [5, 'ה'], [4, 'ד'], [3, 'ג'],
    [2, 'ב'], [1, 'א']
  ];

  if (num === 15) return 'ט״ו';
  if (num === 16) return 'ט״ז';

  let n = num;
  let res = '';
  for (const [val, letter] of letters) {
    while (n >= val) {
      res += letter;
      n -= val;
    }
  }
  if (res.length === 1) return `${res}׳`;
  if (res.length > 1) {
    return `${res.slice(0, -1)}״${res.slice(-1)}`;
  }
  return 'א׳';
}

export const SidurBookPage: React.FC<SidurBookPageProps> = ({
  id,
  tefilaTitleHebrew,
  tefilaTitleSpanish,
  sectionTitleHebrew,
  sectionTitleSpanish,
  folioNumber = 1,
  children,
}) => {
  const hebrewFolio = toHebrewNumeral(folioNumber);

  return (
    <div id={id} className="relative mx-auto max-w-4xl w-full my-6 transition-all duration-300">
      {/* Cinta marcapáginas tradicional de seda que desciende desde el lomo */}
      <div className="absolute -top-3 right-12 z-20 w-7 h-16 pointer-events-none drop-shadow-md hidden sm:block">
        <div className="w-full h-full bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 rounded-b-xs shadow-inner flex items-end justify-center pb-1">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[8px] border-b-slate-100 dark:border-b-slate-950" />
        </div>
      </div>

      {/* Sombra de pila de hojas traseras (simulación de libro grueso) */}
      <div className="absolute inset-x-2 -bottom-2 h-4 bg-amber-100/60 dark:bg-slate-900/80 rounded-b-2xl border-b border-amber-200/50 dark:border-slate-800 -z-10 shadow-sm" />
      <div className="absolute inset-x-4 -bottom-3.5 h-3 bg-amber-100/40 dark:bg-slate-900/60 rounded-b-2xl border-b border-amber-200/30 dark:border-slate-800/80 -z-20" />

      {/* La Hoja Principal del Libro (Textura de pergamino / papel biblia) */}
      <div className="relative rounded-2xl bg-[#FCF9F2] dark:bg-[#131722] text-slate-900 dark:text-slate-100 border border-[#E8DEC8] dark:border-[#2C3347] shadow-[0_10px_30px_-5px_rgba(40,30,10,0.12),0_0_0_1px_rgba(200,180,140,0.25)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.6),0_0_0_1px_rgba(217,170,80,0.15)] overflow-hidden">
        {/* Sutil brillo / gradiente del lomo interior izquierdo */}
        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-amber-900/5 to-transparent dark:from-black/30 pointer-events-none" />

        {/* Marco Ornamental con doble filete litúrgico */}
        <div className="m-3 sm:m-5 p-4 sm:p-7 rounded-xl border-2 border-double border-amber-800/25 dark:border-amber-500/25 relative bg-radial from-transparent to-amber-500/5 dark:to-amber-500/5">
          {/* Florones ornamentales en las 4 esquinas */}
          <span className="absolute -top-2.5 -left-2.5 text-xs text-amber-700/60 dark:text-amber-400/60 select-none">
            ❖
          </span>
          <span className="absolute -top-2.5 -right-2.5 text-xs text-amber-700/60 dark:text-amber-400/60 select-none">
            ❖
          </span>
          <span className="absolute -bottom-2.5 -left-2.5 text-xs text-amber-700/60 dark:text-amber-400/60 select-none">
            ❖
          </span>
          <span className="absolute -bottom-2.5 -right-2.5 text-xs text-amber-700/60 dark:text-amber-400/60 select-none">
            ❖
          </span>

          {/* Titulillo superior clásico de libro (Running Book Header) */}
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-amber-900/20 dark:border-amber-400/20 text-xs text-amber-900/80 dark:text-amber-300/80 select-none font-serif">
            {/* Lado izquierdo: Título de la sección */}
            <div className="flex items-center gap-1.5 font-sans font-medium tracking-wide">
              <span>{sectionTitleSpanish || tefilaTitleSpanish}</span>
              {sectionTitleHebrew && (
                <span dir="rtl" className="font-serif opacity-80">
                  · {sectionTitleHebrew}
                </span>
              )}
            </div>

            {/* Centro: Adorno clásico */}
            <div className="hidden sm:flex items-center gap-2 text-amber-700/70 dark:text-amber-400/70">
              <span>───</span>
              <span className="text-sm">❦</span>
              <span dir="rtl" className="font-serif font-bold text-xs">
                {tefilaTitleHebrew.split(' ')[0]}
              </span>
              <span>───</span>
            </div>

            {/* Lado derecho: Paginación hebrea tradicional */}
            <div className="flex items-center gap-2 font-mono font-bold tracking-wider">
              <span className="text-[11px] font-sans font-normal opacity-70">Folio</span>
              <span dir="rtl" className="font-serif text-sm text-amber-800 dark:text-amber-300">
                {hebrewFolio}
              </span>
            </div>
          </div>

          {/* Contenido de la hoja (las oraciones litúrgicas) */}
          <div className="space-y-6">{children}</div>

          {/* Pie de página clásico de libro (Footer) */}
          <div className="mt-8 pt-3 border-t border-amber-900/20 dark:border-amber-400/20 flex items-center justify-between text-[11px] text-amber-900/60 dark:text-amber-400/60 select-none">
            <span className="italic font-serif">Núsaj Kehilot Maroko · Rito Tradicional Sefardí</span>
            <span className="font-mono text-xs font-semibold">
              — {folioNumber} —
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
