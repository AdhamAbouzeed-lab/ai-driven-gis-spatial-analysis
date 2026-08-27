import { useApp } from '../../context/AppContext';
import { Users, DollarSign, BarChart3 } from 'lucide-react';
const DynamicLegend = () => {
  const { activeLayer, visibleLayers } = useApp();
  const legends = {
    population: {
      title: 'Population Density',
      icon: Users,
      color: '#3b82f6',
      items: [
        { label: '> 100M', color: '#1e3a8a' },
        { label: '50-100M', color: '#1e40af' },
        { label: '20-50M', color: '#2563eb' },
        { label: '10-20M', color: '#3b82f6' },
        { label: '5-10M', color: '#60a5fa' },
        { label: '< 5M', color: '#93c5fd' }
      ]
    },
    gdp: {
      title: 'GDP per Capita',
      icon: DollarSign,
      color: '#10b981',
      items: [
        { label: '> $1T', color: '#064e3b' },
        { label: '$500B-1T', color: '#065f46' },
        { label: '$200-500B', color: '#047857' },
        { label: '$100-200B', color: '#059669' },
        { label: '$50-100B', color: '#10b981' },
        { label: '< $50B', color: '#6ee7b7' }
      ]
    },
    dsi: {
      title: 'DSI Score',
      icon: BarChart3,
      color: '#8b5cf6',
      items: [
        { label: '> 80', color: '#7c3aed' },
        { label: '60-80', color: '#8b5cf6' },
        { label: '40-60', color: '#a78bfa' },
        { label: '20-40', color: '#c4b5fd' },
        { label: '< 20', color: '#ddd6fe' }
      ]
    }
  };
  const legend = legends[activeLayer];
  if (!legend) return null;
  const Icon = legend.icon;
  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      width: '200px',
      background: 'rgba(15,23,42,0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: '1px solid rgba(59,130,246,0.3)',
      padding: '16px',
      zIndex: 100,
      color: '#fff',
      boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid rgba(59,130,246,0.3)' }}>
        <Icon size={16} style={{ color: legend.color }} />
        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{legend.title}</h4>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {legend.items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
            <div style={{
              width: '20px',
              height: '12px',
              borderRadius: '3px',
              background: item.color,
              border: '1px solid rgba(255,255,255,0.2)'
            }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      {visibleLayers.includes('cities') && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(59,130,246,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid #ffffff'
            }} />
            <span>Capital Cities</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default DynamicLegend;
