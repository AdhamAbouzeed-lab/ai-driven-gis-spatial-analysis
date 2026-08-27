import { useApp } from '../../context/AppContext';
import { MapPin, Users, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const RightSidebar = () => {
  const { theme, selectedCountry, rightSidebarOpen } = useApp();
  if (!rightSidebarOpen) return null;

  const bg = theme === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const textColor = theme === 'dark' ? '#fff' : '#000';

  // بيانات للـ Chart
  const populationData = selectedCountry ? [
    { name: 'Population', value: selectedCountry.population ? (selectedCountry.population/1e6).toFixed(1) : 0 },
    { name: 'GDP (M)', value: selectedCountry.gdp ? (selectedCountry.gdp/1000).toFixed(1) : 0 }
  ] : [];

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

  return (
    <div style={{ 
      width: '350px', 
      height: '100%', 
      background: bg, 
      backdropFilter: 'blur(10px)', 
      borderLeft: '1px solid rgba(59,130,246,0.2)', 
      overflowY: 'auto', 
      padding: '16px', 
      color 
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', color: '#3b82f6' }}>Details</h2>
      
      {selectedCountry ? (
        <>
          <div style={{ padding: '16px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{selectedCountry.name}</h3>
            {selectedCountry.capital && (
              <div style={{ fontSize: '13px', opacity: 0.8, display: 'flex', alignItems: 'center' }}>
                <MapPin size={14} style={{ marginRight: '6px' }} />
                Capital: {selectedCountry.capital}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Statistics</h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', border: '1px solid #3b82f630' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#3b82f620', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#3b82f6' }}>
                  <Users size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>Population</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>
                    {selectedCountry.population ? (selectedCountry.population/1e6).toFixed(1) + 'M' : 'N/A'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', border: '1px solid #10b98130' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#10b98120', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#10b981' }}>
                  <DollarSign size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>GDP</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>
                    ${selectedCountry.gdp ? selectedCountry.gdp.toLocaleString() + 'M' : 'N/A'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', border: '1px solid #8b5cf630' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#8b5cf620', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#8b5cf6' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>Area</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>
                    {selectedCountry.area ? selectedCountry.area.toLocaleString() + ' km²' : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
              <BarChart3 size={16} style={{ marginRight: '6px' }} />
              Metrics Overview
            </h4>
            <div style={{ height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={populationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                  <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
                  <YAxis tick={{ fill: textColor, fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: theme === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)', 
                      border: '1px solid rgba(59,130,246,0.3)',
                      borderRadius: '6px',
                      color: textColor
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ padding: '16px', background: 'rgba(139,92,246,0.1)', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
              <TrendingUp size={16} style={{ marginRight: '6px' }} />
              Insights
            </h4>
            <div style={{ fontSize: '13px', lineHeight: '1.6', opacity: 0.9 }}>
              {selectedCountry.name} shows 
              {selectedCountry.population && selectedCountry.population > 50e6 ? ' significant population density' : ' moderate development patterns'} 
              in the current analysis.
            </div>
          </div>
        </>
      ) : (
        <div style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.6 }}>
          <MapPin size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={{ fontSize: '14px' }}>Click on a country to view details</p>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
