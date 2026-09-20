import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  ScrollView,
  PanResponder,
} from 'react-native';
import Svg, { Line, Polyline, Circle, Text as SvgText, G } from 'react-native-svg';
import { CadDrawing, CadEntity, CadPoint } from '../types';

// Planos de ejemplo optimizados para renderizado vectorial móvil
function getMobileCivil3DDrawing(): CadDrawing {
  return {
    filename: 'CIVIL3D_TOPO_MOVIL.dwg',
    fileFormat: 'DWG',
    version: 'AutoCAD Civil 3D',
    layers: {
      'V-CURV-MAESTRAS': { name: 'V-CURV-MAESTRAS', color: '#F59E0B', visible: true, entityCount: 6 },
      'V-CURV-SECUNDARIAS': { name: 'V-CURV-SECUNDARIAS', color: '#FBBF24', visible: true, entityCount: 12 },
      'C-ROAD-EJE': { name: 'C-ROAD-EJE', color: '#EF4444', visible: true, entityCount: 1 },
      'G-PARCELAS': { name: 'G-PARCELAS', color: '#10B981', visible: true, entityCount: 2 },
    },
    entities: [
      // Curvas de nivel
      {
        type: 'LWPOLYLINE',
        layer: 'V-CURV-MAESTRAS',
        vertices: [
          { x: -140, y: -90 }, { x: -80, y: -40 }, { x: 0, y: -30 }, { x: 80, y: -40 }, { x: 140, y: -80 }
        ],
      },
      {
        type: 'LWPOLYLINE',
        layer: 'V-CURV-SECUNDARIAS',
        vertices: [
          { x: -140, y: -50 }, { x: -70, y: 0 }, { x: 0, y: 10 }, { x: 70, y: 0 }, { x: 140, y: -40 }
        ],
      },
      {
        type: 'LWPOLYLINE',
        layer: 'V-CURV-MAESTRAS',
        vertices: [
          { x: -140, y: 0 }, { x: -60, y: 40 }, { x: 0, y: 50 }, { x: 60, y: 40 }, { x: 140, y: 0 }
        ],
      },
      // Eje de Carretera
      {
        type: 'LWPOLYLINE',
        layer: 'C-ROAD-EJE',
        vertices: [
          { x: -130, y: -110 }, { x: -50, y: -30 }, { x: 30, y: 30 }, { x: 120, y: 110 }
        ],
      },
      // Parcelas
      {
        type: 'LWPOLYLINE',
        layer: 'G-PARCELAS',
        closed: true,
        vertices: [
          { x: -110, y: 20 }, { x: -30, y: 30 }, { x: -20, y: 90 }, { x: -100, y: 80 }
        ],
      },
      {
        type: 'LWPOLYLINE',
        layer: 'G-PARCELAS',
        closed: true,
        vertices: [
          { x: -10, y: 30 }, { x: 70, y: 40 }, { x: 80, y: 100 }, { x: 0, y: 90 }
        ],
      },
    ],
    bounds: { minX: -160, minY: -130, maxX: 160, maxY: 130 },
  };
}

function getMobileArchitecturalDrawing(): CadDrawing {
  return {
    filename: 'PLANO_ARQ_NIVEL1.dwg',
    fileFormat: 'DWG',
    version: 'AutoCAD 2024',
    layers: {
      'A-WALL-MUROS': { name: 'A-WALL-MUROS', color: '#38BDF8', visible: true, entityCount: 5 },
      'A-DOOR-PUERTAS': { name: 'A-DOOR-PUERTAS', color: '#34D399', visible: true, entityCount: 2 },
      'A-DIMS-COTAS': { name: 'A-DIMS-COTAS', color: '#F43F5E', visible: true, entityCount: 2 },
    },
    entities: [
      // Muros perimetrales
      {
        type: 'LWPOLYLINE',
        layer: 'A-WALL-MUROS',
        closed: true,
        vertices: [
          { x: -100, y: -80 }, { x: 100, y: -80 }, { x: 100, y: 80 }, { x: -100, y: 80 }
        ],
      },
      // Muros interiores
      {
        type: 'LINE',
        layer: 'A-WALL-MUROS',
        start: { x: -100, y: 0 },
        end: { x: 20, y: 0 },
      },
      {
        type: 'LINE',
        layer: 'A-WALL-MUROS',
        start: { x: 20, y: -80 },
        end: { x: 20, y: 80 },
      },
      // Puertas
      {
        type: 'LINE',
        layer: 'A-DOOR-PUERTAS',
        start: { x: -20, y: 0 },
        end: { x: 0, y: 20 },
      },
      // Cotas
      {
        type: 'LINE',
        layer: 'A-DIMS-COTAS',
        start: { x: -100, y: -95 },
        end: { x: 100, y: -95 },
      },
      {
        type: 'LINE',
        layer: 'A-DIMS-COTAS',
        start: { x: 115, y: -80 },
        end: { x: 115, y: 80 },
      },
    ],
    bounds: { minX: -120, minY: -110, maxX: 130, maxY: 100 },
  };
}

interface CadViewerScreenProps {
  onBack: () => void;
  isDark: boolean;
}

export const CadViewerScreen: React.FC<CadViewerScreenProps> = ({ onBack, isDark }) => {
  const [drawing, setDrawing] = useState<CadDrawing>(getMobileCivil3DDrawing());
  const [layersState, setLayersState] = useState<Record<string, boolean>>({});
  const [scale, setScale] = useState(1.2);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [layersModalOpen, setLayersModalOpen] = useState(false);
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<CadPoint[]>([]);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height - 180;

  // Inicializar capas
  useMemo(() => {
    const lState: Record<string, boolean> = {};
    Object.keys(drawing.layers).forEach((k) => {
      lState[k] = true;
    });
    setLayersState(lState);
  }, [drawing]);

  // Conversión de coordenadas CAD a Pantalla SVG
  const toScreenX = (x: number) => screenWidth / 2 + (x * scale) + offset.x;
  const toScreenY = (y: number) => screenHeight / 2 - (y * scale) + offset.y;

  // Pan Responder táctil para paneo continuo con el dedo
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {},
        onPanResponderMove: (_evt, gestureState) => {
          setOffset((prev) => ({
            x: prev.x + gestureState.dx * 0.1,
            y: prev.y + gestureState.dy * 0.1,
          }));
        },
      }),
    []
  );

  const resetView = () => {
    setScale(1.2);
    setOffset({ x: 0, y: 0 });
    setMeasurePoints([]);
  };

  const toggleLayer = (lName: string) => {
    setLayersState((prev) => ({ ...prev, [lName]: !prev[lName] }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#0B0F19' }]}>
      {/* 1. Barra Superior */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>← Hub</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.titleText} numberOfLines={1}>
            {drawing.filename}
          </Text>
          <Text style={styles.subText}>{drawing.version}</Text>
        </View>

        {/* Selector de Plano de Demostración */}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity
            onPress={() => {
              setDrawing(getMobileCivil3DDrawing());
              resetView();
            }}
            style={[styles.miniBtn, drawing.filename.includes('CIVIL3D') && styles.miniBtnActive]}
          >
            <Text style={styles.miniBtnText}>⛰️ Civil3D</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setDrawing(getMobileArchitecturalDrawing());
              resetView();
            }}
            style={[styles.miniBtn, drawing.filename.includes('ARQ') && styles.miniBtnActive]}
          >
            <Text style={styles.miniBtnText}>🏢 Arq</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. ÁREA DE VISUALIZACIÓN VECTORIAL CAD */}
      <View style={styles.canvasArea} {...panResponder.panHandlers}>
        <Svg width={screenWidth} height={screenHeight}>
          {/* Ejes de Origen (0,0) */}
          <Line
            x1={toScreenX(-30)}
            y1={toScreenY(0)}
            x2={toScreenX(30)}
            y2={toScreenY(0)}
            stroke="#EF4444"
            strokeWidth="1.5"
          />
          <Line
            x1={toScreenX(0)}
            y1={toScreenY(-30)}
            x2={toScreenX(0)}
            y2={toScreenY(30)}
            stroke="#22C55E"
            strokeWidth="1.5"
          />

          {/* Entidades CAD del plano */}
          <G>
            {drawing.entities.map((ent, idx) => {
              if (layersState[ent.layer] === false) return null;
              const layerColor = drawing.layers[ent.layer]?.color || '#38BDF8';

              if (ent.type === 'LINE' && ent.start && ent.end) {
                return (
                  <Line
                    key={idx}
                    x1={toScreenX(ent.start.x)}
                    y1={toScreenY(ent.start.y)}
                    x2={toScreenX(ent.end.x)}
                    y2={toScreenY(ent.end.y)}
                    stroke={layerColor}
                    strokeWidth="2"
                  />
                );
              }

              if ((ent.type === 'LWPOLYLINE' || ent.type === 'POLYLINE') && ent.vertices) {
                const pts = ent.vertices.map((v) => `${toScreenX(v.x)},${toScreenY(v.y)}`).join(' ');
                const closedPts = ent.closed && ent.vertices.length > 0
                  ? `${pts} ${toScreenX(ent.vertices[0].x)},${toScreenY(ent.vertices[0].y)}`
                  : pts;

                return (
                  <Polyline
                    key={idx}
                    points={closedPts}
                    stroke={layerColor}
                    strokeWidth="2"
                    fill="none"
                  />
                );
              }

              if (ent.type === 'CIRCLE' && ent.center && ent.radius) {
                return (
                  <Circle
                    key={idx}
                    cx={toScreenX(ent.center.x)}
                    cy={toScreenY(ent.center.y)}
                    r={ent.radius * scale}
                    stroke={layerColor}
                    strokeWidth="2"
                    fill="none"
                  />
                );
              }

              return null;
            })}
          </G>
        </Svg>

        {/* Controles Flotantes de Navegación: Zoom y Capas */}
        <View style={styles.floatingControls}>
          <TouchableOpacity onPress={() => setScale((s) => s * 1.3)} style={styles.toolCircleBtn}>
            <Text style={styles.toolIconText}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScale((s) => Math.max(s * 0.7, 0.2))} style={styles.toolCircleBtn}>
            <Text style={styles.toolIconText}>－</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetView} style={styles.toolCircleBtn}>
            <Text style={styles.toolIconText}>⟲</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLayersModalOpen(true)} style={styles.toolCircleBtn}>
            <Text style={styles.toolIconText}>📚</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Barra Inferior de Estado */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Desliza para Pan • Zoom: {(scale * 100).toFixed(0)}% • {drawing.entities.length} entidades
        </Text>
      </View>

      {/* MODAL DE CAPAS */}
      <Modal visible={layersModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Capas del Plano ({Object.keys(drawing.layers).length})</Text>
              <TouchableOpacity onPress={() => setLayersModalOpen(false)}>
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              {Object.keys(drawing.layers).map((lName) => {
                const layer = drawing.layers[lName];
                const isVisible = layersState[lName] !== false;

                return (
                  <TouchableOpacity
                    key={lName}
                    onPress={() => toggleLayer(lName)}
                    style={styles.layerRow}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={[styles.layerDot, { backgroundColor: layer.color }]} />
                      <Text style={[styles.layerName, !isVisible && { opacity: 0.4 }]}>
                        {lName}
                      </Text>
                    </View>
                    <Text style={{ color: isVisible ? '#38BDF8' : '#64748B', fontWeight: 'bold', fontSize: 13 }}>
                      {isVisible ? 'Visible' : 'Oculta'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#030712',
    borderBottomWidth: 1,
    borderColor: '#1F2937',
  },
  backBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#1F2937' },
  titleText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  subText: { color: '#94A3B8', fontSize: 10 },
  miniBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#1F2937' },
  miniBtnActive: { backgroundColor: '#059669' },
  miniBtnText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  canvasArea: { flex: 1, position: 'relative' },
  floatingControls: { position: 'absolute', top: 16, left: 16, gap: 10 },
  toolCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolIconText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#030712',
    borderTopWidth: 1,
    borderColor: '#1F2937',
    alignItems: 'center',
  },
  footerText: { color: '#94A3B8', fontSize: 11, fontFamily: 'monospace' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#374151',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  layerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#1F2937',
  },
  layerDot: { width: 12, height: 12, borderRadius: 6 },
  layerName: { color: '#FFFFFF', fontSize: 13, fontFamily: 'monospace' },
});
