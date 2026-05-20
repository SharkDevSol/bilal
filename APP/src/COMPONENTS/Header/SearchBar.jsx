import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './SearchBar.module.css';

/**
 * SearchBar component for global search functionality
 * Provides a search input with icon and clear button
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Callback function when search is triggered
 * @param {string} props.placeholder - Placeholder text for search input
 * @param {string} props.className - Additional CSS classes
 */
const SearchBar = ({ onSearch, placeholder, className = '' }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  const searchBarClasses = [
    styles.searchBar,
    isExpanded && styles.expanded,
    className
  ].filter(Boolean).join(' ');

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.closest(`.${styles.searchBar}`).contains(event.target)) {
        if (!searchQuery) {
          setIsExpanded(false);
        }
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded, searchQuery]);

  const handleSearchClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else if (searchQuery.trim()) {
      onSearch?.(searchQuery);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearch?.(searchQuery);
    } else if (e.key === 'Escape') {
      handleClear();
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsExpanded(false);
    inputRef.current?.blur();
  };

  return (
    <div className={searchBarClasses}>
      <button
        className={styles.searchButton}
        onClick={handleSearchClick}
        aria-label={t('common.search', 'Search')}
        type="button"
      >
        <Search size={20} aria-hidden="true" />
      </button>

      {isExpanded && (
        <>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder={placeholder || t('common.searchPlaceholder', 'Search...')}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            aria-label={t('common.search', 'Search')}
          />

          {searchQuery && (
            <button
              className={styles.clearButton}
              onClick={handleClear}
              aria-label={t('common.clear', 'Clear')}
              type="button"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

export default SearchBar;
