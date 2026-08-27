import { useRef, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import MapComponent from './components/map/MapComponent';
import LeftSidebar from './components/layout/LeftSidebar';
import RightSidebar from './components/layout/RightSidebar';
import TopBar from './components/layout/TopBar';
import AIChat from './components/ai/AIChat';
import NotificationsPanel from './components/notifications/NotificationsPanel';
import SettingsPanel from './components/settings/SettingsPanel';
import TimeSeriesPanel from './components/timeSeries/TimeSeriesPanel';
import BaseMapsSwitcher from './components/basemaps/BaseMapsSwitcher';
import ExportLayout from './components/export/ExportLayout';
import AdvancedFilters from './components/filters/AdvancedFilters';
import DynamicLegend from './components/legend/DynamicLegend';
import ResearchPanel from './components/research/ResearchPanel';
import MeasurementTools from './components/measurement/MeasurementTools';
import DataDownloadCenter from './components/download/DataDownloadCenter';
import ProjectManager from './components/project/ProjectManager';
import SpatialQueryEngine from './components/query/SpatialQueryEngine';
import HeatmapLayer from './components/map/HeatmapLayer';
import './i18n/config';
const AppContent = () => {
  const { leftSidebarOpen, rightSidebarOpen, aiChatOpen, notificationsOpen, settingsOpen, theme, selectedCountry, visibleLayers } = useApp();
  const [baseMapsOpen, setBaseMapsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const [measureOpen, setMeasureOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [queryOpen, setQueryOpen] = useState(false);
  const [timeSeriesOpen, setTimeSeriesOpen] = useState(false);
  const [highlightedCountries, setHighlightedCountries] = useState([]);
  const mapRef = useRef(null);
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: theme === 'dark' ? '#0f172a' : '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}>
      <TopBar 
        onBaseMapsClick={() => { setBaseMapsOpen(!baseMapsOpen); setExportOpen(false); setFiltersOpen(false); setResearchOpen(false); setMeasureOpen(false); setDownloadOpen(false); setProjectOpen(false); setQueryOpen(false); }}
        onExportClick={() => { setExportOpen(!exportOpen); setBaseMapsOpen(false); setFiltersOpen(false); setResearchOpen(false); setMeasureOpen(false); setDownloadOpen(false); setProjectOpen(false); setQueryOpen(false); }}
        onFiltersClick={() => { setFiltersOpen(!filtersOpen); setBaseMapsOpen(false); setExportOpen(false); setResearchOpen(false); setMeasureOpen(false); setDownloadOpen(false); setProjectOpen(false); setQueryOpen(false); }}
        onResearchClick={() => { setResearchOpen(!researchOpen); setBaseMapsOpen(false); setExportOpen(false); setFiltersOpen(false); setMeasureOpen(false); setDownloadOpen(false); setProjectOpen(false); setQueryOpen(false); }}
        onMeasureClick={() => { setMeasureOpen(!measureOpen); setBaseMapsOpen(false); setExportOpen(false); setFiltersOpen(false); setResearchOpen(false); setDownloadOpen(false); setProjectOpen(false); setQueryOpen(false); }}
        onDownloadClick={() => { setDownloadOpen(!downloadOpen); setBaseMapsOpen(false); setExportOpen(false); setFiltersOpen(false); setResearchOpen(false); setMeasureOpen(false); setProjectOpen(false); setQueryOpen(false); }}
        onProjectClick={() => { setProjectOpen(!projectOpen); setBaseMapsOpen(false); setExportOpen(false); setFiltersOpen(false); setResearchOpen(false); setMeasureOpen(false); setDownloadOpen(false); setQueryOpen(false); }}
        onQueryClick={() => { setQueryOpen(!queryOpen); setBaseMapsOpen(false); setExportOpen(false); setFiltersOpen(false); setResearchOpen(false); setMeasureOpen(false); setDownloadOpen(false); setProjectOpen(false); }}
      />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {leftSidebarOpen && <LeftSidebar />}
        {baseMapsOpen && <BaseMapsSwitcher onClose={() => setBaseMapsOpen(false)} />}
        {exportOpen && <ExportLayout onClose={() => setExportOpen(false)} />}
        {filtersOpen && <AdvancedFilters onClose={() => setFiltersOpen(false)} />}
        {researchOpen && <ResearchPanel onClose={() => setResearchOpen(false)} />}
        {measureOpen && <MeasurementTools map={mapRef.current} onClose={() => setMeasureOpen(false)} />}
        {downloadOpen && <DataDownloadCenter onClose={() => setDownloadOpen(false)} />}
        {projectOpen && <ProjectManager onClose={() => setProjectOpen(false)} mapRef={mapRef} />}
        {queryOpen && <SpatialQueryEngine onClose={() => setQueryOpen(false)} onQueryResult={setHighlightedCountries} />}
        <div className="map-container" style={{ flex: 1, position: 'relative' }}>
          <MapComponent onMapReady={(m) => mapRef.current = m} highlightedCountries={highlightedCountries} />
          <HeatmapLayer map={mapRef.current} visible={visibleLayers.includes('heatmap')} />
        </div>
        {rightSidebarOpen && <RightSidebar />}
      </div>
      <DynamicLegend />
      {timeSeriesOpen && <TimeSeriesPanel onClose={() => setTimeSeriesOpen(false)} />}
      {!timeSeriesOpen && selectedCountry && (
        <button onClick={() => setTimeSeriesOpen(true)} style={{ position: 'fixed', bottom: '20px', left: '20px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '50px', padding: '12px 20px', color: '#fff', cursor: 'pointer', zIndex: 100, boxShadow: '0 8px 24px rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, border: 'none' }}> Open Time Series</button>
      )}
      {aiChatOpen && <AIChat onClose={() => {}} />}
      {notificationsOpen && <NotificationsPanel />}
      {settingsOpen && <SettingsPanel />}
    </div>
  );
};
function App() {
  return <AppProvider><AppContent /></AppProvider>;
}
export default App;
