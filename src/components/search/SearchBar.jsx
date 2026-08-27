import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin } from 'lucide-react';
const SearchBar = () => {
  const { theme, searchQuery, setSearchQuery, setSearchResults } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [countriesData, setCountriesData] = useState(null);
  useEffect(() => {
    fetch('/latamCountries.json')
      .then(res => res.json())
      .then(data => setCountriesData(data.features))
      .catch(err => console.error('Failed to load countries for search', err));
  }, []);
  useEffect(() => {
    if (!countriesData || !searchQuery) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = countriesData.filter(f => 
      f.properties.name.toLowerCase().includes(query) || 
      f.properties.capital.toLowerCase().includes(query)
    ).slice(0, 5);
    setSearchResults(results);
    setIsOpen(results.length > 0);
  }, [searchQuery, countriesData, setSearchResults]);
  const handleSelect = (feature) => {
    setSearchQuery(feature.properties.name);
    setIsOpen(false);
    // Trigger a custom event to fly to the country
    window.dispatchEvent(new CustomEvent('flyToCountry', { detail: feature }));
  };
  const bg = theme === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)';
  const color = theme === 'dark' ? '#fff' : '#000';
  const borderColor = theme === 'dark' ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.5)';
  return (
    <div style={{ position: 'relative', width: '300px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        border: '1px solid ' + borderColor,
        borderRadius: '8px', padding: '8px 12px'
      }}>
        <Search size={16} style={{ color: color, opacity: 0.6 }} />
        <input
          type="text"
          placeholder="Search country or capital..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setIsOpen(true)}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: color, fontSize: '14px'
          }}
        />
      </div>
      {isOpen && searchResults.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
          background: bg, backdropFilter: 'blur(12px)',
          border: '1px solid ' + borderColor, borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)', zIndex: 1000, overflow: 'hidden'
        }}>
          {searchResults.map((f, idx) => (
            <div key={idx} onClick={() => handleSelect(f)} style={{
              padding: '12px', cursor: 'pointer',
              borderBottom: idx < searchResults.length - 1 ? '1px solid ' + borderColor : 'none',
              display: 'flex', alignItems: 'center', gap: '10px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <MapPin size={16} color="#3b82f6" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: color }}>{f.properties.name}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>Capital: {f.properties.capital}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SearchBar;
