import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Bot, User } from 'lucide-react';

const AIChat = () => {
  const { theme, toggleAiChat, selectedCountry, activeLayer } = useApp();
  const [messages, setMessages] = useState([{ id: 1, role: 'assistant', content: 'Hello! I\'m your GIS AI assistant. Ask me about population, GDP, or specific countries.', timestamp: new Date() }]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', content: input, timestamp: new Date() };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setTimeout(() => {
      let response = 'I understand your query. Based on the current map context, I can provide insights about the selected region.';
      const q = input.toLowerCase();
      if (q.includes('population') && selectedCountry) response = `${selectedCountry.name} has a population of ${selectedCountry.population ? (selectedCountry.population/1e6).toFixed(1)+' million' : 'N/A'}.`;
      else if (q.includes('gdp') && selectedCountry) response = `${selectedCountry.name} shows a GDP of ${selectedCountry.gdp ? '$'+selectedCountry.gdp+' million' : 'N/A'}.`;
      else if (q.includes('help')) response = 'I can help with:\n• Spatial analysis\n• Country comparisons\n• Data interpretation\n• Map navigation\n\nTry asking about population, GDP, or specific countries.';
      setMessages(p => [...p, { id: Date.now()+1, role: 'assistant', content: response, timestamp: new Date() }]);
    }, 800);
  };

  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const border = theme === 'dark' ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)';

  return (
    <div style={{ position: 'fixed', right: '20px', bottom: '20px', width: '400px', height: '600px', background: bg, backdropFilter: 'blur(10px)', borderRadius: '12px', border: `1px solid ${border}`, display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', zIndex: 1000, color }}>
      <div style={{ padding: '16px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Bot size={20} style={{ color: '#3b82f6' }} /><span style={{ fontWeight: 600 }}>GIS AI Assistant</span></div>
        <button onClick={toggleAiChat} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color }}><X size={18} /></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', marginBottom: '16px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: m.role === 'user' ? '#3b82f6' : '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{m.role === 'user' ? <User size={16} color="#fff" /> : <Bot size={16} color="#fff" />}</div>
            <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: '12px', background: m.role === 'user' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{m.content}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '16px', borderTop: `1px solid ${border}` }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about GIS analysis..." style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${border}`, borderRadius: '8px', color, fontSize: '13px', outline: 'none' }} />
          <button onClick={handleSend} style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Send size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
