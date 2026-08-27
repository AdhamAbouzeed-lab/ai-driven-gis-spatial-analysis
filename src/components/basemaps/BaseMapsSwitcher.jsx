import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Map, Satellite, Mountain, Moon, Sun, X } from 'lucide-react';
const BaseMapsSwitcher = ({ onClose }) => {
  const { theme } = useApp();
  const [activeMap, setActiveMap] = useState('osm');
  const baseMaps = [
    { id: 'osm', name: 'OpenStreetMap', icon: Map, url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' },
    { id: 'satellite', name: 'Satellite', icon: Satellite, url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
    { id: 'terrain', name: 'Terrain', icon: Mountain, url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png' },
    { id: 'dark', name: 'Dark Matter', icon: Moon, url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png' },
    { id: 'light', name: 'Light', icon: Sun, url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png' }
  ];
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  return (
    <div style={{
      position: 'fixed', top: '80px', left: '20px',
      width: '300px', maxHeight: '70vh',
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
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} /> Base Maps
        </h3>
        <button onClick={onClose} style={{
          background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '50%',
          width: '28px', height: '28px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ef4444'
        }}>
          <X size={16} />
        </button>
      </div>
      <div style={{ padding: '12px', display: 'grid', gap: '8px', overflowY: 'auto', maxHeight: 'calc(70vh - 60px)' }}>
        {baseMaps.map(map => {
          const Icon = map.icon;
          const isActive = activeMap === map.id;
          return (
            <button key={map.id} onClick={() => setActiveMap(map.id)} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px',
              background: isActive ? 'rgba(59,130,246,0.2)' : 'transparent',
              border: '1px solid ' + (isActive ? '#3b82f6' : borderColor),
              borderRadius: '8px', cursor: 'pointer',
              width: '100%', textAlign: 'left'
            }}>
              <Icon size={18} style={{ color: isActive ? '#3b82f6' : color }} />
              <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400 }}>{map.name}</span>
              {isActive && <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default BaseMapsSwitcher;
