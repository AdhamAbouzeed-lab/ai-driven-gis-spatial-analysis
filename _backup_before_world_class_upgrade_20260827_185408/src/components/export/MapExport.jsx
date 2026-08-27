import { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, FileImage, FileText, X } from 'lucide-react';
const MapExport = ({ onClose }) => {
  const [exporting, setExporting] = useState(false);
  const exportPNG = async () => {
    setExporting(true);
    const element = document.querySelector('.map-container') || document.body;
    const canvas = await html2canvas(element, { backgroundColor: '#0f172a', scale: 2 });
    const link = document.createElement('a');
    link.download = `adham-gis-map-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setExporting(false);
  };
  const exportPDF = async () => {
    setExporting(true);
    const { jsPDF } = await import('jspdf');
    const element = document.querySelector('.map-container') || document.body;
    const canvas = await html2canvas(element, { backgroundColor: '#0f172a', scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`adham-gis-report-${Date.now()}.pdf`);
    setExporting(false);
  };
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '20px', width: '320px',
      background: 'rgba(15,23,42,0.98)', backdropFilter: 'blur(10px)',
      borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)',
      padding: '20px', zIndex: 1000, color: '#fff',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Export Map</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>
      <button onClick={exportPNG} disabled={exporting} style={{
        width: '100%', padding: '12px', marginBottom: '8px',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        border: 'none', borderRadius: '8px', color: '#fff',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        fontSize: '14px', fontWeight: 500
      }}>
        <FileImage size={18} /> {exporting ? 'Exporting...' : 'Export as PNG'}
      </button>
      <button onClick={exportPDF} disabled={exporting} style={{
        width: '100%', padding: '12px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        border: 'none', borderRadius: '8px', color: '#fff',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        fontSize: '14px', fontWeight: 500
      }}>
        <FileText size={18} /> {exporting ? 'Exporting...' : 'Export as PDF'}
      </button>
      <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '12px', textAlign: 'center' }}>
        High-resolution export (2x scale)
      </p>
    </div>
  );
};
export default MapExport;
