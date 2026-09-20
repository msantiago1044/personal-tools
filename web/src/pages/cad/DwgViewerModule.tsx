import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CadDrawing, CadEntity, CadPoint } from '../../../../packages/shared/src/types';
import {
  getSampleCivil3DDrawing,
  getSampleArchitecturalDrawing,
  parseDxfContent,
  parseDwgBinary,
} from '../../lib/cadParser';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Ruler,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  ArrowLeft,
  FileCode,
  Check,
  Eye,
  EyeOff,
  Crosshair,
  Info,
  Compass,
  FileText,
  AlertCircle,
  FolderOpen,
  Sparkles
} from 'lucide-react';

interface DwgViewerModuleProps {
  onBackToHub: () => void;
}

export const DwgViewerModule: React.FC<DwgViewerModuleProps> = ({ onBackToHub }) => {
  // Estado del dibujo cargado: Inicialmente null (sin plano demo por defecto)
  const [drawing, setDrawing] = useState<CadDrawing | null>(null);
  const [layersState, setLayersState] = useState<Record<string, boolean>>({});
  const [isDarkCanvas, setIsDarkCanvas] = useState<boolean>(true);
  const [layersPanelOpen, setLayersPanelOpen] = useState<boolean>(true);
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<CadPoint[]>([]);
  const [activeCursorPos, setActiveCursorPos] = useState<CadPoint>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Estados de carga interactiva
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Transformación del Viewport: escala y desplazamiento
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ajustar plano a la pantalla (Zoom Extents)
  const fitToScreen = useCallback((dwg: CadDrawing) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { minX, minY, maxX, maxY } = dwg.bounds;
    const dwgWidth = maxX - minX || 100;
    const dwgHeight = maxY - minY || 100;

    const padding = 60;
    const availWidth = canvas.clientWidth - padding * 2;
    const availHeight = canvas.clientHeight - padding * 2;

    const scaleX = availWidth / dwgWidth;
    const scaleY = availHeight / dwgHeight;
    const newScale = Math.min(scaleX, scaleY, 4);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const screenCenterX = canvas.clientWidth / 2;
    const screenCenterY = canvas.clientHeight / 2;

    setScale(newScale);
    setOffset({
      x: screenCenterX - centerX * newScale,
      y: screenCenterY + centerY * newScale,
    });
    setStatusMessage('Vista ajustada a los límites del plano (Zoom Extents)');
  }, []);

  // Inicializar capas al cambiar de dibujo
  useEffect(() => {
    if (!drawing) return;
    const initialLayers: Record<string, boolean> = {};
    Object.keys(drawing.layers).forEach((lKey) => {
      initialLayers[lKey] = drawing.layers[lKey].visible !== false;
    });
    setLayersState(initialLayers);
    setTimeout(() => fitToScreen(drawing), 50);
    setMeasurePoints([]);
  }, [drawing, fitToScreen]);

  // Conversión de coordenadas
  const worldToScreen = useCallback(
    (wx: number, wy: number) => {
      return {
        sx: offset.x + wx * scale,
        sy: offset.y - wy * scale,
      };
    },
    [offset, scale]
  );

  const screenToWorld = useCallback(
    (sx: number, sy: number): CadPoint => {
      return {
        x: (sx - offset.x) / scale,
        y: -(sy - offset.y) / scale,
      };
    },
    [offset, scale]
  );

  // RENDERIZADO EN EL CANVAS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !drawing) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Fondo del espacio de trabajo CAD
    const bgColor = isDarkCanvas ? '#0b0f19' : '#f8fafc';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // 1. Dibujar Rejilla CAD (Grid)
    const gridSizeWorld = 50;
    const gridSizeScreen = gridSizeWorld * scale;

    if (gridSizeScreen > 15) {
      ctx.strokeStyle = isDarkCanvas ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;

      const startX = offset.x % gridSizeScreen;
      const startY = offset.y % gridSizeScreen;

      ctx.beginPath();
      for (let x = startX; x < width; x += gridSizeScreen) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = startY; y < height; y += gridSizeScreen) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }

    // 2. Ejes de Origen (0,0)
    const origin = worldToScreen(0, 0);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(origin.sx, origin.sy);
    ctx.lineTo(origin.sx + 40, origin.sy);
    ctx.stroke();

    ctx.strokeStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(origin.sx, origin.sy);
    ctx.lineTo(origin.sx, origin.sy - 40);
    ctx.stroke();

    // 3. Renderizar Entidades CAD
    drawing.entities.forEach((ent: CadEntity) => {
      if (layersState[ent.layer] === false) return;

      const layerColor = drawing.layers[ent.layer]?.color || '#38bdf8';
      const color = ent.color || layerColor;

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.2;

      switch (ent.type) {
        case 'LINE':
          if (ent.start && ent.end) {
            const p1 = worldToScreen(ent.start.x, ent.start.y);
            const p2 = worldToScreen(ent.end.x, ent.end.y);
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.stroke();
          }
          break;

        case 'LWPOLYLINE':
        case 'POLYLINE':
          if (ent.vertices && ent.vertices.length > 1) {
            ctx.beginPath();
            const first = worldToScreen(ent.vertices[0].x, ent.vertices[0].y);
            ctx.moveTo(first.sx, first.sy);
            for (let i = 1; i < ent.vertices.length; i++) {
              const pt = worldToScreen(ent.vertices[i].x, ent.vertices[i].y);
              ctx.lineTo(pt.sx, pt.sy);
            }
            if (ent.closed) {
              ctx.closePath();
            }
            ctx.stroke();
          }
          break;

        case 'CIRCLE':
          if (ent.center && ent.radius) {
            const c = worldToScreen(ent.center.x, ent.center.y);
            const rScreen = ent.radius * scale;
            ctx.beginPath();
            ctx.arc(c.sx, c.sy, rScreen, 0, Math.PI * 2);
            ctx.stroke();
          }
          break;

        case 'ARC':
          if (ent.center && ent.radius && ent.startAngle !== undefined && ent.endAngle !== undefined) {
            const c = worldToScreen(ent.center.x, ent.center.y);
            const rScreen = ent.radius * scale;
            ctx.beginPath();
            ctx.arc(c.sx, c.sy, rScreen, -ent.endAngle, -ent.startAngle, false);
            ctx.stroke();
          }
          break;

        case 'TEXT':
        case 'MTEXT':
          if (ent.start && ent.text) {
            const pt = worldToScreen(ent.start.x, ent.start.y);
            const fontSizeScreen = Math.max((ent.height || 8) * scale, 8);
            if (fontSizeScreen > 4) {
              ctx.font = `${Math.min(fontSizeScreen, 48)}px monospace, sans-serif`;
              ctx.fillText(ent.text, pt.sx, pt.sy);
            }
          }
          break;
      }
    });

    // 4. Medición
    if (measurePoints.length > 0) {
      ctx.strokeStyle = '#f59e0b';
      ctx.fillStyle = '#f59e0b';
      ctx.lineWidth = 2;

      const p1Screen = worldToScreen(measurePoints[0].x, measurePoints[0].y);
      ctx.beginPath();
      ctx.arc(p1Screen.sx, p1Screen.sy, 5, 0, Math.PI * 2);
      ctx.fill();

      let p2Screen = p1Screen;
      let p2World = measurePoints[0];

      if (measurePoints.length >= 2) {
        p2World = measurePoints[1];
        p2Screen = worldToScreen(p2World.x, p2World.y);
      } else {
        p2World = activeCursorPos;
        p2Screen = worldToScreen(activeCursorPos.x, activeCursorPos.y);
      }

      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(p1Screen.sx, p1Screen.sy);
      ctx.lineTo(p2Screen.sx, p2Screen.sy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(p2Screen.sx, p2Screen.sy, 5, 0, Math.PI * 2);
      ctx.fill();

      const dx = p2World.x - measurePoints[0].x;
      const dy = p2World.y - measurePoints[0].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const midX = (p1Screen.sx + p2Screen.sx) / 2;
      const midY = (p1Screen.sy + p2Screen.sy) / 2;

      ctx.fillStyle = isDarkCanvas ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      const textDist = `L: ${dist.toFixed(2)} m (ΔX: ${dx.toFixed(2)}, ΔY: ${dy.toFixed(2)})`;
      ctx.font = 'bold 12px sans-serif';
      const textWidth = ctx.measureText(textDist).width;

      ctx.fillRect(midX - textWidth / 2 - 6, midY - 20, textWidth + 12, 24);
      ctx.strokeRect(midX - textWidth / 2 - 6, midY - 20, textWidth + 12, 24);

      ctx.fillStyle = isDarkCanvas ? '#f59e0b' : '#b45309';
      ctx.fillText(textDist, midX - textWidth / 2, midY - 4);
    }

    // 5. Mira de AutoCAD (Crosshair)
    if (!isPanning && canvas) {
      const c = worldToScreen(activeCursorPos.x, activeCursorPos.y);
      ctx.strokeStyle = isDarkCanvas ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(0, c.sy);
      ctx.lineTo(width, c.sy);
      ctx.moveTo(c.sx, 0);
      ctx.lineTo(c.sx, height);
      ctx.stroke();

      ctx.strokeRect(c.sx - 4, c.sy - 4, 8, 8);
    }
  }, [drawing, layersState, isDarkCanvas, offset, scale, isPanning, activeCursorPos, measurePoints, worldToScreen]);

  // Procesamiento con barra de carga paso a paso
  const processFileWithProgress = async (file: File) => {
    setIsLoading(true);
    setLoadingProgress(10);
    setLoadingStage(`Leyendo archivo '${file.name}' (${(file.size / 1024).toFixed(1)} KB)...`);

    const ext = file.name.split('.').pop()?.toLowerCase();

    try {
      await new Promise((r) => setTimeout(r, 150));
      setLoadingProgress(35);
      setLoadingStage('Analizando cabecera y tablas CAD (Capas, Bloques, Estilos)...');

      let parsed: CadDrawing;

      if (ext === 'dxf') {
        const text = await file.text();
        setLoadingProgress(65);
        setLoadingStage('Extrayendo entidades vectoriales DXF (Líneas, Polilíneas, Cotas)...');
        await new Promise((r) => setTimeout(r, 150));
        parsed = parseDxfContent(text, file.name);
      } else if (ext === 'dwg') {
        const buffer = await file.arrayBuffer();
        setLoadingProgress(65);
        setLoadingStage('Decodificando binario DWG con motor WebAssembly...');
        await new Promise((r) => setTimeout(r, 200));
        parsed = await parseDwgBinary(buffer, file.name);
      } else {
        throw new Error('Por favor selecciona un archivo válido con extensión .dwg o .dxf');
      }

      setLoadingProgress(90);
      setLoadingStage(`Procesando ${parsed.entities.length} entidades en ${Object.keys(parsed.layers).length} capas...`);
      await new Promise((r) => setTimeout(r, 150));

      setLoadingProgress(100);
      setLoadingStage('¡Plano listo para visualización!');
      await new Promise((r) => setTimeout(r, 250));

      setDrawing(parsed);
      setIsLoading(false);
      setStatusMessage(`Plano '${file.name}' cargado con éxito.`);
    } catch (err: any) {
      console.error('Error cargando CAD:', err);
      setIsLoading(false);
      alert(`Error al procesar el archivo: ${err?.message || 'Formato no soportado o archivo dañado.'}`);
    }
  };

  // Manejador de archivo seleccionado por input
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFileWithProgress(file);
    }
  };

  // Manejador de Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFileWithProgress(file);
    }
  };

  // Manejo de Interacción del Ratón
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (measureMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pt = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);

      if (measurePoints.length === 0 || measurePoints.length >= 2) {
        setMeasurePoints([pt]);
        setStatusMessage('Punto 1 seleccionado. Haz clic en el segundo punto.');
      } else {
        setMeasurePoints([measurePoints[0], pt]);
        const dx = pt.x - measurePoints[0].x;
        const dy = pt.y - measurePoints[0].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        setStatusMessage(`Distancia: ${dist.toFixed(3)} m (ΔX: ${dx.toFixed(2)}, ΔY: ${dy.toFixed(2)})`);
      }
      return;
    }

    setIsPanning(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const worldPt = screenToWorld(sx, sy);
    setActiveCursorPos(worldPt);

    if (isPanning) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const newScale = Math.max(Math.min(scale * zoomFactor, 80), 0.05);

    setOffset({
      x: cursorX - (cursorX - offset.x) * (newScale / scale),
      y: cursorY - (cursorY - offset.y) * (newScale / scale),
    });
    setScale(newScale);
  };

  const zoomIn = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;
    const newScale = scale * 1.25;
    setOffset({
      x: centerX - (centerX - offset.x) * 1.25,
      y: centerY - (centerY - offset.y) * 1.25,
    });
    setScale(newScale);
  };

  const zoomOut = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;
    const newScale = scale * 0.8;
    setOffset({
      x: centerX - (centerX - offset.x) * 0.8,
      y: centerY - (centerY - offset.y) * 0.8,
    });
    setScale(newScale);
  };

  const toggleLayer = (layerName: string) => {
    setLayersState((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  const toggleAllLayers = (visible: boolean) => {
    if (!drawing) return;
    const updated: Record<string, boolean> = {};
    Object.keys(drawing.layers).forEach((k) => {
      updated[k] = visible;
    });
    setLayersState(updated);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div
      ref={containerRef}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className="flex flex-col h-screen w-screen bg-slate-900 text-slate-100 select-none overflow-hidden relative font-sans"
    >
      {/* 1. BARRA SUPERIOR DE HERRAMIENTAS Y ARCHIVO */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Launcher Hub</span>
          </button>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <span className="text-xl">📐</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-wide">
                  {drawing ? drawing.filename : 'Visor de Planos DWG / CAD'}
                </span>
                {drawing && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    {drawing.version || drawing.fileFormat}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="flex items-center gap-2">
          {/* Input oculto para abrir archivo */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".dwg,.dxf"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{drawing ? 'Abrir otro plano' : 'Abrir DWG / DXF'}</span>
          </button>

          {drawing && (
            <>
              <button
                onClick={() => setIsDarkCanvas(!isDarkCanvas)}
                title={isDarkCanvas ? 'Fondo Espacio Papel (Claro)' : 'Fondo Espacio Modelo (Oscuro)'}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {isDarkCanvas ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
              </button>

              <button
                onClick={toggleFullscreen}
                title="Pantalla Completa"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </header>

      {/* 2. ÁREA PRINCIPAL */}
      {drawing ? (
        /* VISTA DEL PLANO CARGADO CON CANVAS */
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className="w-full h-full cursor-crosshair block"
          />

          {/* BARRA DE HERRAMIENTAS FLOTANTE CAD */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl">
            <button
              onClick={zoomIn}
              title="Acercar (Zoom In)"
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              title="Alejar (Zoom Out)"
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => fitToScreen(drawing)}
              title="Ajustar a Pantalla (Zoom Extents)"
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="h-px bg-slate-800 my-1" />

            {/* Medición */}
            <button
              onClick={() => {
                setMeasureMode(!measureMode);
                setMeasurePoints([]);
                setStatusMessage(!measureMode ? 'Modo Regla activo: haz clic en dos puntos para medir distancia' : 'Modo navegación');
              }}
              title="Medir Distancia"
              className={`p-2 rounded-xl transition ${
                measureMode ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Ruler className="w-4 h-4" />
            </button>

            {/* Capas Toggle */}
            <button
              onClick={() => setLayersPanelOpen(!layersPanelOpen)}
              title="Mostrar / Ocultar Capas"
              className={`p-2 rounded-xl transition ${
                layersPanelOpen ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* PANEL LATERAL DE CAPAS */}
          {layersPanelOpen && (
            <aside className="absolute top-4 right-4 z-10 w-72 max-h-[calc(100%-80px)] bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Capas del Plano</h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {Object.keys(drawing.layers).length} capas
                </span>
              </div>

              <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-[11px]">
                <button onClick={() => toggleAllLayers(true)} className="text-blue-400 hover:underline font-semibold">
                  Mostrar todas
                </button>
                <button onClick={() => toggleAllLayers(false)} className="text-slate-400 hover:underline font-semibold">
                  Ocultar todas
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {Object.keys(drawing.layers).map((layerName) => {
                  const layer = drawing.layers[layerName];
                  const isVisible = layersState[layerName] !== false;

                  return (
                    <div
                      key={layerName}
                      onClick={() => toggleLayer(layerName)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition ${
                        isVisible ? 'bg-slate-800/60 text-slate-200 hover:bg-slate-800' : 'bg-slate-950/40 text-slate-500 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="truncate font-mono">{layerName}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-500">{layer.entityCount} ent.</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLayer(layerName);
                          }}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          {isVisible ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          )}

          {/* ESTADO EN VIVO */}
          {statusMessage && (
            <div className="absolute bottom-10 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      ) : (
        /* VISTA DE ESPERA / ZONA DE CARGA (CUANDO NO HAY PLANO CARGADO) */
        <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full text-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`w-full max-w-2xl p-10 sm:p-14 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center ${
              isDragOver
                ? 'border-emerald-500 bg-emerald-950/20 scale-[1.02]'
                : 'border-slate-800 hover:border-slate-600 bg-slate-950/60 hover:bg-slate-950'
            }`}
          >
            <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-4xl mb-6">
              📐
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Abre o arrastra tu plano DWG o DXF aquí
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
              Compatible con planos de <strong>AutoCAD</strong> (R11 hasta <strong>2026</strong>), <strong>Civil 3D</strong> (curvas de nivel, polilíneas 3D, triangulación TIN) y <strong>DXF</strong>.
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm transition shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Seleccionar archivo desde mi equipo</span>
            </button>

            <span className="text-xs text-slate-500 mt-4">
              Formatos soportados: <strong>.dwg</strong> (AutoCAD / Civil 3D 2018-2026), <strong>.dxf</strong>
            </span>
          </div>

          {/* Opción secundaria para cargar un plano de muestra si el usuario desea probar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span>¿Deseas probar con un plano de demostración?</span>
            <button
              onClick={() => {
                setDrawing(getSampleCivil3DDrawing());
                setStatusMessage('Plano de Topografía Civil 3D cargado');
              }}
              className="text-emerald-400 hover:underline font-semibold"
            >
              ⛰️ Cargar Civil 3D Topo
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setDrawing(getSampleArchitecturalDrawing());
                setStatusMessage('Plano Arquitectónico Residencial cargado');
              }}
              className="text-blue-400 hover:underline font-semibold"
            >
              🏢 Cargar Arquitectónico
            </button>
          </div>

          {/* Consejo profesional para usuarios de Civil 3D */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 max-w-xl text-left text-xs text-slate-400 flex items-start gap-3">
            <span className="text-base shrink-0">💡</span>
            <div>
              <span className="font-semibold text-slate-200">Consejo para planos de Civil 3D 2026:</span>
              <p className="mt-1 text-slate-400 leading-normal">
                Para que las curvas de nivel y superficies TIN de Civil 3D se dibujen con máxima nitidez vectorial en la web, asegúrate de tener la variable <code className="text-emerald-400 font-mono bg-emerald-950/50 px-1 py-0.5 rounded">PROXYGRAPHICS = 1</code> al guardar, o utiliza el comando <code className="text-emerald-400 font-mono bg-emerald-950/50 px-1 py-0.5 rounded">EXPORTTOAUTOCAD</code>.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* 3. BARRA INFERIOR DE ESTADO CAD */}
      <footer className="h-8 bg-slate-950 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-300">
            <Crosshair className="w-3.5 h-3.5 text-slate-500" />
            <span>X: {activeCursorPos.x.toFixed(3)}</span>
            <span className="ml-2">Y: {activeCursorPos.y.toFixed(3)}</span>
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">Zoom: {(scale * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{drawing ? `${drawing.entities.length} entidades` : 'Sin archivo abierto'}</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">AutoCAD & Civil 3D 2026 Engine</span>
        </div>
      </footer>

      {/* MODAL DE PROGRESO Y BARRA DE CARGA */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl mb-4 animate-bounce">
              ⚙️
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Cargando Plano CAD</h3>
            <p className="text-xs text-slate-400 mb-6 min-h-[36px]">{loadingStage}</p>

            {/* Barra de progreso visual */}
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700 mb-2">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-200"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <span className="text-xs font-mono text-emerald-400 font-bold">{loadingProgress}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
