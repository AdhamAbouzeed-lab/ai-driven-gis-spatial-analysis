import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Filter, X, Search, RefreshCw } from 'lucide-react';
const SpatialQueryEngine = ({ onClose, onQueryResult }) => {
  const { theme } = useApp();
  const [filters, setFilters] = useState({ minDSI: 0, maxDensity: 1000 });
  const [resultCount, setResultCount] = useState(0);
  const [isQuerying, setIsQuerying] = useState(false);
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  const executeQuery = async () => {
    setIsQuerying(true);
    // محاكاة تأخير بسيط لإعطاء شعور بالمعالجة
    await new Promise(r => setTimeout(r, 600));
    try {
      const response = await fetch('/latamCountries.json');
      const data = await response.json();
      const matched = data.features.filter(f => {
        const dsi = f.properties._dsi || 0;
        const density = f.properties._density || 0;
        return dsi >= filters.minDSI && density <= filters.maxDensity;
      });
      setResultCount(matched.length);
      onQueryResult(matched.map(f => f.properties.name));
    } catch (error) {
      console.error('Query error:', error);
    }
    setIsQuerying(false);
  };
  const resetQuery = () => {
    setFilters({ minDSI: 0, maxDensity: 1000 });
    setResultCount(0);
    onQueryResult([]);
  };
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '20px',
      width: '340px',
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
        background: 'rgba(139,92,246,0.1)'
      }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} /> Spatial Query Engine
        </h3>
        <button onClick={onClose} style={{
          background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '50%',
          width: '28px', height: '28px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444'
        }}><X size={16} /></button>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px', display: 'block' }}>
            Min DSI Score (0-100)
          </label>
          <input 
            type="range" min="0" max="100" value={filters.minDSI} 
            onChange={(e) => setFilters({...filters, minDSI: Number(e.target.value)})}
            style={{ width: '100%', accentColor: '#8b5cf6' }}
          />
          <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#8b5cf6' }}>{filters.minDSI}</div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px', display: 'block' }}>
            Max Population Density (per km²)
          </label>
          <input 
            type="range" min="0" max="500" value={filters.maxDensity} 
            onChange={(e) => setFilters({...filters, maxDensity: Number(e.target.value)})}
            style={{ width: '100%', accentColor: '#3b82f6' }}
          />
          <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#3b82f6' }}>{filters.maxDensity}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={executeQuery} disabled={isQuerying} style={{
            flex: 1, padding: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            border: 'none', borderRadius: '8px', color: '#fff',
            fontWeight: 600, cursor: 'pointer', fontSize: '13px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}>
            {isQuerying ? 'Processing...' : <><Filter size={16} /> Execute Query</>}
          </button>
          <button onClick={resetQuery} style={{
            padding: '12px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid ' + borderColor, borderRadius: '8px',
            color: color, cursor: 'pointer'
          }}>
            <RefreshCw size={16} />
          </button>
        </div>
        {resultCount > 0 && (
          <div style={{ 
            marginTop: '16px', padding: '12px', 
            background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981',
            borderRadius: '8px', textAlign: 'center' 
          }}>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Matched Countries</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{resultCount}</div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>Highlighted on map</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SpatialQueryEngine;
