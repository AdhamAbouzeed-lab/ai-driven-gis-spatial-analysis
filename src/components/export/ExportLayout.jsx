import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, FileImage, FileText, X, Layout, Scale, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
const ExportLayout = ({ onClose }) => {
  const { theme, selectedCountry } = useApp();
  const [exporting, setExporting] = useState(false);
  const [layout, setLayout] = useState({
    showLegend: true, showScale: true, showNorthArrow: true,
    showTitle: true, title: 'ADHAM GIS AI - Spatial Analysis', format: 'pdf'
  });
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  const exportMap = async () => {
    setExporting(true);
    try {
      const mapElement = document.querySelector('.map-container');
      const canvas = await html2canvas(mapElement, { backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc', scale: 3, useCORS: true, allowTaint: true });
      if (layout.format === 'png') {
        const link = document.createElement('a');
        link.download = 'adham-gis-export-' + Date.now() + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
        if (layout.showTitle) { pdf.setFontSize(16); pdf.setTextColor(59, 130, 246); pdf.text(layout.title, pdfWidth / 2, 15, { align: 'center' }); }
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pdfWidth - canvas.width * ratio) / 2, 20, canvas.width * ratio, canvas.height * ratio);
        if (layout.showScale) { pdf.setFontSize(10); pdf.setTextColor(100, 100, 100); pdf.text('Scale: 1:5,000,000', 15, pdfHeight - 10); }
        if (layout.showLegend && selectedCountry) { pdf.setFontSize(10); pdf.setTextColor(0, 0, 0); pdf.text('Country: ' + selectedCountry.name, pdfWidth - 85, pdfHeight - 10); }
        pdf.save('adham-gis-report-' + Date.now() + '.pdf');
      }
    } catch (error) { console.error('Export error:', error); }
    setExporting(false);
  };
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
          <Layout size={16} /> Export Layout
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
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px', display: 'block' }}>Export Format</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button onClick={() => setLayout({...layout, format: 'pdf'})} style={{
              padding: '10px', background: layout.format === 'pdf' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
              border: '1px solid ' + (layout.format === 'pdf' ? '#3b82f6' : borderColor),
              borderRadius: '8px', color: color, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px'
            }}><FileText size={16} /> PDF</button>
            <button onClick={() => setLayout({...layout, format: 'png'})} style={{
              padding: '10px', background: layout.format === 'png' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
              border: '1px solid ' + (layout.format === 'png' ? '#3b82f6' : borderColor),
              borderRadius: '8px', color: color, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px'
            }}><FileImage size={16} /> PNG</button>
          </div>
        </div>
        {layout.format === 'pdf' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px', display: 'block' }}>Map Title</label>
            <input type="text" value={layout.title} onChange={(e) => setLayout({...layout, title: e.target.value})}
              style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + borderColor, borderRadius: '6px', color: color, fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
        )}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', opacity: 0.8, marginBottom: '12px', display: 'block' }}>Map Elements</label>
          {[{ key: 'showTitle', label: 'Title' }, { key: 'showLegend', label: 'Legend' }, { key: 'showScale', label: 'Scale Bar', icon: Scale }, { key: 'showNorthArrow', label: 'North Arrow', icon: Compass }].map(item => (
            <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', marginBottom: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', cursor: 'pointer' }}>
              <input type="checkbox" checked={layout[item.key]} onChange={(e) => setLayout({...layout, [item.key]: e.target.checked})} style={{ accentColor: '#3b82f6' }} />
              {item.icon && <item.icon size={16} style={{ opacity: 0.7 }} />}
              <span style={{ fontSize: '13px' }}>{item.label}</span>
            </label>
          ))}
        </div>
        <button onClick={exportMap} disabled={exporting} style={{
          width: '100%', padding: '12px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          border: 'none', borderRadius: '8px', color: '#fff',
          fontWeight: 600, cursor: 'pointer', fontSize: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          opacity: exporting ? 0.7 : 1
        }}>
          <Download size={18} /> {exporting ? 'Exporting...' : 'Export Map'}
        </button>
      </div>
    </div>
  );
};
export default ExportLayout;
