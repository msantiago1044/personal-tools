// CAD Parser & Vector Model Builder for DWG & DXF Drawings
import DxfParser from 'dxf-parser';
import { CadDrawing, CadEntity, CadLayer, CadPoint } from '../../../packages/shared/src/types';

/**
 * Genera el plano de demostración: "Plano Topográfico Civil 3D"
 */
export function getSampleCivil3DDrawing(): CadDrawing {
  const layers: Record<string, CadLayer> = {
    'V-CURV-MAESTRAS': { name: 'V-CURV-MAESTRAS', color: '#f59e0b', visible: true, entityCount: 18 },
    'V-CURV-SECUNDARIAS': { name: 'V-CURV-SECUNDARIAS', color: '#fbbf24', visible: true, entityCount: 36 },
    'C-ROAD-EJE': { name: 'C-ROAD-EJE', color: '#ef4444', visible: true, entityCount: 4 },
    'C-ROAD-BORDES': { name: 'C-ROAD-BORDES', color: '#f87171', visible: true, entityCount: 6 },
    'V-PUNTOS-COTA': { name: 'V-PUNTOS-COTA', color: '#38bdf8', visible: true, entityCount: 16 },
    'G-PARCELAS-LIMITES': { name: 'G-PARCELAS-LIMITES', color: '#10b981', visible: true, entityCount: 12 },
    'G-CUADRICULA-COORD': { name: 'G-CUADRICULA-COORD', color: '#475569', visible: true, entityCount: 20 },
  };

  const entities: CadEntity[] = [];

  // Cuadrícula UTM de fondo
  for (let x = -500; x <= 500; x += 100) {
    entities.push({
      type: 'LINE',
      layer: 'G-CUADRICULA-COORD',
      start: { x, y: -400 },
      end: { x, y: 400 },
    });
    entities.push({
      type: 'TEXT',
      layer: 'G-CUADRICULA-COORD',
      start: { x: x + 2, y: -390 },
      text: `E ${500000 + x}`,
      height: 7,
    });
  }
  for (let y = -400; y <= 400; y += 100) {
    entities.push({
      type: 'LINE',
      layer: 'G-CUADRICULA-COORD',
      start: { x: -500, y },
      end: { x: 500, y },
    });
    entities.push({
      type: 'TEXT',
      layer: 'G-CUADRICULA-COORD',
      start: { x: -490, y: y + 2 },
      text: `N ${1100000 + y}`,
      height: 7,
    });
  }

  // Curvas de nivel maestras y secundarias (Topografía Civil 3D)
  for (let i = 0; i < 15; i++) {
    const isMaster = i % 3 === 0;
    const layer = isMaster ? 'V-CURV-MAESTRAS' : 'V-CURV-SECUNDARIAS';
    const cota = 2500 + i * 5;
    const radiusX = 180 + i * 22;
    const radiusY = 120 + i * 18;
    const vertices: CadPoint[] = [];

    for (let angle = 0; angle <= Math.PI * 2; angle += 0.15) {
      const wobble = Math.sin(angle * 3 + i * 0.4) * 20 + Math.cos(angle * 5) * 8;
      const x = Math.cos(angle) * (radiusX + wobble) - 20;
      const y = Math.sin(angle) * (radiusY + wobble) + 10;
      vertices.push({ x, y, z: cota });
    }

    entities.push({
      type: 'LWPOLYLINE',
      layer,
      vertices,
      closed: true,
    });

    if (isMaster) {
      entities.push({
        type: 'TEXT',
        layer: 'V-CURV-MAESTRAS',
        start: { x: vertices[0].x, y: vertices[0].y },
        text: `+${cota}.00 m`,
        height: 8,
      });
    }
  }

  // Eje de Carretera / Vía Civil 3D
  const roadCenter: CadPoint[] = [
    { x: -480, y: -300 },
    { x: -280, y: -180 },
    { x: -100, y: -50 },
    { x: 80, y: 30 },
    { x: 260, y: 180 },
    { x: 450, y: 350 },
  ];
  entities.push({
    type: 'LWPOLYLINE',
    layer: 'C-ROAD-EJE',
    vertices: roadCenter,
  });

  // Bordes de calzada (desfase de 20m a cada lado)
  const roadLeft: CadPoint[] = roadCenter.map(p => ({ x: p.x - 14, y: p.y + 14 }));
  const roadRight: CadPoint[] = roadCenter.map(p => ({ x: p.x + 14, y: p.y - 14 }));
  entities.push({
    type: 'LWPOLYLINE',
    layer: 'C-ROAD-BORDES',
    vertices: roadLeft,
  });
  entities.push({
    type: 'LWPOLYLINE',
    layer: 'C-ROAD-BORDES',
    vertices: roadRight,
  });

  // Puntos topográficos con cota (estaciones)
  for (let k = 0; k < roadCenter.length; k++) {
    const pt = roadCenter[k];
    entities.push({
      type: 'CIRCLE',
      layer: 'V-PUNTOS-COTA',
      center: pt,
      radius: 4,
    });
    entities.push({
      type: 'TEXT',
      layer: 'V-PUNTOS-COTA',
      start: { x: pt.x + 8, y: pt.y + 4 },
      text: `PK 0+${k * 200} (Z: 25${k * 6}.40)`,
      height: 7,
    });
  }

  // Polígonos de parcelas catastrales
  const lot1: CadPoint[] = [
    { x: -350, y: 50 },
    { x: -200, y: 60 },
    { x: -180, y: 190 },
    { x: -320, y: 180 },
  ];
  const lot2: CadPoint[] = [
    { x: -180, y: 60 },
    { x: -30, y: 70 },
    { x: -20, y: 210 },
    { x: -160, y: 200 },
  ];
  entities.push({ type: 'LWPOLYLINE', layer: 'G-PARCELAS-LIMITES', vertices: lot1, closed: true });
  entities.push({ type: 'TEXT', layer: 'G-PARCELAS-LIMITES', start: { x: -280, y: 120 }, text: 'LOTE 01 - A: 2,450 m²', height: 8 });
  entities.push({ type: 'LWPOLYLINE', layer: 'G-PARCELAS-LIMITES', vertices: lot2, closed: true });
  entities.push({ type: 'TEXT', layer: 'G-PARCELAS-LIMITES', start: { x: -120, y: 130 }, text: 'LOTE 02 - A: 2,120 m²', height: 8 });

  return {
    filename: 'CIVIL3D_TOPOGRAFIA_TERRENO.dwg',
    fileFormat: 'DWG',
    version: 'AutoCAD Civil 3D 2024 (AC1032)',
    layers,
    entities,
    bounds: { minX: -550, minY: -450, maxX: 550, maxY: 450 },
  };
}

/**
 * Genera el plano de demostración: "Plano Arquitectónico Residencial"
 */
export function getSampleArchitecturalDrawing(): CadDrawing {
  const layers: Record<string, CadLayer> = {
    'A-WALL-MUROS': { name: 'A-WALL-MUROS', color: '#38bdf8', visible: true, entityCount: 24 },
    'A-DOOR-PUERTAS': { name: 'A-DOOR-PUERTAS', color: '#34d399', visible: true, entityCount: 8 },
    'A-GLAZ-VENTANAS': { name: 'A-GLAZ-VENTANAS', color: '#60a5fa', visible: true, entityCount: 10 },
    'A-DIMS-COTAS': { name: 'A-DIMS-COTAS', color: '#f43f5e', visible: true, entityCount: 16 },
    'A-GRID-EJES': { name: 'A-GRID-EJES', color: '#a855f7', visible: true, entityCount: 12 },
    'A-TEXT-NOTAS': { name: 'A-TEXT-NOTAS', color: '#fbbf24', visible: true, entityCount: 9 },
  };

  const entities: CadEntity[] = [];

  // Muros perimetrales (12m x 9m)
  const outerWall: CadPoint[] = [
    { x: -300, y: -200 },
    { x: 300, y: -200 },
    { x: 300, y: 200 },
    { x: -300, y: 200 },
  ];
  entities.push({ type: 'LWPOLYLINE', layer: 'A-WALL-MUROS', vertices: outerWall, closed: true });

  // Muros interiores
  entities.push({ type: 'LINE', layer: 'A-WALL-MUROS', start: { x: -300, y: 20 }, end: { x: 50, y: 20 } });
  entities.push({ type: 'LINE', layer: 'A-WALL-MUROS', start: { x: 50, y: -200 }, end: { x: 50, y: 200 } });
  entities.push({ type: 'LINE', layer: 'A-WALL-MUROS', start: { x: 50, y: -50 }, end: { x: 300, y: -50 } });

  // Puertas con arco abatible
  const doors = [
    { x: -50, y: 20, r: 35, startA: 0, endA: Math.PI / 2 },
    { x: 50, y: 80, r: 35, startA: Math.PI / 2, endA: Math.PI },
    { x: 120, y: -50, r: 35, startA: 0, endA: Math.PI / 2 },
  ];
  for (const d of doors) {
    entities.push({ type: 'LINE', layer: 'A-DOOR-PUERTAS', start: { x: d.x, y: d.y }, end: { x: d.x + d.r, y: d.y } });
    entities.push({ type: 'ARC', layer: 'A-DOOR-PUERTAS', center: { x: d.x, y: d.y }, radius: d.r, startAngle: d.startA, endAngle: d.endA });
  }

  // Ventanas
  entities.push({ type: 'LINE', layer: 'A-GLAZ-VENTANAS', start: { x: -250, y: -200 }, end: { x: -150, y: -200 } });
  entities.push({ type: 'LINE', layer: 'A-GLAZ-VENTANAS', start: { x: 100, y: -200 }, end: { x: 220, y: -200 } });
  entities.push({ type: 'LINE', layer: 'A-GLAZ-VENTANAS', start: { x: -200, y: 200 }, end: { x: -100, y: 200 } });
  entities.push({ type: 'LINE', layer: 'A-GLAZ-VENTANAS', start: { x: 120, y: 200 }, end: { x: 240, y: 200 } });

  // Ejes estructurales (A, B, C / 1, 2, 3)
  const ejesX = [
    { x: -300, label: '1' },
    { x: 50, label: '2' },
    { x: 300, label: '3' },
  ];
  for (const ej of ejesX) {
    entities.push({ type: 'LINE', layer: 'A-GRID-EJES', start: { x: ej.x, y: -250 }, end: { x: ej.x, y: 250 } });
    entities.push({ type: 'CIRCLE', layer: 'A-GRID-EJES', center: { x: ej.x, y: 270 }, radius: 15 });
    entities.push({ type: 'TEXT', layer: 'A-GRID-EJES', start: { x: ej.x - 5, y: 265 }, text: ej.label, height: 12 });
  }

  const ejesY = [
    { y: -200, label: 'A' },
    { y: 20, label: 'B' },
    { y: 200, label: 'C' },
  ];
  for (const ej of ejesY) {
    entities.push({ type: 'LINE', layer: 'A-GRID-EJES', start: { x: -350, y: ej.y }, end: { x: 350, y: ej.y } });
    entities.push({ type: 'CIRCLE', layer: 'A-GRID-EJES', center: { x: -370, y: ej.y }, radius: 15 });
    entities.push({ type: 'TEXT', layer: 'A-GRID-EJES', start: { x: -375, y: ej.y - 5 }, text: ej.label, height: 12 });
  }

  // Textos y etiquetas de ambientes
  entities.push({ type: 'TEXT', layer: 'A-TEXT-NOTAS', start: { x: -180, y: 90 }, text: 'SALA / ESTAR (NPT +0.15)', height: 10 });
  entities.push({ type: 'TEXT', layer: 'A-TEXT-NOTAS', start: { x: -180, y: -100 }, text: 'COMEDOR Y COCINA', height: 10 });
  entities.push({ type: 'TEXT', layer: 'A-TEXT-NOTAS', start: { x: 120, y: 80 }, text: 'DORMITORIO PRINCIPAL', height: 10 });
  entities.push({ type: 'TEXT', layer: 'A-TEXT-NOTAS', start: { x: 120, y: -120 }, text: 'BAÑO / SERVICIOS', height: 10 });

  // Cotas generales
  entities.push({ type: 'LINE', layer: 'A-DIMS-COTAS', start: { x: -300, y: -230 }, end: { x: 300, y: -230 } });
  entities.push({ type: 'TEXT', layer: 'A-DIMS-COTAS', start: { x: -20, y: -245 }, text: '12.00 m', height: 10 });
  entities.push({ type: 'LINE', layer: 'A-DIMS-COTAS', start: { x: 330, y: -200 }, end: { x: 330, y: 200 } });
  entities.push({ type: 'TEXT', layer: 'A-DIMS-COTAS', start: { x: 340, y: -5 }, text: '8.00 m', height: 10 });

  return {
    filename: 'PLANO_ARQUITECTONICO_NIVEL1.dwg',
    fileFormat: 'DWG',
    version: 'AutoCAD 2021 (AC1032)',
    layers,
    entities,
    bounds: { minX: -420, minY: -300, maxX: 400, maxY: 320 },
  };
}

/**
 * Parsea un archivo DXF (en texto) usando dxf-parser
 */
export function parseDxfContent(dxfText: string, filename: string): CadDrawing {
  const parser = new DxfParser();
  let parsed: any;

  try {
    parsed = parser.parseSync(dxfText);
  } catch (err: any) {
    throw new Error(`Error en el formato DXF: ${err?.message || 'Archivo corrupto o no reconocido'}`);
  }

  const layers: Record<string, CadLayer> = {};
  const entities: CadEntity[] = [];

  // Mapear capas
  if (parsed.tables?.layer?.layers) {
    Object.keys(parsed.tables.layer.layers).forEach((lKey) => {
      const lObj = parsed.tables.layer.layers[lKey];
      layers[lObj.name] = {
        name: lObj.name,
        color: lObj.colorNumber ? getAciHexColor(lObj.colorNumber) : '#38bdf8',
        visible: true,
        entityCount: 0,
      };
    });
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const updateBounds = (pt?: CadPoint) => {
    if (!pt) return;
    if (pt.x < minX) minX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y > maxY) maxY = pt.y;
  };

  // Mapear entidades
  if (Array.isArray(parsed.entities)) {
    parsed.entities.forEach((ent: any) => {
      const layerName = ent.layer || '0';
      if (!layers[layerName]) {
        layers[layerName] = {
          name: layerName,
          color: ent.color ? getAciHexColor(ent.color) : '#38bdf8',
          visible: true,
          entityCount: 0,
        };
      }
      layers[layerName].entityCount++;

      const entityColor = ent.color ? getAciHexColor(ent.color) : undefined;

      switch (ent.type) {
        case 'LINE':
          if (ent.vertices && ent.vertices.length >= 2) {
            const start = { x: ent.vertices[0].x, y: ent.vertices[0].y, z: ent.vertices[0].z };
            const end = { x: ent.vertices[1].x, y: ent.vertices[1].y, z: ent.vertices[1].z };
            updateBounds(start);
            updateBounds(end);
            entities.push({
              type: 'LINE',
              layer: layerName,
              color: entityColor,
              start,
              end,
            });
          }
          break;

        case 'LWPOLYLINE':
        case 'POLYLINE':
          if (Array.isArray(ent.vertices)) {
            const vertices: CadPoint[] = ent.vertices.map((v: any) => {
              const pt = { x: v.x, y: v.y, z: v.z };
              updateBounds(pt);
              return pt;
            });
            entities.push({
              type: 'LWPOLYLINE',
              layer: layerName,
              color: entityColor,
              vertices,
              closed: !!ent.shape || !!ent.closed,
            });
          }
          break;

        case 'CIRCLE':
          if (ent.center) {
            const center = { x: ent.center.x, y: ent.center.y, z: ent.center.z };
            const r = ent.radius || 10;
            updateBounds({ x: center.x - r, y: center.y - r });
            updateBounds({ x: center.x + r, y: center.y + r });
            entities.push({
              type: 'CIRCLE',
              layer: layerName,
              color: entityColor,
              center,
              radius: r,
            });
          }
          break;

        case 'ARC':
          if (ent.center) {
            const center = { x: ent.center.x, y: ent.center.y, z: ent.center.z };
            const r = ent.radius || 10;
            updateBounds({ x: center.x - r, y: center.y - r });
            updateBounds({ x: center.x + r, y: center.y + r });
            entities.push({
              type: 'ARC',
              layer: layerName,
              color: entityColor,
              center,
              radius: r,
              startAngle: ent.startAngle,
              endAngle: ent.endAngle,
            });
          }
          break;

        case 'TEXT':
        case 'MTEXT':
          if (ent.startPoint) {
            const start = { x: ent.startPoint.x, y: ent.startPoint.y, z: ent.startPoint.z };
            updateBounds(start);
            entities.push({
              type: 'TEXT',
              layer: layerName,
              color: entityColor,
              start,
              text: ent.text || '',
              height: ent.textHeight || 10,
            });
          }
          break;
      }
    });
  }

  // Si no hay límites válidos, definir rango predeterminado
  if (minX === Infinity || maxX === -Infinity) {
    minX = -100;
    maxX = 100;
    minY = -100;
    maxY = 100;
  }

  return {
    filename,
    fileFormat: 'DXF',
    version: parsed.header?.$ACADVER || 'AutoCAD DXF',
    layers,
    entities,
    bounds: { minX, minY, maxX, maxY },
  };
}

/**
 * Convierte una instancia de DwgDatabase (obtenida mediante LibreDWG WebAssembly)
 * en nuestro modelo de dibujo universal CadDrawing con capas y entidades reales.
 */
function convertDwgDatabaseToCadDrawing(db: any, filename: string, version: string): CadDrawing {
  const layers: Record<string, CadLayer> = {};
  const entities: CadEntity[] = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const updateBounds = (pt: { x: number; y: number }) => {
    if (typeof pt.x !== 'number' || typeof pt.y !== 'number' || isNaN(pt.x) || isNaN(pt.y)) return;
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  };

  // 1. Extraer capas desde la tabla de capas db.tables.LAYER
  const layerEntries = db.tables?.LAYER?.entries || [];
  layerEntries.forEach((l: any) => {
    const layerName = l.name || '0';
    const color = getAciHexColor(l.colorIndex || 7);
    layers[layerName] = {
      name: layerName,
      color,
      visible: !l.off && !l.frozen,
      entityCount: 0,
    };
  });

  // Asegurar existencia de la capa '0' estándar
  if (!layers['0']) {
    layers['0'] = { name: '0', color: '#ffffff', visible: true, entityCount: 0 };
  }

  // Mapa de bloques para resolver inserciones (INSERT)
  const blockMap = new Map<string, any>();
  const blockEntries = db.tables?.BLOCK_RECORD?.entries || [];
  blockEntries.forEach((b: any) => {
    if (b.name) {
      blockMap.set(b.name.toUpperCase(), b);
    }
  });

  // 2. Recolectar entidades de espacio modelo (db.entities y bloque *MODEL_SPACE)
  const rawEntities: any[] = [...(db.entities || [])];
  const modelSpaceBlock = blockEntries.find(
    (b: any) => b.name && b.name.toUpperCase() === '*MODEL_SPACE'
  );
  if (modelSpaceBlock && Array.isArray(modelSpaceBlock.entities)) {
    rawEntities.push(...modelSpaceBlock.entities);
  }

  // Función interna para procesar una entidad individual (y llamadas recursivas para bloques)
  const processEntity = (ent: any, transformOffset?: { x: number; y: number }, transformScale?: number) => {
    if (!ent) return;
    // Omitir entidades que estén marcadas explícitamente en Paper Space
    if (ent.isInPaperSpace) return;

    const layerName = ent.layer || '0';
    if (!layers[layerName]) {
      layers[layerName] = { name: layerName, color: '#38bdf8', visible: true, entityCount: 0 };
    }
    layers[layerName].entityCount = (layers[layerName].entityCount || 0) + 1;

    const entityColor = ent.colorIndex ? getAciHexColor(ent.colorIndex) : layers[layerName].color;

    const offX = transformOffset?.x || 0;
    const offY = transformOffset?.y || 0;
    const scl = transformScale ?? 1;

    switch (ent.type) {
      case 'LINE':
        if (ent.startPoint && ent.endPoint) {
          const start = { x: ent.startPoint.x * scl + offX, y: ent.startPoint.y * scl + offY, z: ent.startPoint.z };
          const end = { x: ent.endPoint.x * scl + offX, y: ent.endPoint.y * scl + offY, z: ent.endPoint.z };
          updateBounds(start);
          updateBounds(end);
          entities.push({
            type: 'LINE',
            layer: layerName,
            color: entityColor,
            start,
            end,
          });
        }
        break;

      case 'LWPOLYLINE':
      case 'POLYLINE_2D':
      case 'POLYLINE':
        if (ent.vertices && Array.isArray(ent.vertices) && ent.vertices.length > 0) {
          const vertices: CadPoint[] = ent.vertices.map((v: any) => {
            const pt = { x: v.x * scl + offX, y: v.y * scl + offY, z: v.z || 0 };
            updateBounds(pt);
            return pt;
          });
          entities.push({
            type: 'LWPOLYLINE',
            layer: layerName,
            color: entityColor,
            vertices,
            closed: !!(ent.flag & 1 || ent.isClosed),
          });
        }
        break;

      case 'CIRCLE':
        if (ent.center && typeof ent.radius === 'number') {
          const r = ent.radius * scl;
          const center = { x: ent.center.x * scl + offX, y: ent.center.y * scl + offY, z: ent.center.z };
          updateBounds({ x: center.x - r, y: center.y - r });
          updateBounds({ x: center.x + r, y: center.y + r });
          entities.push({
            type: 'CIRCLE',
            layer: layerName,
            color: entityColor,
            center,
            radius: r,
          });
        }
        break;

      case 'ARC':
        if (ent.center && typeof ent.radius === 'number') {
          const r = ent.radius * scl;
          const center = { x: ent.center.x * scl + offX, y: ent.center.y * scl + offY, z: ent.center.z };
          updateBounds({ x: center.x - r, y: center.y - r });
          updateBounds({ x: center.x + r, y: center.y + r });
          entities.push({
            type: 'ARC',
            layer: layerName,
            color: entityColor,
            center,
            radius: r,
            startAngle: ent.startAngle,
            endAngle: ent.endAngle,
          });
        }
        break;

      case 'ELLIPSE':
        if (ent.center) {
          const center = { x: ent.center.x * scl + offX, y: ent.center.y * scl + offY, z: ent.center.z };
          const r = (ent.majorAxisEndPoint ? Math.hypot(ent.majorAxisEndPoint.x, ent.majorAxisEndPoint.y) : 10) * scl;
          updateBounds({ x: center.x - r, y: center.y - r });
          updateBounds({ x: center.x + r, y: center.y + r });
          entities.push({
            type: 'CIRCLE',
            layer: layerName,
            color: entityColor,
            center,
            radius: r,
          });
        }
        break;

      case 'TEXT':
      case 'MTEXT': {
        const pt = ent.insertionPoint || ent.startPoint || ent.point;
        if (pt) {
          const start = { x: pt.x * scl + offX, y: pt.y * scl + offY, z: pt.z };
          updateBounds(start);
          entities.push({
            type: 'TEXT',
            layer: layerName,
            color: entityColor,
            start,
            text: ent.text || ent.string || '',
            height: (ent.height || ent.textHeight || 4) * scl,
          });
        }
        break;
      }

      case 'SPLINE':
        if (ent.controlPoints && Array.isArray(ent.controlPoints) && ent.controlPoints.length > 0) {
          const vertices = ent.controlPoints.map((p: any) => {
            const pt = { x: p.x * scl + offX, y: p.y * scl + offY, z: p.z || 0 };
            updateBounds(pt);
            return pt;
          });
          entities.push({
            type: 'LWPOLYLINE',
            layer: layerName,
            color: entityColor,
            vertices,
            closed: !!ent.isClosed,
          });
        }
        break;

      case 'INSERT':
        // Bloque insertado (ej. símbolos, muebles, estaciones)
        if (ent.name) {
          const referencedBlock = blockMap.get(ent.name.toUpperCase());
          if (referencedBlock && Array.isArray(referencedBlock.entities)) {
            const insPt = ent.insertionPoint || { x: 0, y: 0 };
            const insScale = typeof ent.scale === 'number' ? ent.scale : (ent.scale?.x || 1);
            referencedBlock.entities.forEach((bEnt: any) => {
              processEntity(bEnt, { x: offX + insPt.x * scl, y: offY + insPt.y * scl }, scl * insScale);
            });
          }
        }
        break;
    }
  };

  rawEntities.forEach((ent) => processEntity(ent));

  // Si no se encontraron entidades ni límites válidos, definir rango predeterminado
  if (minX === Infinity || maxX === -Infinity) {
    minX = -100;
    maxX = 100;
    minY = -100;
    maxY = 100;
  }

  return {
    filename,
    fileFormat: 'DWG',
    version,
    layers,
    entities,
    bounds: { minX, minY, maxX, maxY },
  };
}

/**
 * Parsea un archivo DWG binario con LibreDwg o extrae las entidades reales del dibujo
 */
export async function parseDwgBinary(buffer: ArrayBuffer, filename: string): Promise<CadDrawing> {
  // Detección de versión desde la cabecera mágica de AutoCAD (primeros 6 bytes)
  const headerBytes = new Uint8Array(buffer.slice(0, 6));
  const magic = String.fromCharCode(...headerBytes);
  const versionMap: Record<string, string> = {
    'AC1009': 'AutoCAD R11 / R12 (AC1009)',
    'AC1012': 'AutoCAD R13 (AC1012)',
    'AC1014': 'AutoCAD R14 (AC1014)',
    'AC1015': 'AutoCAD 2000 / 2000i / 2002 (AC1015)',
    'AC1018': 'AutoCAD 2004 / 2005 / 2006 (AC1018)',
    'AC1021': 'AutoCAD 2007 / 2008 / 2009 (AC1021)',
    'AC1024': 'AutoCAD 2010 / 2011 / 2012 (AC1024)',
    'AC1027': 'AutoCAD 2013 / 2014 / 2015 / 2016 / 2017 (AC1027)',
    'AC1032': 'AutoCAD 2018 / 2021 / 2024 / Civil 3D (AC1032)',
  };

  const detectedVersion = versionMap[magic] || `Formato DWG (${magic})`;

  try {
    const libredwgModule: any = await import('@mlightcad/libredwg-web');
    if (libredwgModule?.LibreDwg) {
      // Inicializar LibreDWG apuntando al archivo wasm en /libredwg-web.wasm o relativo
      const libredwg = await libredwgModule.LibreDwg.create('/libredwg-web.wasm').catch(async () => {
        return await libredwgModule.LibreDwg.create();
      });

      // 1. Intentar conversión binaria directa a DXF
      try {
        const dxfBytes = libredwg.dwg_write_dxf(buffer);
        if (dxfBytes && dxfBytes.length > 50) {
          const dxfText = new TextDecoder('utf-8').decode(dxfBytes);
          const parsedDxf = parseDxfContent(dxfText, filename);
          parsedDxf.fileFormat = 'DWG';
          parsedDxf.version = detectedVersion;
          if (parsedDxf.entities.length > 0) {
            return parsedDxf;
          }
        }
      } catch (dxfErr) {
        console.warn('dwg_write_dxf no produjo salida DXF:', dxfErr);
      }

      // 2. Intentar decodificación directa del árbol de base de datos DWG
      // Dwg_File_Type.DWG es 0
      const dataPtr = libredwg.dwg_read_data(buffer, libredwgModule.Dwg_File_Type?.DWG ?? 0);
      if (dataPtr) {
        try {
          const db = libredwg.convert(dataPtr);
          if (db) {
            const cadDrawing = convertDwgDatabaseToCadDrawing(db, filename, detectedVersion);
            if (cadDrawing.entities.length > 0 || Object.keys(cadDrawing.layers).length > 1) {
              return cadDrawing;
            }
          }
        } finally {
          try {
            libredwg.dwg_free(dataPtr);
          } catch {}
        }
      }
    }
  } catch (err) {
    console.warn('LibreDwg WebAssembly falló o no pudo procesar esta versión binaria específica:', err);
  }

  // 3. Si no se pudieron extraer entidades vectoriales directas, NO mostramos el plano demo bajo ninguna circunstancia.
  // En su lugar, construimos un modelo limpio con las capas y un mensaje informativo en el centro del plano.
  const emptyLayers: Record<string, CadLayer> = {
    '0': { name: '0', color: '#ffffff', visible: true, entityCount: 1 },
    'INFO-SISTEMA': { name: 'INFO-SISTEMA', color: '#38bdf8', visible: true, entityCount: 3 },
  };

  const emptyEntities: CadEntity[] = [
    {
      type: 'TEXT',
      layer: 'INFO-SISTEMA',
      color: '#38bdf8',
      start: { x: 0, y: 15 },
      text: `PLANO CARGADO: ${filename}`,
      height: 12,
    },
    {
      type: 'TEXT',
      layer: 'INFO-SISTEMA',
      color: '#94a3b8',
      start: { x: 0, y: 0 },
      text: `Versión detectada: ${detectedVersion}`,
      height: 7,
    },
    {
      type: 'TEXT',
      layer: 'INFO-SISTEMA',
      color: '#cbd5e1',
      start: { x: 0, y: -15 },
      text: 'Este archivo contiene entidades 3D/AEC o bloques propietarios. Para visualización completa de vectores, expórtalo como DXF o DWG 2013-2018.',
      height: 6,
    },
    // Marco perimetral informativo
    {
      type: 'LINE',
      layer: '0',
      color: '#475569',
      start: { x: -220, y: -40 },
      end: { x: 220, y: -40 },
    },
    {
      type: 'LINE',
      layer: '0',
      color: '#475569',
      start: { x: 220, y: -40 },
      end: { x: 220, y: 40 },
    },
    {
      type: 'LINE',
      layer: '0',
      color: '#475569',
      start: { x: 220, y: 40 },
      end: { x: -220, y: 40 },
    },
    {
      type: 'LINE',
      layer: '0',
      color: '#475569',
      start: { x: -220, y: 40 },
      end: { x: -220, y: -40 },
    },
  ];

  return {
    filename,
    fileFormat: 'DWG',
    version: detectedVersion,
    layers: emptyLayers,
    entities: emptyEntities,
    bounds: { minX: -250, minY: -60, maxX: 250, maxY: 60 },
  };
}

/**
 * Paleta de colores ACI (AutoCAD Color Index)
 */
function getAciHexColor(aci: number): string {
  const aciColors: Record<number, string> = {
    1: '#ef4444', // Red
    2: '#eab308', // Yellow
    3: '#22c55e', // Green
    4: '#06b6d4', // Cyan
    5: '#3b82f6', // Blue
    6: '#ec4899', // Magenta
    7: '#ffffff', // White
    8: '#64748b', // Dark Gray
    9: '#cbd5e1', // Light Gray
  };
  return aciColors[aci] || '#38bdf8';
}
