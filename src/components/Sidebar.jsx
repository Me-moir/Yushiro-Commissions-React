import { useEffect, useRef } from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Sidebar({ 
  activeView, 
  activeTab, 
  activeSubTab, 
  onToggleView, 
  onTabClick,
  isMobile,
  sidebarOpen,
  setSidebarOpen
}) {
  const sidebarContentRef = useRef(null);
  
  const menuTabs = [
    {
      id: 'home',
      label: 'Home',
      subtabs: [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'News', label: 'News' },
        { id: 'feedback', label: 'Feedback' },
        { id: 'Top-Up', label: 'Top-Up' }
      ]
    },
    {
      id: 'contact',
      label: 'Contact',
      subtabs: [
        { id: 'socials', label: 'Socials' },
        { id: 'email', label: 'Email' },
        { id: 'support', label: 'Client Support' },
        { id: 'report', label: 'Report Problem' }
      ]
    },
    {
      id: 'feedback',
      label: 'Feedback',
      subtabs: [
        { id: 'reviews', label: 'Reviews' },
        { id: 'testimonials', label: 'Testimonials' }
      ]
    }
  ];

  const priceListTabs = [
    {
      id: 'maintenance',
      label: 'Maintenance',
      subtabs: [
        { id: 'maintenance-daily', label: 'Daily & Weekly' },
        { id: 'maintenance-monthly', label: 'Monthly' },
        { id: 'maintenance-patch', label: 'Every Patch' }
      ]
    },
    {
      id: 'resin',
      label: 'Resin Burn',
      subtabs: [
        { id: 'resin-promo', label: 'Promo Deals' },
        { id: 'resin-leylines', label: 'Ley Lines' },
        { id: 'resin-normal', label: 'Overworld (Normal) Boss' },
        { id: 'resin-weekly', label: 'Domain (Weekly) Boss' }
      ]
    },
    {
      id: 'Material Farming',
      label: 'Material Farming',
      subtabs: [
        { id: 'material-specialty', label: 'Local Specialty' },
        { id: 'material-crafting', label: 'Crafting' },
        { id: 'material-forging', label: 'Forging Ores' }
      ]
    },
    {
      id: 'Special Offerings',
      label: 'Special Offerings',
      subtabs: [
        { id: 'special-oculi', label: 'Oculi' },
        { id: 'special-sigils', label: 'Sigils' },
        { id: 'special-offerings', label: 'Offering Systems' }
      ]
    },
    {
      id: 'Ascension',
      label: 'Ascension',
      subtabs: [
        { id: 'ascension-character', label: 'Character Ascension' },
        { id: 'ascension-weapon', label: 'Weapon Ascension' },
        { id: 'ascension-talent', label: 'Talent Materials' }
      ]
    }
  ];

  const tabs = activeView === 'MENU' ? menuTabs : priceListTabs;
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSubtabClick = (tabId, subtabId) => {
    onTabClick(tabId, subtabId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen) {
        const sidebarElement = document.querySelector('.sidebar');
        const menuButton = document.querySelector('.menu-toggle-button');
        
        if (sidebarElement && 
            !sidebarElement.contains(event.target) && 
            menuButton && 
            !menuButton.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen, setSidebarOpen]);
  
  useEffect(() => {
    const scrollToActiveElement = () => {
      const sidebarContent = sidebarContentRef.current;
      if (!sidebarContent) return;
      
      let activeElement = null;
      
      if (activeSubTab) {
        activeElement = sidebarContent.querySelector(`li[data-subtab-id="${activeSubTab}"]`);
      }
      
      if (!activeElement && activeTab) {
        activeElement = sidebarContent.querySelector(`div[data-tab-id="${activeTab}"]`);
        
        if (activeElement) {
          const subtabContainer = activeElement.parentElement.querySelector('.subtab-container');
          if (subtabContainer && subtabContainer.offsetHeight > 0) {
            const lastSubtab = subtabContainer.querySelector('.subtabs li:last-child');
            if (lastSubtab) {
              const lastSubtabBottom = lastSubtab.offsetTop + lastSubtab.offsetHeight;
              const elementTop = activeElement.offsetTop;
              const totalHeight = lastSubtabBottom - elementTop;
              
              if (totalHeight > sidebarContent.clientHeight * 0.5) {
                activeElement = lastSubtab;
              }
            }
          }
        }
      }
      
      if (!activeElement) return;
      
      const containerRect = sidebarContent.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      
      const isAboveView = elementRect.top < containerRect.top;
      const isBelowView = elementRect.bottom > containerRect.bottom;
      
      if (isAboveView || isBelowView) {
        let scrollTo;
        
        if (isAboveView) {
          scrollTo = sidebarContent.scrollTop + (elementRect.top - containerRect.top) - 20;
        } else {
          scrollTo = sidebarContent.scrollTop + (elementRect.top - containerRect.top) - 
                    (containerRect.height / 2) + (elementRect.height / 2);
        }
        
        sidebarContent.scrollTo({
          top: Math.max(0, scrollTo),
          behavior: 'smooth'
        });
      }
    };
    
    const timeoutId = setTimeout(scrollToActiveElement, 50);
    return () => clearTimeout(timeoutId);
  }, [activeTab, activeSubTab, activeView, sidebarOpen]);
  
  useEffect(() => {
    const updateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      document.documentElement.style.setProperty('--scroll-progress', `${scrollPercentage}%`);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();
    
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <>
      {isMobile && (
        <button 
          className={`menu-toggle-button ${sidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} size="lg" />
        </button>
      )}
      
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
      
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">LOGO</div>
          <div className="view-toggle">
            <button 
              className={activeView === 'MENU' ? 'active' : ''} 
              onClick={() => onToggleView('MENU')}
            >
              MENU
            </button>
            <button 
              className={activeView === 'PRICE LIST' ? 'active' : ''} 
              onClick={() => onToggleView('PRICE LIST')}
            >
              PRICE LIST
            </button>
          </div>
        </div>
        
        <div className="sidebar-content" ref={sidebarContentRef}>
          <ul className="sidebar-tabs">
            {tabs.map(tab => (
              <li key={tab.id} className="tab-container">
                <div 
                  className={`tab-header ${activeTab === tab.id ? 'active' : ''}`}
                  data-tab-id={tab.id}
                  onClick={() => onTabClick(tab.id)}
                >
                  <span>{tab.label}</span>
                </div>
                
                {tab.subtabs?.length > 0 && (
                  <div 
                    className={`subtab-container ${activeTab === tab.id ? 'expanded' : ''}`}
                  >
                    <div className="vertical-line"></div>
                    <ul className="subtabs">
                      {tab.subtabs.map(subtab => (
                        <li 
                          key={subtab.id}
                          data-subtab-id={subtab.id}
                          className={activeSubTab === subtab.id ? 'active' : ''}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubtabClick(tab.id, subtab.id);
                          }}
                        >
                          {subtab.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;