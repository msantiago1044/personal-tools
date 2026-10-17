import React, { useState, useEffect } from 'react';
import { MatchPairToken } from '../../types/hebrewSrs.types';
import { HebrewAudioService } from '../../services/hebrewAudio';
import { Zap, CheckCircle2, ArrowRight } from 'lucide-react';

interface MatchPairsExerciseProps {
  items: MatchPairToken[];
  onComplete: (isCorrect: boolean, reactionTimeMs: number) => void;
}

interface Tile {
  id: string;
  tokenId: string;
  type: 'symbol' | 'sound';
  label: string;
}

export const MatchPairsExercise: React.FC<MatchPairsExerciseProps> = ({
  items,
  onComplete,
}) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [matchedTokenIds, setMatchedTokenIds] = useState<string[]>([]);
  const [startTime] = useState(performance.now());
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);

  // Seleccionar 4 pares aleatorios y desordenarlos
  useEffect(() => {
    const selectedPairs = [...items].sort(() => Math.random() - 0.5).slice(0, 4);

    const generatedTiles: Tile[] = [];
    selectedPairs.forEach((pair) => {
      generatedTiles.push({
        id: `sym_${pair.id}`,
        tokenId: pair.id,
        type: 'symbol',
        label: pair.symbol,
      });
      generatedTiles.push({
        id: `snd_${pair.id}`,
        tokenId: pair.id,
        type: 'sound',
        label: pair.sound,
      });
    });

    setTiles(generatedTiles.sort(() => Math.random() - 0.5));
    setMatchedTokenIds([]);
    setSelectedTile(null);
  }, [items]);

  const handleTileClick = (tile: Tile) => {
    if (matchedTokenIds.includes(tile.tokenId)) return;
    if (selectedTile?.id === tile.id) {
      setSelectedTile(null);
      return;
    }

    if (!selectedTile) {
      setSelectedTile(tile);
      if (tile.type === 'symbol') {
        HebrewAudioService.speak(tile.label);
      }
      return;
    }

    // Si ya había una seleccionada y son de tipos opuestos (un símbolo y un sonido)
    if (selectedTile.type !== tile.type) {
      if (selectedTile.tokenId === tile.tokenId) {
        // ¡Coincidencia correcta!
        const newMatched = [...matchedTokenIds, tile.tokenId];
        setMatchedTokenIds(newMatched);
        setSelectedTile(null);

        // Si completó los 4 pares
        if (newMatched.length === 4) {
          const reactionTime = Math.round(performance.now() - startTime);
          setTimeout(() => {
            onComplete(true, reactionTime);
          }, 700);
        }
      } else {
        // Error de emparejamiento
        setWrongPair([selectedTile.id, tile.id]);
        setTimeout(() => {
          setWrongPair(null);
          setSelectedTile(null);
        }, 500);
      }
    } else {
      // Tocó dos del mismo tipo, cambia la selección
      setSelectedTile(tile);
    }
  };

  const isAllCompleted = matchedTokenIds.length === 4;

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" />
          Emparejamiento Rápido
        </span>
        <span className="text-xs text-slate-400 font-medium">
          {matchedTokenIds.length} de 4 parejas unidas
        </span>
      </div>

      <div className="text-center">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Une cada símbolo hebreo con su sonido exacto
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Toca un par a contrarreloj</p>
      </div>

      {/* Cuadrícula de 8 Fichas (4x2) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tiles.map((tile) => {
          const isMatched = matchedTokenIds.includes(tile.tokenId);
          const isSelected = selectedTile?.id === tile.id;
          const isWrong = wrongPair?.includes(tile.id);

          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              disabled={isMatched}
              className={`h-24 rounded-2xl flex items-center justify-center font-bold transition-all shadow-sm active:scale-95 ${
                isMatched
                  ? 'opacity-0 pointer-events-none scale-75'
                  : isWrong
                  ? 'bg-rose-100 border-2 border-rose-500 text-rose-700 animate-shake'
                  : isSelected
                  ? 'bg-indigo-600 text-white border-2 border-indigo-600 scale-105 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-indigo-400'
              }`}
            >
              <span
                className={
                  tile.type === 'symbol'
                    ? 'text-4xl font-serif'
                    : 'text-sm font-sans tracking-wide'
                }
                style={
                  tile.type === 'symbol'
                    ? { fontFamily: '"SBL Hebrew", serif' }
                    : undefined
                }
              >
                {tile.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Estado al terminar */}
      {isAllCompleted && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>¡Excelente velocidad de asociación!</span>
          </div>
          <button
            onClick={() => onComplete(true, Math.round(performance.now() - startTime))}
            className="py-2 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-md hover:bg-emerald-700"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
