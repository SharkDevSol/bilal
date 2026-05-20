import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';
import styles from './Sidebar.module.css';
import { Menu, X } from 'lucide-react';

/**
 * Sidebar navigation component
 * Provides main navigation menu with collapsible support
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.collapsed - Whether sidebar is collapsed
 * @param {Function} props.onToggle - Callback when toggle button is clicked
 * @param {Array} props.menuItems - Array of menu item objects
 * @param {string} props.activeItem - ID of currently active menu item
 * @param {Function} props.onNavigate - Callback when menu item is clicked
 * @param {string} props.userRole - Current user role for filtering menu items
 * @param {string} props.className - Additional CSS classes
 */
const Sidebar = ({
  collapsed = false,
  onToggle,
  menuItems = [],
  activeItem = '',
  onNavigate,
  userRole = 'admin',
  className = ''
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(userRole);
  });

  const handleNavigate = (path, id) => {
    if (onNavigate) {
      onNavigate(path, id);
    }
    // Close mobile menu after navigation
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarClasses = [
    styles.sidebar,
    collapsed && styles.collapsed,
    mobileOpen && styles.mobileOpen,
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={styles.mobileMenuButton}
        onClick={handleMobileToggle}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={handleMobileToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses} role="navigation" aria-label="Main navigation">
        {/* Desktop Toggle Button */}
        <button
          className={styles.toggleButton}
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <Menu size={20} />
        </button>

        {/* Menu Items */}
        <nav className={styles.menuContainer}>
          {filteredMenuItems.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              active={activeItem === item.id}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      path: PropTypes.string.isRequired,
      badge: PropTypes.number,
      children: PropTypes.array,
      roles: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  activeItem: PropTypes.string,
  onNavigate: PropTypes.func.isRequired,
  userRole: PropTypes.string,
  className: PropTypes.string
};

export default Sidebar;
