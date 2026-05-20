import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from './Breadcrumbs';
import SearchBar from './SearchBar';
import NotificationCenter from './NotificationCenter';
import ProfileMenu from './ProfileMenu';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import styles from './Header.module.css';

/**
 * Header component with navigation utilities
 * Provides breadcrumbs, search, notifications, profile menu, theme toggle, and language selector
 * 
 * @param {Object} props - Component props
 * @param {Array} props.breadcrumbs - Array of breadcrumb objects with label and optional path
 * @param {Function} props.onSearch - Callback function when search is triggered
 * @param {Array} props.notifications - Array of notification objects
 * @param {Function} props.onNotificationClick - Callback when a notification is clicked
 * @param {Object} props.user - User information object with name, role, and optional avatar
 * @param {Function} props.onLogout - Callback function for logout action
 * @param {Function} props.onProfileClick - Callback function when profile is clicked
 * @param {string} props.className - Additional CSS classes
 */
const Header = ({
  breadcrumbs = [],
  onSearch,
  notifications = [],
  onNotificationClick,
  user,
  onLogout,
  onProfileClick,
  className = ''
}) => {
  const headerClasses = [
    styles.header,
    className
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses} role="banner">
      <div className={styles.headerContent}>
        {/* Left section: Breadcrumbs */}
        <div className={styles.leftSection}>
          {breadcrumbs.length > 0 && (
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          )}
        </div>

        {/* Right section: Utilities */}
        <div className={styles.rightSection}>
          {/* Search */}
          {onSearch && (
            <SearchBar onSearch={onSearch} />
          )}

          {/* Theme Toggle */}
          <ThemeToggle size="medium" />

          {/* Language Selector */}
          <LanguageSelector variant="dropdown" />

          {/* Notifications */}
          <NotificationCenter
            notifications={notifications}
            onNotificationClick={onNotificationClick}
          />

          {/* Profile Menu */}
          <ProfileMenu
            user={user}
            onLogout={onLogout}
            onProfileClick={onProfileClick}
          />
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string
    })
  ),
  onSearch: PropTypes.func,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['info', 'warning', 'error', 'success']).isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.instanceOf(Date).isRequired,
      read: PropTypes.bool.isRequired
    })
  ),
  onNotificationClick: PropTypes.func,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func,
  className: PropTypes.string
};

export default Header;
