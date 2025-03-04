import React, { useState } from 'react';
import './TopNavigation.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function TopNavigation({ 
  activeTab, 
  activeSubTab, 
  isExpanded, 
  onToggleExpand, 
  searchQuery, 
  onSearchChange,
  searchFilters,
  onFilterChange,
  activeView
}) {
  const sectionDefinitions = {
    MENU: {
      dashboard: {
        label: 'Dashboard',
        overview: 'Dashboard Overview',
        statistics: 'Dashboard Statistics',
        performance: 'Performance Metrics'
      },
      contact: {
        label: 'Contact',
        form: 'Contact Form',
        info: 'Contact Information'
      },
      feedback: {
        label: 'Feedback',
        reviews: 'Customer Reviews',
        testimonials: 'Testimonials'
      }
    },
    PRICE_LIST: { //FOR NAVIGATION TRACKER LABELS
      maintenance: {
        label: 'Maintenance',
        'maintenance-daily': 'Daily',
        'maintenance-monthly': 'Monthly',
        'maintenance-patch': 'Patch'
      },
      resin: {
        label: 'Resin',
        'resin-promo': 'Promo',
        'resin-leylines': 'Leylines',
        'resin-normal': 'Normal Boss',
        'resin-weekly': 'Weekly Boss'
      },
      'Material Farming': {
        label: 'Materials',
        'material-specialty': 'Local Specialty',
        'material-crafting': 'Crafting',
        'material-forging': 'Forging Ores'
      },
      'Special Offerings': {
        label: 'Special Offerings',
        'special-oculi': 'Oculi',
        'special-sigils': 'Sigils',
        'special-offerings': 'Ffferings'
      },
      'Ascension': {
        label: 'Ascension',
        'ascension-character': 'Character',
        'ascension-weapon': 'Weapon',
        'ascension-talent': 'Talent'
      }
    }
  };

  const filterDefinitions = {
    MENU: {
      dashboard: [
        { id: 'date', label: 'Date Range', type: 'select', options: ['Today', 'This Week', 'This Month', 'This Year'] },
        { id: 'metrics', label: 'Metrics', type: 'checkbox', options: ['Visits', 'Sales', 'Conversions'] }
      ],
      contact: [
        { id: 'department', label: 'Department', type: 'select', options: ['Sales', 'Support', 'General'] }
      ],
      feedback: [
        { id: 'rating', label: 'Rating', type: 'select', options: ['5 Stars', '4+ Stars', '3+ Stars'] },
        { id: 'date', label: 'Date', type: 'select', options: ['Recent', 'Last Month', 'Last Year'] }
      ]
    },
    PRICE_LIST: {
      maintenance: [
        { id: 'maintenanceType', label: 'Type', type: 'select', options: ['All', 'Regular', 'Emergency'] },
        { id: 'duration', label: 'Duration', type: 'select', options: ['All', 'Short', 'Medium', 'Long'] }
      ],
      resin: [
        { id: 'resinType', label: 'Resin Type', type: 'select', options: ['All', 'Original', 'Condensed', 'Fragile'] },
        { id: 'valueRatio', label: 'Value Ratio', type: 'select', options: ['All', 'High', 'Medium', 'Low'] }
      ],
      'Material Farming': [
        { id: 'category', label: 'Category', type: 'select', options: ['All', 'Common', 'Rare', 'Epic', 'Legendary'] },
        { id: 'region', label: 'Region', type: 'select', options: ['All', 'Mondstadt', 'Liyue', 'Inazuma', 'Sumeru'] }
      ],
      'Special Offerings': [
        { id: 'category', label: 'Category', type: 'select', options: ['All', 'Common', 'Rare', 'Epic', 'Legendary'] },
        { id: 'region', label: 'Region', type: 'select', options: ['All', 'Mondstadt', 'Liyue', 'Inazuma', 'Sumeru'] }
      ],
      'Ascension': [
        { id: 'category', label: 'Category', type: 'select', options: ['All', 'Common', 'Rare', 'Epic', 'Legendary'] },
        { id: 'region', label: 'Region', type: 'select', options: ['All', 'Mondstadt', 'Liyue', 'Inazuma', 'Sumeru'] }
      ]
    }
  };

  const getSectionInfo = () => {
    const viewKey = activeView === 'MENU' ? 'MENU' : 'PRICE_LIST';
    const sections = sectionDefinitions[viewKey];
    const sectionLabel = sections[activeTab]?.label || (activeView === 'MENU' ? 'Dashboard' : 'Prices');
    const subSectionLabel = activeSubTab && sections[activeTab] ? sections[activeTab][activeSubTab] || activeSubTab : null;
    
    return { sectionLabel, subSectionLabel };
  };

  const getFilterOptions = () => {
    const viewKey = activeView === 'MENU' ? 'MENU' : 'PRICE_LIST';
    return filterDefinitions[viewKey][activeTab] || [];
  };

  const [openFilters, setOpenFilters] = useState(() => {
    return getFilterOptions().map(filter => filter.id);
  });

  const toggleFilter = (filterId) => {
    setOpenFilters(openFilters.includes(filterId) 
      ? openFilters.filter(id => id !== filterId)
      : [...openFilters, filterId]
    );
  };

  const hasActiveFilters = Object.keys(searchFilters).some(key => 
    (Array.isArray(searchFilters[key]) && searchFilters[key].length > 0) || 
    (!Array.isArray(searchFilters[key]) && searchFilters[key])
  );

  const handleFilterChange = (filterId, value) => {
    onFilterChange({
      ...searchFilters,
      [filterId]: value
    });
  };

  const { sectionLabel, subSectionLabel } = getSectionInfo();

  return (
    <div className="top-navigation">
      <div className="current-section">
        {sectionLabel} {subSectionLabel && <span className="subsection-label">{subSectionLabel}</span>}
      </div>
      
      <button 
        className={`expand-button ${isExpanded ? 'expanded' : ''}`}
        onClick={onToggleExpand}
      >
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
      </button>
      
      {isExpanded && (
        <div className="expanded-navigation">
          <div className="search-container">
            <div className="search-row">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="clear-button"
                  onClick={() => onSearchChange('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
          
          <div className="filters-container">
            <div className="filters-header">
              <h3>Filters</h3>
              <div className="header-actions">
                <button
                  className="clear-button"
                  onClick={() => onFilterChange({})}
                  disabled={!hasActiveFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
            {getFilterOptions().map(filter => (
              <div key={filter.id} className={`filter-item ${openFilters.includes(filter.id) ? 'open' : 'closed'}`}>
                <div className="filter-header" onClick={() => toggleFilter(filter.id)}>
                  <label>{filter.label}</label>
                  <span className="filter-toggle-icon">
                    <FontAwesomeIcon icon={openFilters.includes(filter.id) ? faChevronUp : faChevronDown} />
                  </span>
                </div>
                {openFilters.includes(filter.id) && (
                  <div className="filter-content">
                    {filter.type === 'select' && (
                      <select
                        value={searchFilters[filter.id] || ''}
                        onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      >
                        <option value="">All</option>
                        {filter.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                    {filter.type === 'checkbox' && (
                      <div className="checkbox-group">
                        {filter.options.map(option => {
                          const currentValues = searchFilters[filter.id] || [];
                          return (
                            <label key={option}>
                              <input
                                type="checkbox"
                                checked={currentValues.includes(option) || false}
                                onChange={(e) => {
                                  handleFilterChange(
                                    filter.id, 
                                    e.target.checked
                                      ? [...currentValues, option]
                                      : currentValues.filter(val => val !== option)
                                  );
                                }}
                              />
                              {option}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TopNavigation;