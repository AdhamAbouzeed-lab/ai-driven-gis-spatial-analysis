import { useApp } from '../../context/AppContext';
import { Users, DollarSign, Target } from 'lucide-react';
const DynamicLegend = () => {
  const { activeLayer, visibleLayers } = useApp();
  const legends = {
    population: {
      title: 'Population Density (per km²)',
      icon: Users,
      color: '#3b82f6',
      items: [
        { label: '> 100', color: '#1e3a8a' },
        { label: '50-100', color: '#1e40af' },
        { label: '20-50', color: '#2563eb' },
        { label: '10-20', color: '#3b82f6' },
        { label: '5-10', color: '#60a5fa' },
        { label: '< 5', color: '#93c5fd' }
      ]
    },
    gdp: {
      title: 'GDP per Capita (USD)',
      icon: DollarSign,
      color: '#10b981',
      items: [
        { label: '> $20,000', color: '#064e3b' },
        { label: '$10-20K', color: '#065f46' },
        { label: '$5-10K', color: '#047857' },
        { label: '$2-5K', color: '#059669' },
        { label: '$1-2K', color: '#10b981' },
        { label: '< $1,000', color: '#6ee7b7' }
      ]
    },
    dsi: {
      title: 'Development Suitability Index',
      icon: Target,
      color: '#8b5cf6',
      items: [
        { label: '> 70 (Very High)', color: '#7c3aed' },
        { label: '50-70 (High)', color: '#8b5cf6' },
        { label: '30-50 (Moderate)', color: '#a78bfa' },
        { label: '15-30 (Low)', color: '#c4b5fd' },
        { label: '< 15 (Very Low)', color: '#ddd6fe' }
      ],
      methodology: '35% density + 45% GDP/capita + 20% area'
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
      width: '220px',
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
              width: '20px', height: '12px', borderRadius: '3px',
              background: item.color, border: '1px solid rgba(255,255,255,0.2)'
            }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      {legend.methodology && (
        <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(59,130,246,0.3)', fontSize: '10px', opacity: 0.7, fontStyle: 'italic' }}>
          {legend.methodology}
        </div>
      )}
      {visibleLayers.includes('cities') && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(59,130,246,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', border: '2px solid #ffffff' }} />
            <span>Capital Cities</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default DynamicLegend;
