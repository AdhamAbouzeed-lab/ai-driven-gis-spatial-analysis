import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Play, Pause, SkipBack, SkipForward, X, Move, TrendingUp } from 'lucide-react';
const TimeSeriesPanel = ({ onClose }) => {
  const { theme, selectedCountry } = useApp();
  const [selectedYear, setSelectedYear] = useState(2024);
  const [timeData, setTimeData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 140 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const years = Array.from({ length: 26 }, (_, i) => 1999 + i);
  useEffect(() => {
    if (!selectedCountry) return;
    const mockTimeData = years.map(year => {
      const growthFactor = 1 + (year - 1999) * 0.015;
      const gdpGrowth = 1 + (year - 1999) * 0.025;
      return {
        year,
        population: Math.round(selectedCountry.population * growthFactor),
        gdp: Math.round(selectedCountry.gdp * gdpGrowth),
        gdpPerCapita: Math.round((selectedCountry.gdp / selectedCountry.population) * (1 + (year - 1999) * 0.01)),
        density: Math.round((selectedCountry.population / selectedCountry.area_km2) * growthFactor)
      };
    });
    setTimeData(mockTimeData);
  }, [selectedCountry]);
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSelectedYear(prev => {
        if (prev >= 2024) { setIsPlaying(false); return 2024; }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  const currentData = timeData ? timeData.find(d => d.year === selectedYear) : null;
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  if (!selectedCountry || !timeData) return null;
  if (isMinimized) {
    return (
      <button onClick={() => setIsMinimized(false)} style={{
        position: 'fixed', bottom: '20px', left: '20px',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        borderRadius: '50px', padding: '12px 20px',
        color: '#fff', cursor: 'pointer', zIndex: 100,
        boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
        display: 'flex', alignItems: 'center', gap: '10px',
        fontSize: '14px', fontWeight: 600, border: 'none'
      }}>
        <TrendingUp size={18} />
        <span>Time Series</span>
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{selectedYear}</span>
      </button>
    );
  }
  return (
    <div style={{
      position: 'fixed', left: position.x + 'px', top: position.y + 'px',
      width: '700px', maxWidth: '90vw',
      background: bg, backdropFilter: 'blur(12px)',
      borderRadius: '16px', border: '1px solid ' + borderColor,
      zIndex: 100, color: color,
      boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
      overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'default'
    }}>
      <div onMouseDown={handleMouseDown} style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px',
        borderBottom: '1px solid ' + borderColor,
        background: 'rgba(59,130,246,0.1)',
        cursor: 'grab', userSelect: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Move size={14} style={{ opacity: 0.6 }} />
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
            Time Series (1999-2024) - {selectedCountry.name}
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setShowChart(!showChart)} style={{
            background: 'rgba(59,130,246,0.2)', border: 'none', borderRadius: '6px',
            padding: '6px 12px', color: color, cursor: 'pointer', fontSize: '12px'
          }}>{showChart ? 'Hide Chart' : 'Show Chart'}</button>
          <button onClick={() => setIsMinimized(true)} style={{
            background: 'rgba(59,130,246,0.2)', border: 'none', borderRadius: '50%',
            width: '28px', height: '28px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: color
          }} title="Minimize">
            <X size={14} />
          </button>
          <button onClick={onClose} style={{
            background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '50%',
            width: '28px', height: '28px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444'
          }} title="Close">
            <X size={14} />
          </button>
        </div>
      </div>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <button onClick={() => setSelectedYear(1999)} style={{ background: 'transparent', border: 'none', color: color, cursor: 'pointer', padding: '4px' }}><SkipBack size={20} /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={() => setSelectedYear(2024)} style={{ background: 'transparent', border: 'none', color: color, cursor: 'pointer', padding: '4px' }}><SkipForward size={20} /></button>
          <input type="range" min="1999" max="2024" value={selectedYear} onChange={(e) => { setSelectedYear(Number(e.target.value)); setIsPlaying(false); }} style={{ flex: 1, height: '6px', borderRadius: '3px', accentColor: '#3b82f6' }} />
          <div style={{ fontSize: '28px', fontWeight: '800', minWidth: '90px', textAlign: 'center', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {selectedYear}
          </div>
        </div>
        {currentData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: showChart ? '16px' : '0' }}>
            <div style={{ padding: '12px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>Population</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6' }}>{(currentData.population/1e6).toFixed(1)}M</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>GDP</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>${(currentData.gdp/1e3).toFixed(1)}B</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(139,92,246,0.1)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>GDP/Capita</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#8b5cf6' }}>${currentData.gdpPerCapita.toLocaleString()}</div>
            </div>
            <div style={{ padding: '12px', background: 'rgba(245,158,11,0.1)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>Density</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>{currentData.density}/km²</div>
            </div>
          </div>
        )}
        {showChart && timeData && (
          <div style={{ height: '250px', borderTop: '1px solid ' + borderColor, paddingTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                <XAxis dataKey="year" tick={{ fill: color, fontSize: 11 }} interval={4} />
                <YAxis yAxisId="left" tick={{ fill: '#3b82f6', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#10b981', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: bg, border: '1px solid ' + borderColor, borderRadius: '8px', color: color }} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="population" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPop)" name="Population" />
                <Area yAxisId="right" type="monotone" dataKey="gdp" stroke="#10b981" fillOpacity={1} fill="url(#colorGdp)" name="GDP (M)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
export default TimeSeriesPanel;
