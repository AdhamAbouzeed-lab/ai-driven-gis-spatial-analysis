import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, FileJson, Map as MapIcon, Globe, Table, X } from 'lucide-react';
import { saveAs } from 'file-saver';
const DataDownloadCenter = ({ onClose }) => {
  const { theme, selectedCountry } = useApp();
  const [downloading, setDownloading] = useState(false);
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  const downloadData = async (format) => {
    if (!selectedCountry) return;
    setDownloading(true);
    try {
      const response = await fetch('/latamCountries.json');
      const data = await response.json();
      const countryData = data.features.find(f => f.properties.name === selectedCountry.name);
      let content, mimeType, filename;
      switch(format) {
        case 'geojson':
          content = JSON.stringify(countryData, null, 2);
          mimeType = 'application/geo+json';
          filename = `${selectedCountry.name.toLowerCase().replace(/\s+/g, '-')}.geojson`;
          break;
        case 'kml':
          const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${selectedCountry.name}</name>
    <Placemark>
      <name>${selectedCountry.name}</name>
      <description>
        Capital: ${selectedCountry.capital}&lt;br/&gt;
        Population: ${selectedCountry.population}&lt;br/&gt;
        GDP: $${selectedCountry.gdp}M&lt;br/&gt;
        Area: ${selectedCountry.area} km²
      </description>
      ${JSON.stringify(countryData.geometry).replace(/"coordinates"/g, '<coordinates>')}</Placemark>
  </Document>
</kml>`;
          content = kml;
          mimeType = 'application/vnd.google-earth.kml+xml';
          filename = `${selectedCountry.name.toLowerCase().replace(/\s+/g, '-')}.kml`;
          break;
        case 'csv':
          const csv = `Property,Value\nName,${selectedCountry.name}\nCapital,${selectedCountry.capital}\nPopulation,${selectedCountry.population}\nGDP (M USD),${selectedCountry.gdp}\nArea (km²),${selectedCountry.area}\nDensity (/km²),${selectedCountry.popDensity}`;
          content = csv;
          mimeType = 'text/csv';
          filename = `${selectedCountry.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
          break;
        default:
          content = JSON.stringify(countryData, null, 2);
          mimeType = 'application/geo+json';
          filename = `${selectedCountry.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      }
      const blob = new Blob([content], { type: mimeType });
      saveAs(blob, filename);
    } catch (error) {
      console.error('Download error:', error);
    }
    setDownloading(false);
  };
  const formats = [
    { id: 'geojson', name: 'GeoJSON', icon: FileJson, desc: 'Standard GIS format', color: '#3b82f6' },
    { id: 'kml', name: 'KML', icon: Globe, desc: 'Google Earth format', color: '#10b981' },
    { id: 'csv', name: 'CSV', icon: Table, desc: 'Tabular data', color: '#f59e0b' }
  ];
  return (
    <div style={{
      position: 'fixed', top: '80px', right: '20px',
      width: '340px',
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
          <Download size={16} /> Download Data
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
      <div style={{ padding: '16px' }}>
        {selectedCountry ? (
          <>
            <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{selectedCountry.name}</div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>Ready to download</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {formats.map(fmt => {
                const Icon = fmt.icon;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => downloadData(fmt.id)}
                    disabled={downloading}
                    style={{
                      padding: '14px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid ' + borderColor,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      opacity: downloading ? 0.6 : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => !downloading && (e.currentTarget.style.background = 'rgba(59,130,246,0.1)')}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '8px',
                      background: fmt.color + '20',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: fmt.color
                    }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{fmt.name}</div>
                      <div style={{ fontSize: '11px', opacity: 0.7 }}>{fmt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.7 }}>
            <MapIcon size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <div>Select a country to download data</div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DataDownloadCenter;
