import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sliders } from 'lucide-react';
const AdvancedFilters = ({ onClose }) => {
  const { theme } = useApp();
  const [filters, setFilters] = useState({ minPopulation: 0, maxPopulation: 200, minGDP: 0, maxGDP: 2000, regions: [] });
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  const regions = ['South America', 'Central America', 'Caribbean'];
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '20px',
      width: '320px', maxHeight: '75vh',
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
          <Sliders size={16} /> Advanced Filters
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
      <div style={{ padding: '16px', overflowY: 'auto', maxHeight: 'calc(75vh - 60px)' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px', display: 'block' }}>Population (Millions)</label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="number" value={filters.minPopulation} onChange={(e) => setFilters({...filters, minPopulation: Number(e.target.value)})}
              style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + borderColor, borderRadius: '6px', color: color, fontSize: '13px' }} placeholder="Min" />
            <span>-</span>
            <input type="number" value={filters.maxPopulation} onChange={(e) => setFilters({...filters, maxPopulation: Number(e.target.value)})}
              style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + borderColor, borderRadius: '6px', color: color, fontSize: '13px' }} placeholder="Max" />
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px', display: 'block' }}>GDP (Billions USD)</label>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="number" value={filters.minGDP} onChange={(e) => setFilters({...filters, minGDP: Number(e.target.value)})}
              style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + borderColor, borderRadius: '6px', color: color, fontSize: '13px' }} placeholder="Min" />
            <span>-</span>
            <input type="number" value={filters.maxGDP} onChange={(e) => setFilters({...filters, maxGDP: Number(e.target.value)})}
              style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + borderColor, borderRadius: '6px', color: color, fontSize: '13px' }} placeholder="Max" />
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px', display: 'block' }}>Regions</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {regions.map(region => (
              <label key={region} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                <input type="checkbox" checked={filters.regions.includes(region)}
                  onChange={(e) => {
                    if (e.target.checked) setFilters({...filters, regions: [...filters.regions, region]});
                    else setFilters({...filters, regions: filters.regions.filter(r => r !== region)});
                  }}
                  style={{ accentColor: '#3b82f6' }} />
                {region}
              </label>
            ))}
          </div>
        </div>
        <button style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '14px', marginBottom: '8px' }}>Apply Filters</button>
        <button onClick={() => setFilters({ minPopulation: 0, maxPopulation: 200, minGDP: 0, maxGDP: 2000, regions: [] })}
          style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid ' + borderColor, borderRadius: '8px', color: color, cursor: 'pointer', fontSize: '13px' }}>Reset Filters</button>
      </div>
    </div>
  );
};
export default AdvancedFilters;
