import React, { useState, useMemo } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  DollarSign,
  ShoppingBag,
  Store,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
} from 'lucide-react';
import {
  PantryItem,
  GroceryReceipt,
  ProductPriceHistory,
} from '../../../../packages/shared/src/types';

interface PriceEvolutionModalProps {
  productTrend: ProductPriceHistory;
  pantryItems: PantryItem[];
  receipts: GroceryReceipt[];
  onClose: () => void;
}

interface PurchasePoint {
  id: string;
  date: string;
  price: number;
  quantity: number;
  unit: string;
  totalPrice: number;
  store: string;
  status: string;
  receiptId?: string | null;
}

export const PriceEvolutionModal: React.FC<PriceEvolutionModalProps> = ({
  productTrend,
  pantryItems,
  receipts,
  onClose,
}) => {
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // 1. Recopilar y organizar cronológicamente todas las compras de este producto
  const purchases: PurchasePoint[] = useMemo(() => {
    const targetName = productTrend.product_name.toLowerCase().trim();

    // Buscar en pantryItems
    const matched = pantryItems.filter(
      (item) => item.name.toLowerCase().trim() === targetName
    );

    if (matched.length > 0) {
      // Ordenar ascendentemente por fecha para la gráfica
      const sorted = [...matched].sort(
        (a, b) => new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime()
      );

      return sorted.map((item) => {
        const rc = receipts.find((r) => r.id === item.receipt_id);
        const storeName = rc?.store_name || item.category || 'Mercado';
        const unitPrice = Number(item.unit_price) || 0;
        const qty = Number(item.quantity) || 1;
        const total = Number(item.total_price) || unitPrice * qty;

        return {
          id: item.id,
          date: item.purchase_date,
          price: unitPrice,
          quantity: qty,
          unit: item.unit || 'un',
          totalPrice: total,
          store: storeName,
          status: item.status || 'disponible',
          receiptId: item.receipt_id,
        };
      });
    }

    // Fallback: usar productTrend.history si no hay items directos
    return productTrend.history.map((h, idx) => ({
      id: `hist_${idx}`,
      date: h.date,
      price: h.price,
      quantity: 1,
      unit: 'un',
      totalPrice: h.price,
      store: h.store || 'Supermercado',
      status: 'disponible',
    }));
  }, [productTrend, pantryItems, receipts]);

  // 2. Métricas y estadísticas de evolución
  const prices = useMemo(() => purchases.map((p) => p.price), [purchases]);
  const currentPrice = prices.length > 0 ? prices[prices.length - 1] : productTrend.current_price;
  const initialPrice = prices.length > 0 ? prices[0] : currentPrice;
  const minPrice = prices.length > 0 ? Math.min(...prices) : currentPrice;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : currentPrice;
  const avgPrice =
    prices.length > 0
      ? Math.round(prices.reduce((acc, p) => acc + p, 0) / prices.length)
      : currentPrice;

  const priceDiff = currentPrice - initialPrice;
  const priceDiffPct =
    initialPrice > 0 ? Number(((priceDiff / initialPrice) * 100).toFixed(1)) : 0;

  const isUp = priceDiffPct > 0.5;
  const isDown = priceDiffPct < -0.5;
  const isSinglePurchase = purchases.length <= 1;

  // 3. Configuración para renderizado de la Gráfica Lineal SVG
  const chartWidth = 620;
  const chartHeight = 220;
  const padLeft = 70;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 40;

  const plotWidth = chartWidth - padLeft - padRight;
  const plotHeight = chartHeight - padTop - padBottom;

  // Rango Y con margen del 15% arriba y abajo
  let plotMinY = minPrice;
  let plotMaxY = maxPrice;
  if (plotMinY === plotMaxY) {
    plotMinY = Math.max(0, Math.floor(plotMinY * 0.85));
    plotMaxY = Math.ceil(plotMaxY * 1.15) || 1000;
  } else {
    const range = plotMaxY - plotMinY;
    plotMinY = Math.max(0, Math.floor(plotMinY - range * 0.15));
    plotMaxY = Math.ceil(plotMaxY + range * 0.15);
  }

  // Coordenadas calculadas de cada punto en la gráfica
  const points = useMemo(() => {
    const n = purchases.length;
    return purchases.map((p, i) => {
      const x = n === 1 ? padLeft + plotWidth / 2 : padLeft + (i / (n - 1)) * plotWidth;
      const yFraction =
        plotMaxY > plotMinY ? (p.price - plotMinY) / (plotMaxY - plotMinY) : 0.5;
      const y = padTop + plotHeight - yFraction * plotHeight;
      return { ...p, x, y, index: i };
    });
  }, [purchases, plotWidth, plotHeight, padLeft, padTop, plotMinY, plotMaxY]);

  // Generar el path SVG de la línea y el área
  const linePathD = useMemo(() => {
    if (points.length === 0) return '';
    if (points.length === 1) {
      // Línea horizontal de referencia
      const y = points[0].y;
      return `M ${padLeft} ${y} L ${padLeft + plotWidth} ${y}`;
    }
    return points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }, [points, padLeft, plotWidth]);

  const areaPathD = useMemo(() => {
    if (points.length === 0) return '';
    const baseY = padTop + plotHeight;
    if (points.length === 1) {
      const y = points[0].y;
      return `M ${padLeft} ${baseY} L ${padLeft} ${y} L ${padLeft + plotWidth} ${y} L ${padLeft + plotWidth} ${baseY} Z`;
    }
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${linePathD} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  }, [points, linePathD, padLeft, plotWidth, padTop, plotHeight]);

  // Niveles para las líneas de la cuadrícula
  const gridLevels = [0, 0.33, 0.66, 1].map((fraction) => {
    const val = Math.round(plotMinY + fraction * (plotMaxY - plotMinY));
    const y = padTop + plotHeight - fraction * plotHeight;
    return { val, y };
  });

  const activeHoveredPoint =
    hoveredPointIndex !== null && points[hoveredPointIndex]
      ? points[hoveredPointIndex]
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl max-h-[92vh] overflow-y-auto space-y-6 animate-in zoom-in-95 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {productTrend.category}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {purchases.length} {purchases.length === 1 ? 'compra registrada' : 'compras registradas'}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{productTrend.product_name}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historial de compras, evolución del precio y gráfica cronológica de valor vs fechas.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tarjetas KPI de Evolución de Precios */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Precio Actual
            </span>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              ${currentPrice.toLocaleString()}
            </p>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span>Última compra</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Precio Promedio
            </span>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              ${avgPrice.toLocaleString()}
            </p>
            <span className="text-[11px] text-slate-500">En {purchases.length} registros</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Mínimo / Máximo
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              <span className="text-emerald-600 dark:text-emerald-400">${minPrice.toLocaleString()}</span>
              <span className="text-slate-400 mx-1">/</span>
              <span className="text-rose-500">${maxPrice.toLocaleString()}</span>
            </p>
            <span className="text-[11px] text-slate-500">Rango de mercado</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Variación Histórica
            </span>
            {isSinglePurchase ? (
              <div>
                <p className="text-xs font-bold text-slate-500">Precio Inicial</p>
                <span className="text-[10px] text-slate-400">Sin historial previo</span>
              </div>
            ) : (
              <div>
                <div
                  className={`flex items-center gap-1 text-base font-black ${
                    isUp
                      ? 'text-rose-600 dark:text-rose-400'
                      : isDown
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isUp ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : isDown ? (
                    <ArrowDownRight className="w-4 h-4" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                  <span>
                    {isUp ? '+' : ''}
                    {priceDiffPct}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {isUp ? 'Inflación acumulada' : isDown ? 'Ahorro acumulado' : 'Precio constante'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sección: Gráfica Lineal de Precio vs Fechas */}
        <div className="p-5 bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Gráfica Lineal: Precio vs Fechas
              </h4>
            </div>
            {activeHoveredPoint ? (
              <div className="text-xs px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30 animate-in fade-in">
                {activeHoveredPoint.date}: ${activeHoveredPoint.price.toLocaleString()} ({activeHoveredPoint.store})
              </div>
            ) : (
              <span className="text-[11px] text-slate-400">
                Pasa el cursor sobre los puntos para ver el detalle de cada compra
              </span>
            )}
          </div>

          {/* Contenedor SVG de la Gráfica */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto min-w-[500px] select-none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isUp ? '#f43f5e' : '#10b981'}
                    stopOpacity="0.25"
                  />
                  <stop
                    offset="100%"
                    stopColor={isUp ? '#f43f5e' : '#10b981'}
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Líneas horizontales de cuadrícula y etiquetas de precios Y */}
              {gridLevels.map((lvl, idx) => (
                <g key={idx}>
                  <line
                    x1={padLeft}
                    y1={lvl.y}
                    x2={padLeft + plotWidth}
                    y2={lvl.y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="1"
                    strokeDasharray={idx === 0 || idx === gridLevels.length - 1 ? 'none' : '3 3'}
                  />
                  <text
                    x={padLeft - 8}
                    y={lvl.y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono font-medium"
                  >
                    ${lvl.val.toLocaleString()}
                  </text>
                </g>
              ))}

              {/* Área sombreada bajo la curva */}
              <path d={areaPathD} fill="url(#chartGradient)" />

              {/* Línea principal del gráfico */}
              <path
                d={linePathD}
                fill="none"
                stroke={isUp ? '#f43f5e' : '#10b981'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Línea guía vertical si hay hover */}
              {activeHoveredPoint && (
                <line
                  x1={activeHoveredPoint.x}
                  y1={padTop}
                  x2={activeHoveredPoint.x}
                  y2={padTop + plotHeight}
                  stroke={isUp ? '#f43f5e' : '#10b981'}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              )}

              {/* Puntos y etiquetas interactivas */}
              {points.map((pt, i) => {
                const isHovered = hoveredPointIndex === i;
                const strokeColor = isUp ? '#f43f5e' : '#10b981';

                return (
                  <g
                    key={pt.id || i}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPointIndex(i)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  >
                    {/* Zona ampliada de captura de hover */}
                    <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                    {/* Halo de punto */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? '9' : '6'}
                      fill={strokeColor}
                      fillOpacity={isHovered ? '0.35' : '0.15'}
                      className="transition-all duration-150"
                    />

                    {/* Punto central */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? '5.5' : '4'}
                      fill={strokeColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />

                    {/* Etiqueta de fecha en el eje X */}
                    <text
                      x={pt.x}
                      y={padTop + plotHeight + 18}
                      textAnchor="middle"
                      className={`text-[9.5px] font-mono transition-colors ${
                        isHovered
                          ? 'fill-slate-900 dark:fill-white font-bold'
                          : 'fill-slate-400'
                      }`}
                    >
                      {pt.date}
                    </text>

                    {/* Badge de valor flotante si está seleccionado o si hay pocos puntos */}
                    {(isHovered || points.length <= 4) && (
                      <g transform={`translate(${pt.x}, ${pt.y - 14})`}>
                        <rect
                          x="-28"
                          y="-14"
                          width="56"
                          height="16"
                          rx="8"
                          className={`${
                            isHovered
                              ? 'fill-slate-900 dark:fill-slate-100 text-white dark:text-slate-900'
                              : 'fill-slate-800/80 dark:fill-slate-700/80 text-white'
                          }`}
                        />
                        <text
                          x="0"
                          y="-3"
                          textAnchor="middle"
                          className="text-[9px] font-bold fill-white dark:fill-slate-900"
                        >
                          ${pt.price.toLocaleString()}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Nota informativa en caso de 1 sola compra */}
          {isSinglePurchase && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 rounded-2xl text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
              <span>
                Este producto tiene actualmente <strong>1 compra registrada</strong> en la fecha{' '}
                <strong>{purchases[0]?.date}</strong> a <strong>${purchases[0]?.price.toLocaleString()}</strong>.
                A medida que escanees o registres más facturas donde se incluya este producto en futuras fechas, la gráfica trazará automáticamente la curva y la tasa de inflación o ahorro.
              </span>
            </div>
          )}
        </div>

        {/* Sección: Tabla con Historial Detallado de Compras */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Historial Detallado de Adquisiciones</span>
            </h4>
            <span className="text-xs text-slate-400">
              Orden cronológico inverso (recientes primero)
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Supermercado / Tienda</th>
                  <th className="py-2.5 px-3 text-right">Precio Unitario</th>
                  <th className="py-2.5 px-3 text-center">Cantidad</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                  <th className="py-2.5 px-3 text-center">Variación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {[...purchases]
                  .reverse()
                  .map((p, idx, arr) => {
                    // Comparar con la compra cronológicamente anterior (que es la siguiente en el arreglo invertido)
                    const prevPurchase = arr[idx + 1];
                    let diffBadge = <span className="text-slate-400 text-[10px]">Base inicial</span>;

                    if (prevPurchase && prevPurchase.price > 0) {
                      const diff = p.price - prevPurchase.price;
                      const pct = Number(((diff / prevPurchase.price) * 100).toFixed(1));
                      if (pct > 0) {
                        diffBadge = (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded-full">
                            <TrendingUp className="w-3 h-3" />
                            +{pct}%
                          </span>
                        );
                      } else if (pct < 0) {
                        diffBadge = (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full">
                            <TrendingDown className="w-3 h-3" />
                            {pct}%
                          </span>
                        );
                      } else {
                        diffBadge = (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                            Sin cambio
                          </span>
                        );
                      }
                    }

                    return (
                      <tr
                        key={p.id || idx}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition"
                      >
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{p.date}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                          <span className="font-medium">{p.store}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-slate-900 dark:text-white">
                          ${p.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-500">
                          {p.quantity} {p.unit}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-700 dark:text-slate-300">
                          ${p.totalPrice.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">{diffBadge}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón de cierre inferior */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition shadow-sm"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
