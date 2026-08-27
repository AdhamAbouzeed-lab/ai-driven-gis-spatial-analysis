import { useApp } from '../../context/AppContext';
import SearchBar from '../search/SearchBar';
import { Sun, Moon, Bell, Settings, MessageSquare, PanelLeftClose, PanelRightClose, PanelLeft, PanelRight, Download, Sliders, Layers, BookOpen, Ruler, Save, FolderOpen, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const TopBar = ({ onBaseMapsClick, onExportClick, onFiltersClick, onResearchClick, onMeasureClick, onDownloadClick, onProjectClick }) => {
  const { theme, toggleTheme, toggleAiChat, toggleSettings, toggleNotifications, toggleLeftSidebar, toggleRightSidebar, leftSidebarOpen, rightSidebarOpen, notifications } = useApp();
  const { t, i18n } = useTranslation();
  const unread = notifications.filter(n => !n.read).length;
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const border = theme === 'dark' ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)';
  const btnStyle = { background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '6px', color, display: 'flex', alignItems: 'center' };
  return (
    <div style={{ height: '60px', background: bg, backdropFilter: 'blur(10px)', borderBottom: '1px solid ' + border, display: 'flex', alignItems: 'center', padding: '0 20px', gap: '12px', color, position: 'relative', zIndex: 1000 }}>
      <button onClick={toggleLeftSidebar} style={btnStyle}>{leftSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}</button>
      <div style={{ fontSize: '18px', fontWeight: 700, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginRight: '12px' }}>{t('ADHAM GIS AI')}</div>
      <SearchBar />
      <div style={{ flex: 1 }} />
      <select onChange={(e) => changeLanguage(e.target.value)} defaultValue="en" style={{
        padding: '6px 12px', borderRadius: '6px', border: '1px solid ' + border,
        background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        color: color, cursor: 'pointer', fontSize: '13px'
      }}>
        <option value="en">🇬🇧 EN</option>
        <option value="ar">🇸🇦 AR</option>
        <option value="es">🇪 ES</option>
      </select>
      <button onClick={onDownloadClick} style={btnStyle} title={t('Download Data')}><Download size={20} /></button>
      <button onClick={onProjectClick} style={btnStyle} title={t('Save Project')}><Save size={20} /></button>
      <button onClick={onMeasureClick} style={btnStyle} title={t('Measure')}><Ruler size={20} /></button>
      <button onClick={onResearchClick} style={btnStyle} title={t('Research')}><BookOpen size={20} /></button>
      <button onClick={onBaseMapsClick} style={btnStyle} title={t('Base Maps')}><Layers size={20} /></button>
      <button onClick={onFiltersClick} style={btnStyle} title={t('Filters')}><Sliders size={20} /></button>
      <button onClick={onExportClick} style={btnStyle} title={t('Export')}><Download size={20} /></button>
      <button onClick={toggleTheme} style={btnStyle}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
      <button onClick={toggleNotifications} style={{...btnStyle, position: 'relative'}}>
        <Bell size={20} />
        {unread > 0 && <span style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 600, padding: '2px 5px', borderRadius: '10px' }}>{unread}</span>}
      </button>
      <button onClick={toggleSettings} style={btnStyle}><Settings size={20} /></button>
      <button onClick={toggleAiChat} style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '6px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}><MessageSquare size={18} /> {t('AI Chat')}</button>
      <button onClick={toggleRightSidebar} style={btnStyle}>{rightSidebarOpen ? <PanelRightClose size={20} /> : <PanelRight size={20} />}</button>
    </div>
  );
};
export default TopBar;
