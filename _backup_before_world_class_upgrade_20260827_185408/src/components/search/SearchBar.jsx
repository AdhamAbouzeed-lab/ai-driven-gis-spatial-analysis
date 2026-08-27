import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Building2, Globe } from 'lucide-react';
const SearchBar = () => {
  const { theme, searchQuery, setSearchQuery, setSearchResults } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [allData, setAllData] = useState({ countries: [], divisions: [], capitals: [] });
  useEffect(() => {
    Promise.all([
      fetch('/latamCountries.json').then(r => r.json()),
      fetch('/capitals.json').then(r => r.json()),
      fetch('/data/administrativeDivisions.json').then(r => r.json())
    ]).then(([countries, capitals, divisions]) => {
      setAllData({
        countries: countries.features || [],
        divisions: divisions.features || [],
        capitals: capitals.features || []
      });
    }).catch(err => console.error('Failed to load search data', err));
  }, []);
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = [];
    allData.countries.forEach(f => {
      const name = (f.properties.name || '').toLowerCase();
      const capital = (f.properties.capital || '').toLowerCase();
      if (name.includes(query) || capital.includes(query)) {
        results.push({ type: 'country', name: f.properties.name, subtitle: 'Country - Capital: ' + f.properties.capital, feature: f, icon: Globe });
      }
    });
    allData.divisions.forEach(f => {
      const name = (f.properties.name || '').toLowerCase();
      const country = (f.properties.country || '').toLowerCase();
      if (name.includes(query) || country.includes(query)) {
        results.push({ type: 'division', name: f.properties.name, subtitle: (f.properties.type || 'Region') + ' - ' + f.properties.country, feature: f, icon: Building2 });
      }
    });
    allData.capitals.forEach(f => {
      const name = (f.properties.name || '').toLowerCase();
      const country = (f.properties.country || '').toLowerCase();
      if (name.includes(query)) {
        results.push({ type: 'capital', name: f.properties.name, subtitle: 'Capital of ' + country, feature: f, icon: MapPin });
      }
    });
    setSearchResults(results.slice(0, 8));
    setIsOpen(results.length > 0);
  }, [searchQuery, allData, setSearchResults]);
  const handleSelect = (result) => {
    setSearchQuery(result.name);
    setIsOpen(false);
    if (result.type === 'country' || result.type === 'division') {
      const coords = result.feature.geometry.coordinates[0];
      const bounds = new window.maplibregl.LngLatBounds(coords[0], coords[0]);
      coords.forEach(c => bounds.extend(c));
      window.dispatchEvent(new CustomEvent('flyToBounds', { detail: { bounds: bounds, padding: 50, maxZoom: 8, duration: 1500 } }));
    } else if (result.type === 'capital') {
      const coords = result.feature.geometry.coordinates;
      window.dispatchEvent(new CustomEvent('flyToLocation', { detail: { center: coords, zoom: 10, duration: 1500 } }));
    }
  };
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  return (
    <div style={{ position: 'relative', width: '350px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', border: '1px solid ' + borderColor, borderRadius: '8px', padding: '8px 12px' }}>
        <Search size={16} style={{ color: color, opacity: 0.6 }} />
        <input type="text" placeholder="Search countries, states, capitals..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: color, fontSize: '14px' }} />
      </div>
      {isOpen && searchResults.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: bg, backdropFilter: 'blur(12px)', border: '1px solid ' + borderColor, borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.4)', zIndex: 1000, overflow: 'hidden', maxHeight: '400px', overflowY: 'auto' }}>
          {searchResults.map((result, idx) => {
            const Icon = result.icon;
            return (
              <div key={idx} onClick={() => handleSelect(result)} style={{ padding: '12px', cursor: 'pointer', borderBottom: idx < searchResults.length - 1 ? '1px solid ' + borderColor : 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: color }}>{result.name}</div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>{result.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default SearchBar;
