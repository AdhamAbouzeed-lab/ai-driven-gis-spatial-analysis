import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X, Send } from 'lucide-react';
const AIChat = ({ onClose }) => {
  const { theme, selectedCountry, activeLayer } = useApp();
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hello! I can analyze spatial data. Ask me about population density, GDP, DSI scores, or development insights.' }
  ]);
  const [input, setInput] = useState('');
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  // Enhanced rule-based engine with spatial reasoning
  const generateResponse = (query) => {
    const q = query.toLowerCase();
    if (!selectedCountry) {
      return 'Please select a country on the map first so I can analyze its data.';
    }
    const c = selectedCountry;
    const dsi = c.dsi || 0;
    const density = c.popDensity || 0;
    const gdpPerCapita = c.gdpPerCapita || 0;
    // DSI queries
    if (q.includes('dsi') || q.includes('development') || q.includes('suitability')) {
      let level = dsi > 70 ? 'very high' : dsi > 50 ? 'high' : dsi > 30 ? 'moderate' : 'low';
      return `${c.name} has a DSI score of ${dsi.toFixed(1)}/100 (${level} development suitability). This is calculated from: 35% population density (${density}/km²) + 45% GDP per capita ($${gdpPerCapita.toLocaleString()}) + 20% territorial area (${c.area.toLocaleString()} km²).`;
    }
    // Density queries
    if (q.includes('density') || q.includes('population')) {
      let status = density > 100 ? 'very high' : density > 50 ? 'high' : density > 20 ? 'moderate' : 'low';
      return `${c.name} has a population density of ${density} people/km² (${status}). Total population: ${(c.population/1e6).toFixed(2)}M across ${c.area.toLocaleString()} km².`;
    }
    // GDP queries
    if (q.includes('gdp') || q.includes('economy') || q.includes('economic')) {
      let status = gdpPerCapita > 15000 ? 'high-income' : gdpPerCapita > 5000 ? 'upper-middle-income' : gdpPerCapita > 2000 ? 'lower-middle-income' : 'developing';
      return `${c.name} is classified as ${status} with GDP per capita of $${gdpPerCapita.toLocaleString()}. Total GDP: $${(c.gdp/1000).toFixed(1)}B.`;
    }
    // Comparison/analysis
    if (q.includes('compare') || q.includes('rank') || q.includes('best')) {
      return `Based on current indicators, ${c.name} scores ${dsi.toFixed(1)}/100 on DSI. ${dsi > 50 ? 'It shows strong development potential with balanced economic and demographic indicators.' : 'There is significant room for development, particularly in ' + (gdpPerCapita < 5000 ? 'economic growth' : 'population distribution') + '.'}`;
    }
    // Risk
    if (q.includes('risk') || q.includes('challenge') || q.includes('problem')) {
      const risks = [];
      if (density > 80) risks.push('high population pressure on infrastructure');
      if (gdpPerCapita < 3000) risks.push('economic vulnerability');
      if (c.area > 1000000 && density < 10) risks.push('territorial governance challenges');
      return risks.length > 0 ? `Key risks for ${c.name}: ${risks.join(', ')}.` : `${c.name} shows a balanced risk profile with manageable challenges.`;
    }
    // Default with spatial context
    return `About ${c.name}: Population ${(c.population/1e6).toFixed(2)}M, GDP per capita $${gdpPerCapita.toLocaleString()}, density ${density}/km², DSI ${dsi.toFixed(1)}/100. Ask me about specific indicators like "DSI", "density", "GDP", or "risks".`;
  };
  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    const aiMsg = { from: 'ai', text: generateResponse(input) };
    setMessages([...messages, userMsg, aiMsg]);
    setInput('');
  };
  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px',
      width: '380px', height: '500px',
      background: bg, backdropFilter: 'blur(12px)',
      borderRadius: '12px', border: '1px solid ' + borderColor,
      padding: '0', zIndex: 100, color: color,
      boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 16px',
        borderBottom: '1px solid ' + borderColor,
        background: 'rgba(59,130,246,0.1)'
      }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} /> Spatial Analysis Assistant
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
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            padding: '10px 14px',
            background: msg.from === 'user' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
            border: '1px solid ' + borderColor,
            borderRadius: '12px',
            fontSize: '13px',
            lineHeight: '1.5'
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={{ padding: '12px', borderTop: '1px solid ' + borderColor, display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about DSI, density, GDP, risks..."
          style={{
            flex: 1, padding: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid ' + borderColor,
            borderRadius: '8px',
            color: color, fontSize: '13px', outline: 'none'
          }}
        />
        <button onClick={handleSend} style={{
          padding: '10px 14px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          border: 'none', borderRadius: '8px',
          color: '#fff', cursor: 'pointer'
        }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
export default AIChat;
