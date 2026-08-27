import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Ruler, Square, Trash2, X } from 'lucide-react';
import * as turf from '@turf/turf';
import MaplibreDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
const MeasurementTools = ({ map, onClose }) => {
  const { theme } = useApp();
  const [mode, setMode] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  const [drawControl, setDrawControl] = useState(null);
  useEffect(() => {
    if (!map) return;
    const draw = new MaplibreDraw({
      displayControlsDefault: false,
      controls: {},
      defaultMode: 'simple_select',
      styles: [
        {
          id: 'gl-draw-line', type: 'line', filter: ['all', ['==', '$type', 'LineString']],
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#3b82f6', 'line-dasharray': [2, 2], 'line-width': 3 }
        },
        {
          id: 'gl-draw-polygon-fill', type: 'fill', filter: ['all', ['==', '$type', 'Polygon']],
          paint: { 'fill-color': '#3b82f6', 'fill-outline-color': '#3b82f6', 'fill-opacity': 0.3 }
        }
      ]
    });
    map.addControl(draw, 'top-left');
    setDrawControl(draw);
    const updateMeasure = () => {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const feature = data.features[0];
        if (feature.geometry.type === 'LineString') {
          const length = turf.length(feature, { units: 'kilometers' });
          setMeasurement({ type: 'Distance', value: length.toFixed(2) + ' km' });
        } else if (feature.geometry.type === 'Polygon') {
          const area = turf.area(feature);
          setMeasurement({ type: 'Area', value: (area / 1000000).toFixed(2) + ' km²' });
        }
      }
    };
    map.on('draw.create', updateMeasure);
    map.on('draw.update', updateMeasure);
    map.on('draw.delete', () => setMeasurement(null));
    return () => {
      map.removeControl(draw);
      map.off('draw.create', updateMeasure);
      map.off('draw.update', updateMeasure);
      map.off('draw.delete', () => setMeasurement(null));
    };
  }, [map]);
  const startDrawing = (drawMode) => {
    setMode(drawMode);
    setMeasurement(null);
    drawControl.changeMode(drawMode);
  };
  const clearMeasurements = () => {
    if (drawControl) {
      drawControl.deleteAll();
      setMeasurement(null);
      setMode(null);
      drawControl.changeMode('simple_select');
    }
  };
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  return (
    <div style={{
      position: 'fixed', top: '80px', left: '20px',
      width: '280px',
      background: bg, backdropFilter: 'blur(12px)',
      borderRadius: '12px', border: '1px solid ' + borderColor,
      padding: '0', zIndex: 100, color: color,
      boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
      overflow: 'hidden'
    }}>
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 16px',
        borderBottom: '1px solid ' + borderColor,
        background: 'rgba(59,130,246,0.1)'
      }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Measurement Tools</h3>
        <button onClick={onClose} style={{
          background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '50%',
          width: '28px', height: '28px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ef4444'
        }}>
          <X size={16} />
        </button>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <button onClick={() => startDrawing('line_string')} style={{
            padding: '12px', background: mode === 'line_string' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
            border: '1px solid ' + (mode === 'line_string' ? '#3b82f6' : borderColor),
            borderRadius: '8px', color: color, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600
          }}>
            <Ruler size={20} color={mode === 'line_string' ? '#3b82f6' : color} />
            Distance
          </button>
          <button onClick={() => startDrawing('draw_polygon')} style={{
            padding: '12px', background: mode === 'draw_polygon' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
            border: '1px solid ' + (mode === 'draw_polygon' ? '#3b82f6' : borderColor),
            borderRadius: '8px', color: color, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600
          }}>
            <Square size={20} color={mode === 'draw_polygon' ? '#3b82f6' : color} />
            Area
          </button>
        </div>
        {measurement && (
          <div style={{
            padding: '16px', background: 'rgba(16,185,129,0.1)',
            border: '1px solid #10b981', borderRadius: '8px',
            textAlign: 'center', marginBottom: '12px'
          }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>{measurement.type}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{measurement.value}</div>
          </div>
        )}
        <button onClick={clearMeasurements} style={{
          width: '100%', padding: '10px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '8px', color: '#ef4444', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: 600
        }}>
          <Trash2 size={16} /> Clear
        </button>
        <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '12px', textAlign: 'center' }}>
          Click on map to draw. Double-click to finish.
        </p>
      </div>
    </div>
  );
};
export default MeasurementTools;
