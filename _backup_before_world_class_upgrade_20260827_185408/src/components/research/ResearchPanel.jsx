import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, TrendingUp, AlertTriangle, X, Target } from 'lucide-react';
const ResearchPanel = ({ onClose }) => {
  const { theme, selectedCountry, activeLayer } = useApp();
  const [loading, setLoading] = useState(true);
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  useEffect(() => {
    if (selectedCountry) {
      const timer = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [selectedCountry, activeLayer]);
  if (!selectedCountry) return null;
  const dsi = selectedCountry.dsi || 0;
  const density = selectedCountry.popDensity || 0;
  const gdpPerCapita = selectedCountry.gdpPerCapita || 0;
  // Real analytical insights based on actual indicators
  const generateInsights = () => {
    const insights = [];
    // DSI-based insight
    let dsiLevel = 'low';
    if (dsi > 70) dsiLevel = 'very high';
    else if (dsi > 50) dsiLevel = 'high';
    else if (dsi > 30) dsiLevel = 'moderate';
    insights.push({
      icon: Target, color: '#8b5cf6',
      title: 'Development Suitability Index',
      desc: `DSI Score: ${dsi.toFixed(1)}/100 (${dsiLevel}). Methodology: 35% population density + 45% GDP per capita + 20% territorial area. ${dsi > 50 ? 'Strong development potential.' : 'Significant growth opportunities.'}`
    });
    // Economic insight
    let econStatus = 'developing';
    if (gdpPerCapita > 15000) econStatus = 'high-income';
    else if (gdpPerCapita > 5000) econStatus = 'upper-middle-income';
    else if (gdpPerCapita > 2000) econStatus = 'lower-middle-income';
    insights.push({
      icon: TrendingUp, color: '#10b981',
      title: 'Economic Classification',
      desc: `GDP per capita: $${gdpPerCapita.toLocaleString()} (${econStatus}). ${gdpPerCapita > 10000 ? 'Strong economic base for infrastructure investment.' : 'Emerging market with growth potential.'}`
    });
    // Density insight
    let densityStatus = 'low density';
    if (density > 100) densityStatus = 'very high density';
    else if (density > 50) densityStatus = 'high density';
    else if (density > 20) densityStatus = 'moderate density';
    insights.push({
      icon: BookOpen, color: '#3b82f6',
      title: 'Demographic Analysis',
      desc: `Population density: ${density}/km² (${densityStatus}). ${density > 50 ? 'Urbanization challenges and opportunities.' : 'Rural development potential with infrastructure needs.'}`
    });
    // Risk assessment
    const riskFactors = [];
    if (density > 80) riskFactors.push('high population pressure');
    if (gdpPerCapita < 3000) riskFactors.push('economic vulnerability');
    if (selectedCountry.area > 1000000 && density < 10) riskFactors.push('territorial governance challenges');
    insights.push({
      icon: AlertTriangle, color: '#f59e0b',
      title: 'Risk Assessment',
      desc: riskFactors.length > 0 
        ? `Key risks: ${riskFactors.join(', ')}. Recommend targeted interventions.`
        : 'Balanced profile with manageable risk factors.'
    });
    return insights;
  };
  const insights = generateInsights();
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
          <div style={{ fontSize: '16px', fontWeight: 700 }}>{selectedCountry.name}</div>
          <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
            Active: {activeLayer.toUpperCase()} | Data: World Bank 2023
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.7 }}>
            <div style={{ fontSize: '14px' }}>Computing indicators...</div>
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
                  display: 'flex', gap: '12px'
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
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(139,92,246,0.1)', borderRadius: '8px', fontSize: '11px', opacity: 0.8 }}>
          <strong>Methodology:</strong> Insights derived from deterministic composite indicators. Reproducible with same dataset.
        </div>
      </div>
    </div>
  );
};
export default ResearchPanel;
