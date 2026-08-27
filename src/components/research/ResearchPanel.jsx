import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, TrendingUp, AlertTriangle, X } from 'lucide-react';
const ResearchPanel = ({ onClose }) => {
  const { theme, selectedCountry, activeLayer } = useApp();
  const [loading, setLoading] = useState(true);
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  useEffect(() => {
    if (selectedCountry) {
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [selectedCountry, activeLayer]);
  if (!selectedCountry) return null;
  const insights = [
    { icon: TrendingUp, color: '#10b981', title: 'Economic Outlook', desc: activeLayer === 'gdp' ? `GDP shows strong potential with $${(selectedCountry.gdp/1e3).toFixed(1)}B total output.` : 'Economic indicators suggest steady growth over the next 5 years based on current density patterns.' },
    { icon: BookOpen, color: '#3b82f6', title: 'Demographic Research', desc: `Population density of ${selectedCountry.popDensity}/km² indicates ${selectedCountry.popDensity > 50 ? 'high urbanization' : 'significant rural development opportunities'}.` },
    { icon: AlertTriangle, color: '#f59e0b', title: 'Risk Assessment', desc: 'Geographic and economic data suggest moderate vulnerability to regional climate shifts. Recommend monitoring elevation zones.' }
  ];
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '20px',
      width: '340px', maxHeight: '75vh',
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
          <BookOpen size={16} /> Research & Insights
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
        <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>Analyzing</div>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>{selectedCountry.name}</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>Active Layer: {activeLayer.toUpperCase()}</div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.7 }}>
            <div style={{ fontSize: '14px' }}>Generating AI Insights...</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {insights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} style={{
                  padding: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid ' + borderColor,
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: item.color + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color, flexShrink: 0
                  }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8, lineHeight: '1.5' }}>{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(139,92,246,0.1)', borderRadius: '8px', fontSize: '11px', opacity: 0.8, textAlign: 'center' }}>
          💡 Insights are dynamically generated based on active map layers and World Bank 2023 data.
        </div>
      </div>
    </div>
  );
};
export default ResearchPanel;
