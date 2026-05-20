import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Home, Users, Settings } from 'lucide-react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LanguageProvider } from '../../contexts/LanguageContext';

// Wrapper component with all necessary providers
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const renderWithProviders = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe('Sidebar', () => {
  const mockMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home />,
      path: '/dashboard',
      roles: ['admin']
    },
    {
      id: 'students',
      label: 'Students',
      icon: <Users />,
      path: '/students',
      badge: 5,
      roles: ['admin', 'staff']
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings />,
      path: '/settings',
      roles: ['admin']
    }
  ];

  const defaultProps = {
    collapsed: false,
    onToggle: vi.fn(),
    menuItems: mockMenuItems,
    activeItem: 'dashboard',
    onNavigate: vi.fn(),
    userRole: 'admin'
  };

  it('renders without crashing', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('highlights active menu item', () => {
    renderWithProviders(<Sidebar {...defaultProps} activeItem="students" />);
    const studentsButton = screen.getByText('Students').closest('button');
    expect(studentsButton).toHaveClass('active');
  });

  it('calls onNavigate when menu item is clicked', () => {
    const onNavigate = vi.fn();
    renderWithProviders(<Sidebar {...defaultProps} onNavigate={onNavigate} />);
    
    const studentsButton = screen.getByText('Students');
    fireEvent.click(studentsButton);
    
    expect(onNavigate).toHaveBeenCalledWith('/students', 'students');
  });

  it('calls onToggle when toggle button is clicked', () => {
    const onToggle = vi.fn();
    renderWithProviders(<Sidebar {...defaultProps} onToggle={onToggle} />);
    
    const toggleButton = screen.getByLabelText('Collapse sidebar');
    fireEvent.click(toggleButton);
    
    expect(onToggle).toHaveBeenCalled();
  });

  it('displays badge on menu item', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('filters menu items by user role', () => {
    renderWithProviders(<Sidebar {...defaultProps} userRole="staff" />);
    
    // Staff should see Students but not Dashboard or Settings (admin only)
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('shows all menu items when no roles specified', () => {
    const menuItemsWithoutRoles = [
      {
        id: 'home',
        label: 'Home',
        icon: <Home />,
        path: '/home'
      }
    ];
    
    renderWithProviders(
      <Sidebar
        {...defaultProps}
        menuItems={menuItemsWithoutRoles}
        userRole="guest"
      />
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('applies collapsed class when collapsed', () => {
    const { container } = renderWithProviders(<Sidebar {...defaultProps} collapsed={true} />);
    expect(container.querySelector('.sidebar')).toHaveClass('collapsed');
  });

  it('has proper ARIA labels', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
    expect(screen.getByLabelText('Collapse sidebar')).toBeInTheDocument();
  });

  it('updates toggle button label when collapsed', () => {
    renderWithProviders(<Sidebar {...defaultProps} collapsed={true} />);
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  });

  it('handles nested menu items', () => {
    const nestedMenuItems = [
      {
        id: 'academic',
        label: 'Academic',
        icon: <Home />,
        path: '/academic',
        children: [
          {
            id: 'marks',
            label: 'Marks',
            icon: <Users />,
            path: '/academic/marks'
          }
        ]
      }
    ];
    
    renderWithProviders(
      <Sidebar
        {...defaultProps}
        menuItems={nestedMenuItems}
      />
    );
    
    expect(screen.getByText('Academic')).toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(screen.getByText('Academic'));
    
    expect(screen.getByText('Marks')).toBeInTheDocument();
  });

  it('closes mobile menu after navigation', () => {
    renderWithProviders(<Sidebar {...defaultProps} />);
    
    // Open mobile menu
    const mobileMenuButton = screen.getByLabelText('Open menu');
    fireEvent.click(mobileMenuButton);
    
    // Navigate
    const studentsButton = screen.getByText('Students');
    fireEvent.click(studentsButton);
    
    // Mobile menu should close
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = renderWithProviders(
      <Sidebar {...defaultProps} className="custom-class" />
    );
    expect(container.querySelector('.sidebar')).toHaveClass('custom-class');
  });
});
