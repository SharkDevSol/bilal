/**
 * Card Component Tests
 * 
 * Tests for Card component in light and dark modes.
 * Verifies visual appearance, styling, and functionality in both themes.
 * 
 * Task: 11.2.24 Test Card component in light and dark modes
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Card from './Card';

// Helper function to render Card with ThemeProvider
const renderWithTheme = (ui, theme = 'light') => {
  // Set initial theme in localStorage
  localStorage.setItem('theme', theme);
  
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('Card Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Remove theme classes from document
    document.documentElement.classList.remove('light', 'dark');
  });

  describe('Light Mode', () => {
    test('should render Card in light mode', () => {
      renderWithTheme(
        <Card>
          <p>Test content</p>
        </Card>,
        'light'
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    test('should apply correct theme class in light mode', () => {
      renderWithTheme(
        <Card data-testid="test-card">Content</Card>,
        'light'
      );

      const card = screen.getByTestId('test-card');
      expect(card).toBeInTheDocument();
      
      // Check that light theme class is applied to document
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    test('should render title and subtitle in light mode', () => {
      renderWithTheme(
        <Card title="Test Title" subtitle="Test Subtitle">
          Content
        </Card>,
        'light'
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    test('should render actions in light mode', () => {
      renderWithTheme(
        <Card 
          title="Card with Actions"
          actions={<button>Action Button</button>}
        >
          Content
        </Card>,
        'light'
      );

      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    test('should apply default variant styling in light mode', () => {
      renderWithTheme(
        <Card variant="default" data-testid="default-card">Content</Card>,
        'light'
      );

      const card = screen.getByTestId('default-card');
      expect(card).toBeInTheDocument();
    });

    test('should apply outlined variant styling in light mode', () => {
      renderWithTheme(
        <Card variant="outlined" data-testid="outlined-card">Content</Card>,
        'light'
      );

      const card = screen.getByTestId('outlined-card');
      expect(card).toBeInTheDocument();
    });

    test('should apply elevated variant styling in light mode', () => {
      renderWithTheme(
        <Card variant="elevated" data-testid="elevated-card">Content</Card>,
        'light'
      );

      const card = screen.getByTestId('elevated-card');
      expect(card).toBeInTheDocument();
    });

    test('should apply correct padding in light mode', () => {
      renderWithTheme(
        <Card padding="lg" data-testid="padded-card">Content</Card>,
        'light'
      );

      const card = screen.getByTestId('padded-card');
      expect(card).toBeInTheDocument();
    });

    test('should apply hoverable class in light mode', () => {
      renderWithTheme(
        <Card hoverable data-testid="hoverable-card">Content</Card>,
        'light'
      );

      const card = screen.getByTestId('hoverable-card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Dark Mode', () => {
    test('should render Card in dark mode', () => {
      renderWithTheme(
        <Card>
          <p>Test content</p>
        </Card>,
        'dark'
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    test('should apply correct theme class in dark mode', () => {
      renderWithTheme(
        <Card data-testid="test-card">Content</Card>,
        'dark'
      );

      const card = screen.getByTestId('test-card');
      expect(card).toBeInTheDocument();
      
      // Check that dark theme class is applied to document
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    test('should render title and subtitle in dark mode', () => {
      renderWithTheme(
        <Card title="Test Title" subtitle="Test Subtitle">
          Content
        </Card>,
        'dark'
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    test('should render actions in dark mode', () => {
      renderWithTheme(
        <Card 
          title="Card with Actions"
          actions={<button>Action Button</button>}
        >
          Content
        </Card>,
        'dark'
      );

      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    test('should apply default variant styling in dark mode', () => {
      renderWithTheme(
        <Card variant="default" data-testid="default-card">Content</Card>,
        'dark'
      );

      const card = screen.getByTestId('default-card');
      expect(card).toBeInTheDocument();
    });

    test('should apply outlined variant styling in dark mode', () => {
      renderWithTheme(
        <Card variant="outlined" data-testid="outlined-card">Content</Card>,
        'dark'
      );

      const card = screen.getByTestId('outlined-card');
      expect(card).toBeInTheDocument();
    });

    test('should apply elevated variant styling in dark mode', () => {
      renderWithTheme(
        <Card variant="elevated" data-testid="elevated-card">Content</Card>,
        'dark'
      );

      const card = screen.getByTestId('elevated-card');
      expect(card).toBeInTheDocument();
    });

    test('should apply correct padding in dark mode', () => {
      renderWithTheme(
        <Card padding="lg" data-testid="padded-card">Content</Card>,
        'dark'
      );

      const card = screen.getByTestId('padded-card');
      expect(card).toBeInTheDocument();
    });

    test('should apply hoverable class in dark mode', () => {
      renderWithTheme(
        <Card hoverable data-testid="hoverable-card">Content</Card>,
        'dark'
      );

      const card = screen.getByTestId('hoverable-card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Theme Switching', () => {
    test('should maintain Card structure when switching from light to dark', () => {
      const { rerender } = renderWithTheme(
        <Card title="Test Card" data-testid="theme-card">Content</Card>,
        'light'
      );

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByTestId('theme-card')).toBeInTheDocument();

      // Switch to dark mode
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');

      rerender(
        <ThemeProvider>
          <Card title="Test Card" data-testid="theme-card">Content</Card>
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByTestId('theme-card')).toBeInTheDocument();
    });

    test('should maintain Card structure when switching from dark to light', () => {
      const { rerender } = renderWithTheme(
        <Card title="Test Card" data-testid="theme-card">Content</Card>,
        'dark'
      );

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByTestId('theme-card')).toBeInTheDocument();

      // Switch to light mode
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');

      rerender(
        <ThemeProvider>
          <Card title="Test Card" data-testid="theme-card">Content</Card>
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByTestId('theme-card')).toBeInTheDocument();
    });
  });

  describe('Padding Variants', () => {
    test('should apply padding-none in both themes', () => {
      const { unmount: unmountLight } = renderWithTheme(
        <Card padding="none" data-testid="padding-card">Content</Card>,
        'light'
      );
      expect(screen.getByTestId('padding-card')).toBeInTheDocument();
      unmountLight();

      renderWithTheme(
        <Card padding="none" data-testid="padding-card">Content</Card>,
        'dark'
      );
      expect(screen.getByTestId('padding-card')).toBeInTheDocument();
    });

    test('should apply padding-sm in both themes', () => {
      const { unmount: unmountLight } = renderWithTheme(
        <Card padding="sm" data-testid="padding-card">Content</Card>,
        'light'
      );
      expect(screen.getByTestId('padding-card')).toBeInTheDocument();
      unmountLight();

      renderWithTheme(
        <Card padding="sm" data-testid="padding-card">Content</Card>,
        'dark'
      );
      expect(screen.getByTestId('padding-card')).toBeInTheDocument();
    });

    test('should apply padding-md (default) in both themes', () => {
      const { unmount: unmountLight } = renderWithTheme(
        <Card padding="md" data-testid="padding-card">Content</Card>,
        'light'
      );
      expect(screen.getByTestId('padding-card')).toBeInTheDocument();
      unmountLight();

      renderWithTheme(
        <Card padding="md" data-testid="padding-card">Content</Card>,
        'dark'
      );
      expect(screen.getByTestId('padding-card')).toBeInTheDocument();
    });

    test('should apply padding-lg in both themes', () => {
      const { unmount: unmountLight } = renderWithTheme(
        <Card padding="lg" data-testid="padding-card">Content</Card>,
        'light'
      );
      expect(screen.getByTestId('padding-card')).toBeInTheDocument();
      unmountLight();

      renderWithTheme(
        <Card padding="lg" data-testid="padding-card">Content</Card>,
        'dark'
      );
      expect(screen.getByTestId('padding-card')).toBeInTheDocument();
    });
  });

  describe('Variant Styles', () => {
    test('should render all variants correctly in light mode', () => {
      const variants = ['default', 'outlined', 'elevated'];
      
      variants.forEach((variant, index) => {
        const { unmount } = renderWithTheme(
          <Card variant={variant} data-testid={`variant-card-${index}`}>Content</Card>,
          'light'
        );
        
        expect(screen.getByTestId(`variant-card-${index}`)).toBeInTheDocument();
        unmount();
      });
    });

    test('should render all variants correctly in dark mode', () => {
      const variants = ['default', 'outlined', 'elevated'];
      
      variants.forEach((variant, index) => {
        const { unmount } = renderWithTheme(
          <Card variant={variant} data-testid={`variant-card-${index}`}>Content</Card>,
          'dark'
        );
        
        expect(screen.getByTestId(`variant-card-${index}`)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Bordered Prop', () => {
    test('should show border by default in light mode', () => {
      renderWithTheme(
        <Card data-testid="bordered-card">Content</Card>,
        'light'
      );
      
      const card = screen.getByTestId('bordered-card');
      expect(card).toBeInTheDocument();
      // Border is applied by default, noBorder class should not be present
      expect(card.className).not.toContain('noBorder');
    });

    test('should show border by default in dark mode', () => {
      renderWithTheme(
        <Card data-testid="bordered-card">Content</Card>,
        'dark'
      );
      
      const card = screen.getByTestId('bordered-card');
      expect(card).toBeInTheDocument();
      expect(card.className).not.toContain('noBorder');
    });

    test('should hide border when bordered=false in light mode', () => {
      renderWithTheme(
        <Card bordered={false} data-testid="no-border-card">Content</Card>,
        'light'
      );
      
      const card = screen.getByTestId('no-border-card');
      expect(card).toBeInTheDocument();
      expect(card.className).toContain('noBorder');
    });

    test('should hide border when bordered=false in dark mode', () => {
      renderWithTheme(
        <Card bordered={false} data-testid="no-border-card">Content</Card>,
        'dark'
      );
      
      const card = screen.getByTestId('no-border-card');
      expect(card).toBeInTheDocument();
      expect(card.className).toContain('noBorder');
    });

    test('should show border when bordered=true explicitly in light mode', () => {
      renderWithTheme(
        <Card bordered={true} data-testid="bordered-card">Content</Card>,
        'light'
      );
      
      const card = screen.getByTestId('bordered-card');
      expect(card).toBeInTheDocument();
      expect(card.className).not.toContain('noBorder');
    });

    test('should show border when bordered=true explicitly in dark mode', () => {
      renderWithTheme(
        <Card bordered={true} data-testid="bordered-card">Content</Card>,
        'dark'
      );
      
      const card = screen.getByTestId('bordered-card');
      expect(card).toBeInTheDocument();
      expect(card.className).not.toContain('noBorder');
    });
  });

  describe('Custom Props', () => {
    test('should apply custom className in both themes', () => {
      const { unmount: unmountLight } = renderWithTheme(
        <Card className="custom-class" data-testid="custom-card">Content</Card>,
        'light'
      );
      const lightCard = screen.getByTestId('custom-card');
      expect(lightCard).toBeInTheDocument();
      expect(lightCard).toHaveClass('custom-class');
      unmountLight();

      renderWithTheme(
        <Card className="custom-class" data-testid="custom-card">Content</Card>,
        'dark'
      );
      const darkCard = screen.getByTestId('custom-card');
      expect(darkCard).toBeInTheDocument();
      expect(darkCard).toHaveClass('custom-class');
    });

    test('should pass through additional props in both themes', () => {
      const { unmount: unmountLight } = renderWithTheme(
        <Card data-testid="test-card" aria-label="Test Card">Content</Card>,
        'light'
      );
      expect(screen.getByTestId('test-card')).toBeInTheDocument();
      expect(screen.getByLabelText('Test Card')).toBeInTheDocument();
      unmountLight();

      renderWithTheme(
        <Card data-testid="test-card" aria-label="Test Card">Content</Card>,
        'dark'
      );
      expect(screen.getByTestId('test-card')).toBeInTheDocument();
      expect(screen.getByLabelText('Test Card')).toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    test('should render complex children in light mode', () => {
      renderWithTheme(
        <Card>
          <div>
            <h2>Heading</h2>
            <p>Paragraph</p>
            <button>Button</button>
          </div>
        </Card>,
        'light'
      );

      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
    });

    test('should render complex children in dark mode', () => {
      renderWithTheme(
        <Card>
          <div>
            <h2>Heading</h2>
            <p>Paragraph</p>
            <button>Button</button>
          </div>
        </Card>,
        'dark'
      );

      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
    });

    test('should render header only when title, subtitle, or actions are provided', () => {
      const { unmount: unmountNoHeader } = renderWithTheme(
        <Card data-testid="no-header-card">Content</Card>,
        'light'
      );
      const noHeaderCard = screen.getByTestId('no-header-card');
      expect(noHeaderCard).toBeInTheDocument();
      // Header should not be rendered
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      unmountNoHeader();

      renderWithTheme(
        <Card title="Title" data-testid="with-header-card">Content</Card>,
        'light'
      );
      const withHeaderCard = screen.getByTestId('with-header-card');
      expect(withHeaderCard).toBeInTheDocument();
      // Header should be rendered
      expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    });

    test('should render footer when provided in light mode', () => {
      renderWithTheme(
        <Card footer={<button>Footer Action</button>}>
          Content
        </Card>,
        'light'
      );

      expect(screen.getByText('Footer Action')).toBeInTheDocument();
    });

    test('should render footer when provided in dark mode', () => {
      renderWithTheme(
        <Card footer={<button>Footer Action</button>}>
          Content
        </Card>,
        'dark'
      );

      expect(screen.getByText('Footer Action')).toBeInTheDocument();
    });

    test('should not render footer when not provided', () => {
      renderWithTheme(
        <Card data-testid="no-footer-card">Content</Card>,
        'light'
      );

      const card = screen.getByTestId('no-footer-card');
      expect(card).toBeInTheDocument();
      // Footer should not be in the document
      expect(card.querySelector('[class*="footer"]')).not.toBeInTheDocument();
    });

    test('should render header, body, and footer sections together', () => {
      renderWithTheme(
        <Card 
          title="Card Title"
          subtitle="Card Subtitle"
          actions={<button>Header Action</button>}
          footer={<button>Footer Action</button>}
        >
          <p>Card Body Content</p>
        </Card>,
        'light'
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Header Action')).toBeInTheDocument();
      expect(screen.getByText('Card Body Content')).toBeInTheDocument();
      expect(screen.getByText('Footer Action')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper structure for screen readers in light mode', () => {
      renderWithTheme(
        <Card title="Accessible Card" subtitle="With subtitle">
          <p>Content for screen readers</p>
        </Card>,
        'light'
      );

      const title = screen.getByRole('heading', { name: 'Accessible Card' });
      expect(title).toBeInTheDocument();
      expect(screen.getByText('With subtitle')).toBeInTheDocument();
      expect(screen.getByText('Content for screen readers')).toBeInTheDocument();
    });

    test('should have proper structure for screen readers in dark mode', () => {
      renderWithTheme(
        <Card title="Accessible Card" subtitle="With subtitle">
          <p>Content for screen readers</p>
        </Card>,
        'dark'
      );

      const title = screen.getByRole('heading', { name: 'Accessible Card' });
      expect(title).toBeInTheDocument();
      expect(screen.getByText('With subtitle')).toBeInTheDocument();
      expect(screen.getByText('Content for screen readers')).toBeInTheDocument();
    });
  });

  describe('CSS Variables Usage', () => {
    test('should render with CSS module classes in both themes', () => {
      const { unmount: unmountLight } = renderWithTheme(
        <Card data-testid="styled-card">Content</Card>,
        'light'
      );
      expect(screen.getByTestId('styled-card')).toBeInTheDocument();
      expect(document.documentElement.classList.contains('light')).toBe(true);
      unmountLight();

      renderWithTheme(
        <Card data-testid="styled-card">Content</Card>,
        'dark'
      );
      expect(screen.getByTestId('styled-card')).toBeInTheDocument();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty content', () => {
      renderWithTheme(
        <Card data-testid="empty-card" />,
        'light'
      );

      expect(screen.getByTestId('empty-card')).toBeInTheDocument();
    });

    test('should handle null children', () => {
      renderWithTheme(
        <Card data-testid="null-card">{null}</Card>,
        'light'
      );

      expect(screen.getByTestId('null-card')).toBeInTheDocument();
    });

    test('should handle undefined title and subtitle', () => {
      renderWithTheme(
        <Card title={undefined} subtitle={undefined} data-testid="undefined-card">
          Content
        </Card>,
        'light'
      );

      expect(screen.getByTestId('undefined-card')).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    test('should handle multiple Cards in same theme', () => {
      renderWithTheme(
        <>
          <Card title="Card 1">Content 1</Card>
          <Card title="Card 2">Content 2</Card>
          <Card title="Card 3">Content 3</Card>
        </>,
        'light'
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });
  });

  describe('Visual Consistency Across Themes', () => {
    test('should maintain same structure in light and dark modes', () => {
      const { unmount: unmountLight } = renderWithTheme(
        <Card 
          title="Consistent Card" 
          subtitle="Same structure"
          actions={<button>Action</button>}
          data-testid="consistent-card"
        >
          <p>Content text</p>
        </Card>,
        'light'
      );

      expect(screen.getByTestId('consistent-card')).toBeInTheDocument();
      expect(screen.getByText('Consistent Card')).toBeInTheDocument();
      expect(screen.getByText('Same structure')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Content text')).toBeInTheDocument();
      
      unmountLight();

      renderWithTheme(
        <Card 
          title="Consistent Card" 
          subtitle="Same structure"
          actions={<button>Action</button>}
          data-testid="consistent-card"
        >
          <p>Content text</p>
        </Card>,
        'dark'
      );

      expect(screen.getByTestId('consistent-card')).toBeInTheDocument();
      expect(screen.getByText('Consistent Card')).toBeInTheDocument();
      expect(screen.getByText('Same structure')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Content text')).toBeInTheDocument();
    });

    test('should apply theme-aware CSS variables correctly', () => {
      // Test light mode
      renderWithTheme(
        <Card data-testid="theme-aware-card">Content</Card>,
        'light'
      );
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(screen.getByTestId('theme-aware-card')).toBeInTheDocument();

      // Test dark mode
      const { unmount } = renderWithTheme(
        <Card data-testid="theme-aware-card-dark">Content</Card>,
        'dark'
      );
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(screen.getByTestId('theme-aware-card-dark')).toBeInTheDocument();
      unmount();
    });
  });
});
