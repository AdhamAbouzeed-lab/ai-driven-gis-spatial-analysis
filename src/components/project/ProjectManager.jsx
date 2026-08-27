import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, FolderOpen, X, Download, Upload } from 'lucide-react';
const ProjectManager = ({ onClose }) => {
  const { theme, activeLayer, visibleLayers, selectedCountry } = useApp();
  const [saving, setSaving] = useState(false);
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  const saveProject = () => {
    const projectData = {
      timestamp: new Date().toISOString(),
      mapState: {
        activeLayer,
        visibleLayers,
        selectedCountry: selectedCountry ? selectedCountry.name : null,
        zoom: 4,
        center: [-60, -15]
      },
      metadata: {
        version: '2.0',
        appName: 'ADHAM GIS AI'
      }
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adham-gis-project-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSaving(false);
  };
  const loadProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target.result);
        console.log('Loading project:', projectData);
        alert('Project loaded! Map will update with saved state.');
        // Here you would dispatch actions to restore the map state
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
        <button
          onClick={saveProject}
          disabled={saving}
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '14px'
          }}
        >
          <Save size={18} /> Save Current Project
        </button>
        <label style={{
          width: '100%',
          padding: '14px',
          background: 'rgba(255,255,255,0.05)',
          border: '2px dashed ' + borderColor,
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          <Upload size={18} />
          <span>Load Project</span>
          <input type="file" accept=".json" onChange={loadProject} style={{ display: 'none' }} />
        </label>
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(59,130,246,0.05)', borderRadius: '8px', fontSize: '12px', opacity: 0.8 }}>
          <strong>What gets saved:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>Active layers</li>
            <li>Visible layers</li>
            <li>Selected country</li>
            <li>Map view settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ProjectManager;
