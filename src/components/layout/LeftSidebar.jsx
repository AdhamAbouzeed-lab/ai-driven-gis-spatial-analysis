import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, DollarSign, BarChart3, Cpu, Building2, Flame, Truck, Waves, Mountain, ChevronDown, ChevronRight, Eye } from 'lucide-react';
const LeftSidebar = () => {
  const { theme, activeLayer, setActiveLayer, visibleLayers, setVisibleLayers } = useApp();
  const [analyticalOpen, setAnalyticalOpen] = useState(true);
  const [operationalOpen, setOperationalOpen] = useState(true);
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)';
  const analyticalLayers = [
    { id: 'population', name: 'Population Density', desc: 'Population density per km²', icon: Users, color: '#3b82f6' },
    { id: 'gdp', name: 'GDP per Capita', desc: 'Gross Domestic Product per capita', icon: DollarSign, color: '#10b981' },
    { id: 'dsi', name: 'DSI Score', desc: 'Development Suitability Index', icon: BarChart3, color: '#8b5cf6' },
    { id: 'ml', name: 'ML Clusters', desc: 'Machine Learning regional clusters', icon: Cpu, color: '#f59e0b' }
  ];
  const operationalLayers = [
    { id: 'cities', name: 'Cities', desc: 'Major cities and capitals', icon: Building2, color: '#ef4444' },
    { id: 'heatmap', name: 'Heatmap', desc: 'Activity density heatmap', icon: Flame, color: '#f97316' },
    { id: 'transport', name: 'Transport Corridors', desc: 'Major transport routes', icon: Truck, color: '#06b6d4' },
    { id: 'rivers', name: 'Rivers', desc: 'Major river systems', icon: Waves, color: '#0ea5e9' },
    { id: 'elevation', name: 'Elevation Zones', desc: 'Elevation zones classification', icon: Mountain, color: '#84cc16' }
  ];
  const toggleLayer = (id) => {
    if (visibleLayers.includes(id)) {
      setVisibleLayers(visibleLayers.filter(l => l !== id));
    } else {
      setVisibleLayers([...visibleLayers, id]);
    }
  };
  const LayerItem = ({ layer, isActive, isOperational }) => {
    const Icon = layer.icon;
    const isVisible = visibleLayers.includes(layer.id);
    const active = isOperational ? isVisible : isActive;
    return (
      <div onClick={() => {
        if (!isOperational) setActiveLayer(layer.id);
        toggleLayer(layer.id);
      }} style={{
        padding: '12px',
        marginBottom: '8px',
        background: active ? (layer.color + '20') : 'rgba(255,255,255,0.03)',
        border: '1px solid ' + (active ? layer.color : borderColor),
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: layer.color + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: layer.color
        }}>
          <Icon size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color }}>{layer.name}</div>
          <div style={{ fontSize: '11px', opacity: 0.7 }}>{layer.desc}</div>
        </div>
        <div style={{
          width: '20px', height: '20px', borderRadius: '4px',
          background: isVisible ? layer.color : 'transparent',
          border: '2px solid ' + layer.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {isVisible && <Eye size={12} color="#fff" />}
        </div>
      </div>
    );
  };
  return (
    <div style={{
      width: '320px', height: '100%',
      background: bg, backdropFilter: 'blur(10px)',
      borderRight: '1px solid ' + borderColor,
      overflowY: 'auto', padding: '16px', color
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#3b82f6' }}>Layers</h2>
      <div style={{ marginBottom: '20px' }}>
        <div onClick={() => setAnalyticalOpen(!analyticalOpen)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px', background: 'rgba(59,130,246,0.1)',
          borderRadius: '8px', cursor: 'pointer', marginBottom: '12px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Analytical</span>
          {analyticalOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
        {analyticalOpen && analyticalLayers.map(layer => (
          <LayerItem key={layer.id} layer={layer} isActive={activeLayer === layer.id} isOperational={false} />
        ))}
      </div>
      <div>
        <div onClick={() => setOperationalOpen(!operationalOpen)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px', background: 'rgba(59,130,246,0.1)',
          borderRadius: '8px', cursor: 'pointer', marginBottom: '12px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Operational</span>
          {operationalOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
        {operationalOpen && operationalLayers.map(layer => (
          <LayerItem key={layer.id} layer={layer} isActive={false} isOperational={true} />
        ))}
      </div>
      <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(59,130,246,0.05)', borderRadius: '8px', fontSize: '11px', opacity: 0.7 }}>
        💡 Click a layer to activate it. Toggle the eye icon to show/hide on map.
      </div>
    </div>
  );
};
export default LeftSidebar;
