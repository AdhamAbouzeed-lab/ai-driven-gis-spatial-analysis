import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { X, GitCompare } from 'lucide-react';
const CompareCountries = ({ onClose }) => {
  const { theme, setSelectedCountry } = useApp();
  const [country1, setCountry1] = useState(null);
  const [country2, setCountry2] = useState(null);
  const chartData = country1 && country2 ? [
    { metric: 'Population (M)', [country1.name]: (country1.population/1e6).toFixed(1), [country2.name]: (country2.population/1e6).toFixed(1) },
    { metric: 'GDP ($B)', [country1.name]: (country1.gdp/1000).toFixed(0), [country2.name]: (country2.gdp/1000).toFixed(0) },
    { metric: 'Area (M km²)', [country1.name]: (country1.area/1e6).toFixed(2), [country2.name]: (country2.area/1e6).toFixed(2) },
    { metric: 'Density (/km²)', [country1.name]: country1.popDensity || 0, [country2.name]: country2.popDensity || 0 }
  ] : [];
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: '700px', maxWidth: '90vw', maxHeight: '90vh',
      background: bg, backdropFilter: 'blur(10px)',
      borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)',
      padding: '24px', zIndex: 1000, color, overflowY: 'auto',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitCompare size={20} /> Compare Countries
        </h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color, cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div>
          <label style={{ fontSize: '12px', opacity: 0.7 }}>Country 1</label>
          <input type="text" placeholder="e.g., Brazil" value={country1?.name || ''}
            onChange={(e) => setCountry1(e.target.value ? { name: e.target.value, population: 216422446, gdp: 2126811, area: 8515767, popDensity: 25 } : null)}
            style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color, fontSize: '14px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', opacity: 0.7 }}>Country 2</label>
          <input type="text" placeholder="e.g., Argentina" value={country2?.name || ''}
            onChange={(e) => setCountry2(e.target.value ? { name: e.target.value, population: 45773884, gdp: 641102, area: 2780400, popDensity: 16 } : null)}
            style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color, fontSize: '14px' }} />
        </div>
      </div>
      {chartData.length > 0 && (
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
              <XAxis dataKey="metric" tick={{ fill: color, fontSize: 12 }} />
              <YAxis tick={{ fill: color, fontSize: 12 }} />
              <Tooltip contentStyle={{ background: bg, border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color }} />
              <Legend wrapperStyle={{ color }} />
              <Bar dataKey={country1.name} fill="#3b82f6" />
              <Bar dataKey={country2.name} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
export default CompareCountries;
