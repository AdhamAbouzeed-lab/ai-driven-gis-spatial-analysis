import { useApp } from '../../context/AppContext';
import { X, Check, Trash2, Bell, Info, CheckCircle, AlertCircle } from 'lucide-react';

const NotificationsPanel = () => {
  const { theme, notifications, toggleNotifications, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications } = useApp();
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const border = theme === 'dark' ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)';
  const unread = notifications.filter(n => !n.read).length;
  const icons = { info: Info, success: CheckCircle, warning: AlertCircle, error: AlertCircle };
  const colors = { info: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444' };

  return (
    <div style={{ position: 'fixed', top: '80px', right: '20px', width: '380px', maxHeight: '500px', background: bg, backdropFilter: 'blur(10px)', borderRadius: '12px', border: `1px solid ${border}`, display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', zIndex: 1000, color }}>
      <div style={{ padding: '16px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={20} style={{ color: '#3b82f6' }} /><span style={{ fontWeight: 600 }}>Notifications</span>{unread > 0 && <span style={{ background: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px' }}>{unread}</span>}</div>
        <button onClick={toggleNotifications} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color }}><X size={18} /></button>
      </div>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${border}`, display: 'flex', gap: '8px' }}>
        <button onClick={markAllNotificationsAsRead} style={{ flex: 1, padding: '8px', background: 'rgba(59,130,246,0.1)', border: 'none', borderRadius: '6px', color, cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Check size={14} />Mark all read</button>
        <button onClick={clearNotifications} style={{ flex: 1, padding: '8px', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Trash2 size={14} />Clear all</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {notifications.length === 0 ? <div style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.6 }}><Bell size={32} style={{ marginBottom: '12px', opacity: 0.5 }} /><p>No notifications</p></div> : notifications.map(n => {
          const Icon = icons[n.type] || Info;
          const c = colors[n.type] || '#3b82f6';
          return (
            <div key={n.id} onClick={() => markNotificationAsRead(n.id)} style={{ padding: '12px', marginBottom: '8px', background: n.read ? 'transparent' : 'rgba(59,130,246,0.05)', borderRadius: '8px', border: n.read ? 'none' : `1px solid ${c}30`, cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${c}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: c }}><Icon size={16} /></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: n.read ? 400 : 600, marginBottom: '4px' }}>{n.title}</div><div style={{ fontSize: '12px', opacity: 0.8 }}>{n.message}</div><div style={{ fontSize: '11px', opacity: 0.6, marginTop: '6px' }}>{new Date(n.timestamp).toLocaleString()}</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPanel;
