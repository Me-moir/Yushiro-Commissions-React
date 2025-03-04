import React, { useState, useEffect, useRef, useCallback } from 'react';
import './PriceListContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// Move these constants outside the component to prevent recreation on each render
const SHARED_COLUMNS = {
  BUNDLE_NAME: 0,
  DEFAULT_LABEL: 1,
  PHP_MIN: 2,
  PHP_MAX: 3,
  USD_MIN: 4,
  USD_MAX: 5,
  PRICE_1_LABEL: 6,
  PRICE_1_PHP_MIN: 7,
  PRICE_1_PHP_MAX: 8,
  PRICE_1_USD_MIN: 9,
  PRICE_1_USD_MAX: 10,
  PRICE_2_LABEL: 11,
  PRICE_2_PHP_MIN: 12,
  PRICE_2_PHP_MAX: 13,
  PRICE_2_USD_MIN: 14,
  PRICE_2_USD_MAX: 15,
  NOTES: 21,
  TAGS: 22,
  DESCRIPTION: 23
};

const CONFIG = {
  SPREADSHEET_ID: "1iKmx1aBg3panRx0oyt3YVgHwuGbEstLycdyCTQfjPcU",
  API_KEY: "AIzaSyCiUCjIPP6lGjSZMKx_CDH8PRkBa5Gnrz8",
  SHEETS: {
    maintenance: {
      range: 'Maintenance!A2:X',
      columns: SHARED_COLUMNS
    },
    resin: {
      range: 'Resin!A2:X',
      columns: SHARED_COLUMNS
    },
    'Material Farming': {
      range: 'Material Farming!A2:X',
      columns: SHARED_COLUMNS
    },
    'Special Offerings': {
      range: 'Special Offerings!A2:X',
      columns: SHARED_COLUMNS
    },
    Ascension: {
      range: 'Ascension!A2:X',
      columns: SHARED_COLUMNS
    }
  }
};

const SUBSECTION_TAG_MAPPING = {
  'maintenance-daily': ['daily', 'weekly'],
  'maintenance-monthly': ['monthly'],
  'maintenance-patch': ['patch'],
  'resin-promo': ['promo'],
  'resin-leylines': ['leylines'],
  'resin-normal': ['normal'],
  'resin-weekly': ['weekly'],
  'material-specialty': ['specialty'],
  'material-crafting': ['crafting'],
  'material-forging': ['forging'],
  'special-oculi': ['oculi'],
  'special-sigils': ['sigils'],
  'special-offerings': ['offerings'],
  'ascension-character': ['character'],
  'ascension-weapon': ['weapon'],
  'ascension-talent': ['talent']
};

const SECTION_MESSAGES = {
  maintenance: "Select a maintenance type from the sidebar to view our daily, monthly, and patch maintenance services.",
  resin: "Browse our resin services by selecting a category from the sidebar. We offer various resin options to optimize your gameplay.",
  'Material Farming': "Choose a material farming category from the sidebar to explore options for specialty items, crafting resources, and forging materials.",
  'Special Offerings': "Discover our special offerings by selecting a category from the sidebar. Find oculi collection, sigil services, and other unique offerings.",
  Ascension: "Explore our character and weapon ascension services by selecting a category from the sidebar. We provide comprehensive leveling solutions."
};

const SECTIONS = [
  { 
    id: 'maintenance', 
    title: 'Maintenance', 
    data: 'maintenance',
    subsections: [
      { id: 'maintenance-daily', title: 'Daily & Weekly Maintenance' },
      { id: 'maintenance-monthly', title: 'Monthly Maintenance' },
      { id: 'maintenance-patch', title: 'Every Patch Maintenance' }
    ]
  },
  { 
    id: 'resin', 
    title: 'Resin Burn', 
    data: 'resin',
    subsections: [
      { id: 'resin-promo', title: 'Promo Deals' },
      { id: 'resin-leylines', title: 'Ley Lines' },
      { id: 'resin-normal', title: 'Overworld (Normal) Boss' },
      { id: 'resin-weekly', title: 'Trounce Domain (Weekly) Boss' }
    ]
  },
  { 
    id: 'Material Farming', 
    title: 'Material Farming', 
    data: 'materialFarming',
    subsections: [
      { id: 'material-specialty', title: 'Local Specialty' },
      { id: 'material-crafting', title: 'Crafting' },
      { id: 'material-forging', title: 'Forging Ores' }
    ]
  },
  { 
    id: 'Special Offerings', 
    title: 'Special Offerings', 
    data: 'specialOfferings',
    subsections: [
      { id: 'special-oculi', title: 'Oculi' },
      { id: 'special-sigils', title: 'Sigils' },
      { id: 'special-offerings', title: 'Offering Systems' }
    ]
  },
  { 
    id: 'Ascension', 
    title: 'Ascension Services', 
    data: 'ascension',
    subsections: [
      { id: 'ascension-character', title: 'Character Ascension' },
      { id: 'ascension-weapon', title: 'Weapon Ascension' },
      { id: 'ascension-talent', title: 'Talent Materials' }
    ]
  },
];

const formatPrice = (min, max, currency) => {
  if (!min && !max) return 'Unavailable';
  if (!max || min === max) return `${currency}${min}`;
  return `${currency}${min} - ${currency}${max}`;
};

const getCardColorClass = (tags) => {
  if (!tags) return '';
  const tagsLower = tags.toLowerCase();
  if (tagsLower.includes('promo')) {
    return 'promo-card';
  }
  return '';
};

const FormattedListItems = ({ descriptionString }) => {
  if (!descriptionString) return <p>No details available</p>;

  const items = descriptionString.split(';').map(item => item.trim()).filter(item => item);
  if (items.length === 0) return <p>No details available</p>;

  const tagStyles = {
    limited: {
      backgroundColor: '#FF4444',
      label: 'Limited'
    },
    optional: {
      backgroundColor: '#FF4444',
      label: 'Optional'
    },
    freebie: {
      backgroundColor: '#32CD32',
      backgroundImage: 'linear-gradient(45deg, rgb(65, 118, 209), rgb(85, 180, 85))',
      label: 'Freebie'
    },
    promo: {
      backgroundColor: '#FF4444',
      label: 'Promo'
    },
    special: {
      backgroundColor: '#FFD700',
      backgroundImage: 'linear-gradient(45deg, #FFD700, #FFA500)',
      label: 'Special'
    }
  };
  
  const gradients = {
    gold: 'linear-gradient(45deg, #FFD700, #FFA500)',
    red: 'linear-gradient(45deg, #FF4444, #FF0000)',
    blue: 'linear-gradient(45deg, #4169E1, #00BFFF)',
    green: 'linear-gradient(45deg, #32CD32, #00FF00)',
    orange: 'linear-gradient(45deg, #FFA500, #FF6347)',
    violet: 'linear-gradient(45deg, #9400D3, #8A2BE2)'
  };
  
  const processHighlightedText = (text) => {
    const parts = [];
    let plainText = text;
    
    const patterns = {
      'G\\(': gradients.gold,
      'R\\(': gradients.red,
      'B\\(': gradients.blue,
      'Gr\\(': gradients.green,
      'O\\(': gradients.orange,
      'V\\(': gradients.violet
    };
    
    for (const [pattern, gradient] of Object.entries(patterns)) {
      const regex = new RegExp(`${pattern}(.*?)\\)`, 'g');
      let match;
      let newText = '';
      let lastIndex = 0;
      
      while ((match = regex.exec(plainText)) !== null) {
        newText += plainText.substring(lastIndex, match.index);
        parts.push({ 
          type: 'text', 
          content: plainText.substring(lastIndex, match.index) 
        });
        
        parts.push({ 
          type: 'highlight', 
          content: match[1],
          gradient: gradient
        });
        
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex > 0) {
        newText += plainText.substring(lastIndex);
        parts.push({ 
          type: 'text', 
          content: plainText.substring(lastIndex) 
        });
        plainText = newText;
        break;
      }
    }
    
    if (parts.length === 0) {
      return <span>{text}</span>;
    }
    
    return (
      <>
        {parts.map((part, index) => (
          part.type === 'highlight' ? (
            <span 
              key={index}
              style={{
                background: part.gradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              {part.content}
            </span>
          ) : (
            <span key={index}>{part.content}</span>
          )
        ))}
      </>
    );
  };
  
  function renderTaggedItem(content, style, index) {
    return (
      <li key={index} className="formatted-list-item">
        <div className="content-wrapper">
          <span className="formatted-content">
            {processHighlightedText(content)}
          </span>
          <span 
            className="formatted-tag"
            style={{
              backgroundColor: style.backgroundColor,
              backgroundImage: style.backgroundImage,
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              marginLeft: '8px',
              display: 'inline-block',
              textShadow: '1px 1px 1px rgba(0,0,0,0.2)'
            }}
          >
            {style.label}
          </span>
        </div>
      </li>
    );
  }
  
  return (
    <ul className="formatted-list">
      {items.map((item, index) => {
        const trimmedItem = item.trim();
        
        if (trimmedItem.startsWith('(#L)')) {
          return renderTaggedItem(trimmedItem.substring(4).trim(), tagStyles.limited, index);
        } else if (trimmedItem.startsWith('(#O)')) {
          return renderTaggedItem(trimmedItem.substring(4).trim(), tagStyles.optional, index);
        } else if (trimmedItem.startsWith('(#F)')) {
          return renderTaggedItem(trimmedItem.substring(4).trim(), tagStyles.freebie, index);
        } else if (trimmedItem.startsWith('(#P)')) {
          return renderTaggedItem(trimmedItem.substring(4).trim(), tagStyles.promo, index);
        } else if (trimmedItem.startsWith('(#S)')) {
          return renderTaggedItem(trimmedItem.substring(4).trim(), tagStyles.special, index);
        }
        
        return (
          <li key={index} className="formatted-list-item">
            <span className="formatted-content">
              {processHighlightedText(trimmedItem)}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

const PriceCard = React.memo(({ row, config, shouldAnimate, sectionId, index, expandedCards, toggleCardExpansion }) => {
  const [activePriceType, setActivePriceType] = useState('default');
  const [renderContent, setRenderContent] = useState(false);
  
  const bundleName = row[config.columns.BUNDLE_NAME] || 'Unknown Bundle';
  const cardId = `${sectionId}-${bundleName}`;
  const expanded = expandedCards[cardId] || false;
  
  useEffect(() => {
    if (expanded) {
      setRenderContent(true);
    } else if (!expanded && renderContent) {
      const timeout = setTimeout(() => {
        setRenderContent(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [expanded, renderContent]);

  const imageName = bundleName.toLowerCase().replace(/\s+/g, '-');
  const tags = row[config.columns.TAGS] || '';
  const isPromo = tags.toLowerCase().includes('promo');
  const cardColorClass = getCardColorClass(tags);
  
  const prices = {
    default: {
      label: row[config.columns.DEFAULT_LABEL] || 'Unavailable',
      php: {
        min: row[config.columns.PHP_MIN],
        max: row[config.columns.PHP_MAX]
      },
      usd: {
        min: row[config.columns.USD_MIN],
        max: row[config.columns.USD_MAX]
      }
    },
    price1: {
      label: row[config.columns.PRICE_1_LABEL],
      php: {
        min: row[config.columns.PRICE_1_PHP_MIN],
        max: row[config.columns.PRICE_1_PHP_MAX]
      },
      usd: {
        min: row[config.columns.PRICE_1_USD_MIN],
        max: row[config.columns.PRICE_1_USD_MAX]
      }
    },
    price2: {
      label: row[config.columns.PRICE_2_LABEL],
      php: {
        min: row[config.columns.PRICE_2_PHP_MIN],
        max: row[config.columns.PRICE_2_PHP_MAX]
      },
      usd: {
        min: row[config.columns.PRICE_2_USD_MIN],
        max: row[config.columns.PRICE_2_USD_MAX]
      }
    }
  };

  const phpPrice = formatPrice(
    prices[activePriceType].php.min, 
    prices[activePriceType].php.max, 
    '₱'
  );
  
  const usdPrice = formatPrice(
    prices[activePriceType].usd.min, 
    prices[activePriceType].usd.max, 
    '$'
  );

  const handlePriceButtonClick = (priceType, e) => {
    e.stopPropagation();
    setActivePriceType(priceType);
  };

  const animationClass = shouldAnimate ? 'animate-in' : '';
  
  return (
    <div 
      className={`price-card ${expanded ? 'expanded' : ''} ${animationClass} clickable-card ${cardColorClass}`} 
      style={shouldAnimate ? { animationDelay: `${0.05 * index}s` } : {}}
      onClick={() => toggleCardExpansion(cardId)}
>
      <div className="price-card-header">
        <div className="card-image">
        <img 
          src={`${import.meta.env.BASE_URL}src/assets/${imageName}.webp`} 
          alt={bundleName} 
          onError={(e) => { e.target.src = `${import.meta.env.BASE_URL}src/assets/default-bundle.webp`; }}
          loading="lazy"
        />
        </div>
        <div className="card-info">
          <h3>
            {bundleName}
            {isPromo && <span className="deals-tag">Deals</span>}
          </h3>
          <p className="description">{row[config.columns.NOTES] || 'No description available'}</p>
          <div className="mobile-price">
            <span className="mobile-php">{phpPrice}</span>
            <span className="price-divider">|</span>
            <span className="mobile-usd">{usdPrice}</span>
          </div>
        </div>
        <div className="card-right desktop-price">
          <div className="price-container">
            <span className="card-price">{phpPrice}</span>
            <span className="card-price-usd">{usdPrice}</span>
          </div>
        </div>
        <div className="expand-btn-container">
          <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
        </div>
      </div>
      
      <div className="price-card-body">
        {(expanded || renderContent) && (
          <div className="card-content-layout">
            <div className="card-content-left">
              <h4>Description</h4>
              <FormattedListItems descriptionString={row[config.columns.DESCRIPTION]} />
            </div>
            
            <div className="card-content-right price-variations">
              <h4>Item Variation</h4>
              <div className="price-variation-buttons">
                <button 
                  type="button" 
                  className={`price-btn ${activePriceType === 'default' ? 'active' : ''}`}
                  onClick={(e) => handlePriceButtonClick('default', e)}
                >
                  {prices.default.label}
                </button>
                
                {prices.price1.label && (
                  <button 
                    type="button" 
                    className={`price-btn ${activePriceType === 'price1' ? 'active' : ''}`}
                    onClick={(e) => handlePriceButtonClick('price1', e)}
                  >
                    {prices.price1.label}
                  </button>
                )}
                
                {prices.price2.label && (
                  <button 
                    type="button" 
                    className={`price-btn ${activePriceType === 'price2' ? 'active' : ''}`}
                    onClick={(e) => handlePriceButtonClick('price2', e)}
                  >
                    {prices.price2.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  const prevCardId = `${prevProps.sectionId}-${prevProps.row[0]}`;
  const nextCardId = `${nextProps.sectionId}-${nextProps.row[0]}`;
  const prevExpanded = prevProps.expandedCards[prevCardId] || false;
  const nextExpanded = nextProps.expandedCards[nextCardId] || false;
  
  return (
    prevProps.row === nextProps.row &&
    prevProps.shouldAnimate === nextProps.shouldAnimate &&
    prevProps.index === nextProps.index &&
    prevExpanded === nextExpanded
  );
});

function PriceListContent({ searchQuery, activeTab, activeSubTab, onTabChange }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatedSections, setAnimatedSections] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [pricingData, setPricingData] = useState({
    maintenance: [],
    resin: [],
    materialFarming: [],
    specialOfferings: [],
    ascension: []
  });
  
  const contentRef = useRef(null);
  const sectionRefs = useRef({
    prices: null,
    maintenance: null,
    resin: null,
    'Material Farming': null,
    'Special Offerings': null,
    Ascension: null
  });
  
  const subsectionRefs = useRef({ 
    'maintenance-daily': null,
    'maintenance-monthly': null,
    'maintenance-patch': null,
    'resin-promo': null,
    'resin-leylines': null,
    'resin-normal': null,
    'resin-weekly': null,
    'material-specialty': null,
    'material-crafting': null,
    'material-forging': null,
    'special-oculi': null,
    'special-sigils': null,
    'special-offerings': null,
    'ascension-character': null,
    'ascension-weapon': null,
    'ascension-talent': null
  });

  const toggleCardExpansion = useCallback((cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  }, []);

  const onTabClick = useCallback((section, subsection = null) => {
    if (onTabChange) {
      onTabChange(section, subsection);
    }
  }, [onTabChange]);


  const preloadImages = useCallback((bundleNames) => {
    bundleNames.forEach(bundleName => {
      const imageName = bundleName.toLowerCase().replace(/\s+/g, '-');
      const img = new Image();
      img.src = `/Yushiro-Commissions-React/assets/${imageName}.webp`;
    });
  }, []);

  useEffect(() => {
    if (activeSubTab && !animatedSections[activeSubTab]) {
      setAnimatedSections(prev => ({ ...prev, [activeSubTab]: true }));
    } else if (activeTab && !animatedSections[activeTab]) {
      setAnimatedSections(prev => ({ ...prev, [activeTab]: true }));
    } else if (!animatedSections.prices) {
      setAnimatedSections(prev => ({ ...prev, prices: true }));
    }
  }, [activeTab, activeSubTab, animatedSections]);

  // Separate the fetch function from its effect to avoid dependency issues
  const fetchSheetData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedData = {};
      
      for (const [key, config] of Object.entries(CONFIG.SHEETS)) {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SPREADSHEET_ID}/values/${config.range}?key=${CONFIG.API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${key} data: ${response.statusText}`);
        }
        
        const data = await response.json();
        fetchedData[key] = data.values || [];
      }
      
      setPricingData({
        maintenance: fetchedData.maintenance || [],
        resin: fetchedData.resin || [],
        materialFarming: fetchedData['Material Farming'] || [],
        specialOfferings: fetchedData['Special Offerings'] || [],
        ascension: fetchedData.Ascension || []
      });
      
      const bundleNames = [];
      Object.values(fetchedData).forEach(rows => {
        rows.forEach(row => {
          if (row[0]) bundleNames.push(row[0]);
        });
      });
      
      preloadImages(bundleNames);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [preloadImages]); // preloadImages is now the only dependency

  // Effect to fetch data runs once on mount
  useEffect(() => {
    fetchSheetData();
  }, [fetchSheetData]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const scrollPosition = window.scrollY + 100;
      let currentSubsection = null;
      let currentSection = null;
      
      Object.entries(subsectionRefs.current).forEach(([id, ref]) => {
        if (ref) {
          const { offsetTop, offsetHeight } = ref;
          
          if (scrollPosition >= offsetTop && 
              scrollPosition < offsetTop + offsetHeight) {
            currentSubsection = id;
            
            const sectionPrefix = id.split('-')[0];
            if (sectionPrefix === 'material') {
              currentSection = 'Material Farming';
            } else if (sectionPrefix === 'special') {
              currentSection = 'Special Offerings';
            } else {
              currentSection = sectionPrefix;
            }
          }
        }
      });
      
      if (!currentSubsection) {
        Object.entries(sectionRefs.current).forEach(([id, ref]) => {
          if (ref && id !== 'prices') {
            const { offsetTop, offsetHeight } = ref;
            
            if (scrollPosition >= offsetTop && 
                scrollPosition < offsetTop + offsetHeight) {
              currentSection = id;
            }
          }
        });
      }
      
      if (currentSubsection && currentSubsection !== activeSubTab) {
        onTabClick(currentSection, currentSubsection);
      } else if (currentSection && currentSection !== activeTab && !currentSubsection) {
        onTabClick(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab, activeSubTab, onTabClick]);

  const filterBySearch = useCallback((items, query) => {
    if (!query) return items;
    
    const lowerCaseQuery = query.toLowerCase();
    return items.filter(item => {
      if (item[0] && item[0].toLowerCase().includes(lowerCaseQuery)) return true;
      if (item[21] && item[21].toLowerCase().includes(lowerCaseQuery)) return true;
      if (item[22] && item[22].toLowerCase().includes(lowerCaseQuery)) return true;
      return false;
    });
  }, []);

  const filterBySubsection = useCallback((items, subsectionId) => {
    if (!subsectionId || !SUBSECTION_TAG_MAPPING[subsectionId]) return items;
    
    const relevantTags = SUBSECTION_TAG_MAPPING[subsectionId];
    return items.filter(item => {
      if (!item[22]) return false;
      
      const primaryTag = item[22].split(',')[0].trim().toLowerCase();
      return relevantTags.some(tag => primaryTag === tag.toLowerCase());
    });
  }, []);

  if (loading) {
    return <div className="loading">Loading pricing data...</div>;
  }

  if (error) {
    return <div className="error">Error loading pricing data: {error}</div>;
  }
  
  return (
    <div className="price-list-content" ref={contentRef}>
      {SECTIONS.map((section) => (
        <section 
          key={section.id} 
          id={section.id} 
          className="content-section" 
          ref={el => sectionRefs.current[section.id] = el}
        >
          <h2>{section.title}</h2>
          {section.description && <p>{section.description}</p>}
          
          {section.data && section.id === 'prices' && (
            <div className="price-cards">
              {filterBySearch(pricingData[section.data], searchQuery).map((row, index) => (
                <PriceCard 
                  key={`${section.id}-${index}`} 
                  row={row} 
                  config={CONFIG.SHEETS[section.id]}
                  shouldAnimate={true}
                  sectionId={section.id}
                  index={index}
                  expandedCards={expandedCards}
                  toggleCardExpansion={toggleCardExpansion}
                />
              ))}
            </div>
          )}
          
          {section.data && section.id !== 'prices' && section.subsections.length > 0 && (
            <div className="section-message" style={{ position: 'sticky', top: '100px', display: 'block', zIndex: '10' }}>
              {/* Display the custom message for this section */}
              {SECTION_MESSAGES[section.id]}
            </div>
          )}
          
          {section.subsections.length > 0 && (
            section.subsections.map(subsection => (
              <div 
                key={subsection.id} 
                id={subsection.id} 
                className={`subsection ${activeSubTab === subsection.id ? 'active-subsection' : ''}`}
                ref={el => subsectionRefs.current[subsection.id] = el}
              >
                <h3>{subsection.title}</h3>
                <div className="price-cards">
                  {filterBySearch(
                    filterBySubsection(pricingData[section.data], subsection.id), 
                    searchQuery
                  ).map((row, index) => (
                    <PriceCard 
                      key={`${subsection.id}-${index}`} 
                      row={row} 
                      config={CONFIG.SHEETS[section.id]}
                      shouldAnimate={activeSubTab === subsection.id && 
                                    !animatedSections[subsection.id] && 
                                    !searchQuery}
                      sectionId={subsection.id}
                      index={index}
                      expandedCards={expandedCards}
                      toggleCardExpansion={toggleCardExpansion} 
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      ))}
    </div>
  );
}

export default PriceListContent;