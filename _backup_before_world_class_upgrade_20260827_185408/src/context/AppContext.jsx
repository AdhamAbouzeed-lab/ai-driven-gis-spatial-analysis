import { createContext, useContext, useState, useEffect, useCallback } from 'react';
const AppContext = createContext();
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeLayer, setActiveLayer] = useState('population');
  const [visibleLayers, setVisibleLayers] = useState(['population']);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // Real map state - will be updated by MapComponent
  const [mapState, setMapState] = useState({
    zoom: 2.8,
    center: [-60, -15],
    bearing: 0,
    pitch: 0
  });
  const [notifications] = useState([
    { id: 1, title: 'Welcome to ADHAM GIS AI', message: 'System initialized', type: 'info', read: false, timestamp: new Date() },
    { id: 2, title: 'Data Loaded', message: '25 countries with real boundaries', type: 'success', read: false, timestamp: new Date() }
  ]);
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const updateMapState = useCallback((newState) => {
    setMapState(prev => ({ ...prev, ...newState }));
  }, []);
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLeftSidebar = () => setLeftSidebarOpen(prev => !prev);
  const toggleRightSidebar = () => setRightSidebarOpen(prev => !prev);
  const toggleAiChat = () => setAiChatOpen(prev => !prev);
  const toggleSettings = () => setSettingsOpen(prev => !prev);
  const toggleNotifications = () => setNotificationsOpen(prev => !prev);
  const value = {
    theme, setTheme, toggleTheme,
    selectedCountry, setSelectedCountry,
    activeLayer, setActiveLayer,
    visibleLayers, setVisibleLayers,
    mapState, updateMapState,
    leftSidebarOpen, rightSidebarOpen, aiChatOpen, settingsOpen, notificationsOpen,
    toggleLeftSidebar, toggleRightSidebar, toggleAiChat, toggleSettings, toggleNotifications,
    searchQuery, setSearchQuery, searchResults, setSearchResults,
    notifications
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
