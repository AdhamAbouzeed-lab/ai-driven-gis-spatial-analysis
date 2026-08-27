import { useApp } from '../../context/AppContext';
import { X, Layout, Map, BarChart3, Search, Bell, MessageSquare, Globe, Info } from 'lucide-react';
import { useState } from 'react';

const SettingsPanel = () => {
  const { theme, toggleSettings, toggleTheme } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const border = theme === 'dark' ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)';

  const tabs = [
    { id: 'general', name: 'General', icon: Layout },
    { id: 'map', name: 'Map', icon: Map },
    { id: 'analysis', name: 'Analysis', icon: BarChart3 },
    { id: 'search', name: 'Search', icon: Search },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'ai', name: 'AI', icon: MessageSquare },
    { id: 'language', name: 'Language', icon: Globe },
    { id: 'about', name: 'About', icon: Info }
  ];

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '90vw', height: '600px', maxHeight: '90vh', background: bg, backdropFilter: 'blur(10px)', borderRadius: '12px', border: `1px solid ${border}`, display: 'flex', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', zIndex: 1000, color }}>
      <div style={{ width: '200px', borderRight: `1px solid ${border}`, padding: '16px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}><h2 style={{ fontSize: '18px', fontWeight: 600 }}>Settings</h2><button onClick={toggleSettings} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color }}><X size={18} /></button></div>
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', marginBottom: '4px', background: activeTab === t.id ? 'rgba(59,130,246,0.2)' : 'transparent', border: 'none', borderRadius: '6px', color, cursor: 'pointer', fontSize: '13px', textAlign: 'left' }}>
              <Icon size={16} />{t.name}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {activeTab === 'general' && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>General Settings</h3>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Theme</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => theme === 'light' && toggleTheme()} style={{ flex: 1, padding: '12px', background: theme === 'light' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: `2px solid ${theme === 'light' ? '#3b82f6' : border}`, borderRadius: '8px', color, cursor: 'pointer' }}>Light Mode</button>
                <button onClick={() => theme === 'dark' && toggleTheme()} style={{ flex: 1, padding: '12px', background: theme === 'dark' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: `2px solid ${theme === 'dark' ? '#3b82f6' : border}`, borderRadius: '8px', color, cursor: 'pointer' }}>Dark Mode</button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'about' && (
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>About ADHAM GIS AI</h3>
            <div style={{ padding: '20px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#fff' }}>AA</div>
                <div><h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>Adham Abouzeed</h4><p style={{ fontSize: '13px', opacity: 0.8 }}>GIS Specialist & AI Developer</p></div>
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>Professional GIS analyst specializing in spatial analysis, machine learning applications, and geospatial AI systems.</p>
              <a href="https://wa.me/201061607075" target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', background: '#25D366', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>WhatsApp Contact</a>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}><p><b>Version:</b> 2.0.0</p><p><b>Build Date:</b> August 2026</p></div>
          </div>
        )}
        {activeTab !== 'general' && activeTab !== 'about' && <div><h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px' }}>{tabs.find(t => t.id === activeTab)?.name} Settings</h3><p style={{ fontSize: '13px', opacity: 0.7 }}>Settings for this section are under development.</p></div>}
      </div>
    </div>
  );
};

export default SettingsPanel;
