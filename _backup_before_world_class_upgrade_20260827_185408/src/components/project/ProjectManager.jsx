import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, X, Upload } from 'lucide-react';
const ProjectManager = ({ onClose, mapRef }) => {
  const { theme, activeLayer, visibleLayers, selectedCountry, mapState } = useApp();
  const [loading, setLoading] = useState(false);
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  const saveProject = () => {
    const projectData = {
      version: '2.1',
      appName: 'ADHAM GIS AI',
      timestamp: new Date().toISOString(),
      mapState: {
        zoom: mapState.zoom,
        center: mapState.center,
        bearing: mapState.bearing,
        pitch: mapState.pitch,
        activeLayer,
        visibleLayers,
        selectedCountry: selectedCountry ? selectedCountry.name : null
      },
      metadata: {
        dataSources: ['Natural Earth', 'World Bank 2023'],
        crs: 'EPSG:4326',
        dsiMethodology: 'Weighted: 35% density + 45% GDP/capita + 20% area'
      }
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adham-gis-project-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const loadProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target.result);
        // Validate structure
        if (!projectData.mapState) throw new Error('Invalid project file');
        const state = projectData.mapState;
        // Restore map viewport if mapRef available
        if (mapRef && mapRef.current) {
          mapRef.current.flyTo({
            center: state.center,
            zoom: state.zoom,
            bearing: state.bearing || 0,
            pitch: state.pitch || 0,
            duration: 2000
          });
        }
        // Dispatch custom events to restore state
        window.dispatchEvent(new CustomEvent('restoreProject', { detail: state }));
        alert(`Project loaded successfully!\nZoom: ${state.zoom.toFixed(2)}\nLayer: ${state.activeLayer}`);
      } catch (error) {
        alert('Error loading project: ' + error.message);
      }
    };
    reader.readAsText(file);
  };
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '20px',
      width: '320px',
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
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Project Manager</h3>
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
        <div style={{ marginBottom: '12px', padding: '10px', background: 'rgba(59,130,246,0.1)', borderRadius: '6px', fontSize: '11px' }}>
          <div>Zoom: {mapState.zoom.toFixed(2)}</div>
          <div>Center: [{mapState.center[0].toFixed(2)}, {mapState.center[1].toFixed(2)}]</div>
          <div>Layer: {activeLayer}</div>
        </div>
        <button onClick={saveProject} style={{
          width: '100%', padding: '12px', marginBottom: '10px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          border: 'none', borderRadius: '8px', color: '#fff',
          fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <Save size={16} /> Save Current State
        </button>
        <label style={{
          width: '100%', padding: '12px',
          background: 'rgba(255,255,255,0.05)',
          border: '2px dashed ' + borderColor,
          borderRadius: '8px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
        }}>
          <Upload size={16} />
          <span>Load Project</span>
          <input type="file" accept=".json" onChange={loadProject} style={{ display: 'none' }} />
        </label>
      </div>
    </div>
  );
};
export default ProjectManager;
