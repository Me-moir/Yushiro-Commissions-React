import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import SideBar from './components/SideBar';
import TopNavigation from './components/TopNavigation';
import MenuContent from './components/MenuContent';
import PriceListContent from './components/PriceListContent';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('MENU');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [isUserInitiatedNavigation, setIsUserInitiatedNavigation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({});
  const [isNavExpanded, setIsNavExpanded] = useState(false); 
  const contentRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const subsectionToSection = useMemo(() => ({
    'maintenance-daily': 'maintenance',
    'maintenance-monthly': 'maintenance',
    'maintenance-patch': 'maintenance',
    'resin-promo': 'resin',
    'resin-leylines': 'resin',
    'resin-normal': 'resin',
    'resin-weekly': 'resin',
    'material-specialty': 'Material Farming',
    'material-crafting': 'Material Farming',
    'material-forging': 'Material Farming',
    'special-oculi': 'Special Offerings',
    'special-sigils': 'Special Offerings',
    'special-offerings': 'Special Offerings',
    'ascension-character': 'Ascension',
    'ascension-weapon': 'Ascension',
    'ascension-talent': 'Ascension'
  }), []);
  
  const findParentSection = useCallback((subsectionId) => {
    return subsectionToSection[subsectionId] || subsectionId.split('-')[0];
  }, [subsectionToSection]);

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setSidebarOpen(!isMobileView);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    let scrollTimeout;
    let lastScrollY = 0;
    
    const updateActiveSection = () => {
      if (!contentRef.current || activeView !== 'PRICE LIST' || isUserInitiatedNavigation) return;
      
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const scrollMid = scrollY + (windowHeight / 2);
      
      const sections = contentRef.current.querySelectorAll('.content-section');
      const subsections = contentRef.current.querySelectorAll('.subsection');
      
      const viewportTop = scrollY;
      const viewportBottom = scrollY + windowHeight;
      const inViewportElements = [];
      
      subsections.forEach(subsection => {
        const offsetTop = subsection.offsetTop;
        const offsetBottom = offsetTop + subsection.offsetHeight;
        const id = subsection.getAttribute('id');
        
        const containsViewportCenter = offsetTop <= scrollMid && offsetBottom > scrollMid;
        const isInViewport = !(offsetBottom < viewportTop || offsetTop > viewportBottom);
        const isApproachingBottom = offsetTop <= (viewportBottom - windowHeight * 0.4) && offsetBottom > viewportTop;
        
        if (isInViewport || isApproachingBottom) {
          const visibleTop = Math.max(offsetTop, viewportTop);
          const visibleBottom = Math.min(offsetBottom, viewportBottom);
          const visibleHeight = visibleBottom - visibleTop;
          const percentOfViewport = visibleHeight / windowHeight;
          
          inViewportElements.push({
            id,
            offsetTop,
            offsetBottom,
            isSubsection: true,
            containsViewportCenter,
            isApproachingBottom,
            percentOfViewport,
            distanceFromCenter: Math.abs((offsetTop + offsetBottom) / 2 - scrollMid)
          });
        }
      });
      
      sections.forEach(section => {
        const offsetTop = section.offsetTop;
        const offsetBottom = offsetTop + section.offsetHeight;
        const id = section.getAttribute('id');
        
        const containsViewportCenter = offsetTop <= scrollMid && offsetBottom > scrollMid;
        const isInViewport = !(offsetBottom < viewportTop || offsetTop > viewportBottom);
        const isApproachingBottom = offsetTop <= (viewportBottom - windowHeight * 0.4) && offsetBottom > viewportTop;
        
        if (isInViewport || isApproachingBottom) {
          const visibleTop = Math.max(offsetTop, viewportTop);
          const visibleBottom = Math.min(offsetBottom, viewportBottom);
          const visibleHeight = visibleBottom - visibleTop;
          const percentOfViewport = visibleHeight / windowHeight;
          
          inViewportElements.push({
            id,
            offsetTop,
            offsetBottom,
            isSubsection: false,
            containsViewportCenter,
            isApproachingBottom,
            percentOfViewport,
            distanceFromCenter: Math.abs((offsetTop + offsetBottom) / 2 - scrollMid)
          });
        }
      });
      
      let activeElement = null;
      const centerElements = inViewportElements.filter(el => el.containsViewportCenter);
      
      if (centerElements.length > 0) {
        const subsectionCenterElements = centerElements.filter(el => el.isSubsection);
        if (subsectionCenterElements.length > 0) {
          subsectionCenterElements.sort((a, b) => b.percentOfViewport - a.percentOfViewport);
          activeElement = subsectionCenterElements[0];
        } else {
          centerElements.sort((a, b) => b.percentOfViewport - a.percentOfViewport);
          activeElement = centerElements[0];
        }
      } else {
        const approachingElements = inViewportElements.filter(el => el.isApproachingBottom);
        if (approachingElements.length > 0) {
          const approachingSubsections = approachingElements.filter(el => el.isSubsection);
          if (approachingSubsections.length > 0) {
            approachingSubsections.sort((a, b) => b.offsetBottom - a.offsetBottom);
            activeElement = approachingSubsections[0];
          } else {
            approachingElements.sort((a, b) => b.offsetBottom - a.offsetBottom);
            activeElement = approachingElements[0];
          }
        } else {
          const visibleElements = inViewportElements.filter(el => el.percentOfViewport >= 0.5);
          if (visibleElements.length > 0) {
            const visibleSubsections = visibleElements.filter(el => el.isSubsection);
            if (visibleSubsections.length > 0) {
              visibleSubsections.sort((a, b) => b.percentOfViewport - a.percentOfViewport);
              activeElement = visibleSubsections[0];
            } else {
              visibleElements.sort((a, b) => b.percentOfViewport - a.percentOfViewport);
              activeElement = visibleElements[0];
            }
          } else if (inViewportElements.length > 0) {
            inViewportElements.sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
            activeElement = inViewportElements[0];
          }
        }
      }
      
      if (activeElement) {
        let newActiveTab = activeTab;
        let newActiveSubTab = activeSubTab;
        
        if (activeElement.isSubsection) {
          const parent = findParentSection(activeElement.id);
          if (newActiveTab !== parent || newActiveSubTab !== activeElement.id) {
            newActiveTab = parent;
            newActiveSubTab = activeElement.id;
          }
        } else {
          if (newActiveTab !== activeElement.id || newActiveSubTab !== null) {
            newActiveTab = activeElement.id;
            newActiveSubTab = null;
          }
        }
        
        if ((newActiveTab !== activeTab || newActiveSubTab !== activeSubTab) && !isUserInitiatedNavigation) {
          setActiveTab(newActiveTab);
          setActiveSubTab(newActiveSubTab);
        }
      }
    };

    const handleScroll = () => {
      if (!contentRef.current || activeView !== 'PRICE LIST' || isUserInitiatedNavigation) return;
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 10 && lastScrollY !== 0) {
        return;
      }
      lastScrollY = currentScrollY;
      
      scrollTimeout = setTimeout(() => {
        updateActiveSection();
      }, 50); 
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeView, activeTab, activeSubTab, isUserInitiatedNavigation, findParentSection]);
  
  const scrollToSection = (tab, subTab = null) => {
    setIsUserInitiatedNavigation(true);
    setActiveTab(tab);
    setActiveSubTab(subTab);
    
    setTimeout(() => {
      const sectionId = subTab || tab;
      const section = document.getElementById(sectionId);
      
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 80,
          behavior: 'smooth'
        });
      }
      
      setTimeout(() => {
        setIsUserInitiatedNavigation(false);
      }, 100);
    }, 0);
  };

  const toggleView = (view) => {
    setActiveView(view);
    if (view === 'MENU') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('maintenance');
    }
    setActiveSubTab(null);
  };

  const menuContent = useMemo(() => (
    <MenuContent activeTab={activeTab} />
  ), [activeTab]);

  const priceListContent = useMemo(() => (
    <PriceListContent
      searchQuery={searchQuery}
      searchFilters={searchFilters}
    />
  ), [searchQuery, searchFilters]);

  return (
    <div className={`app-container ${sidebarOpen && isMobile ? 'sidebar-open' : ''}`}>
      <SideBar 
        activeView={activeView}
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        onToggleView={toggleView}
        onTabClick={scrollToSection}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="main-content">
        <TopNavigation 
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          isExpanded={isNavExpanded}
          onToggleExpand={() => setIsNavExpanded(!isNavExpanded)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchFilters={searchFilters}
          onFilterChange={setSearchFilters}
          activeView={activeView}
        />
        
        <div className="content-wrapper" ref={contentRef}>
          {activeView === 'MENU' ? menuContent : priceListContent}
        </div>  
      </div>
    </div>
  );
}

export default App;