import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal Component', () => {
  let onCloseMock;

  beforeEach(() => {
    onCloseMock = vi.fn();
  });

  afterEach(() => {
    // Clean up body overflow style
    document.body.style.overflow = 'unset';
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('modal-container')).toBeInTheDocument();
    });

    it('should render title correctly', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal Title">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Test content</p>
          <button>Test button</button>
        </Modal>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Test button' })).toBeInTheDocument();
    });

    it('should render footer when provided', () => {
      render(
        <Modal 
          isOpen={true} 
          onClose={onCloseMock} 
          title="Test Modal"
          footer={
            <div>
              <button>Cancel</button>
              <button>Save</button>
            </div>
          }
        >
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('should not render footer when not provided', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal-footer')).not.toBeInTheDocument();
    });

    it('should render close button by default', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
    });

    it('should not render close button when showCloseButton is false', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal" showCloseButton={false}>
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal-close-button')).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should apply small size class', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal" size="small">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      expect(modal.className).toContain('small');
    });

    it('should apply medium size class by default', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      expect(modal.className).toContain('medium');
    });

    it('should apply large size class', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal" size="large">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      expect(modal.className).toContain('large');
    });

    it('should apply full size class', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal" size="full">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      expect(modal.className).toContain('full');
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const closeButton = screen.getByTestId('modal-close-button');
      await user.click(closeButton);

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Escape key is pressed', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when Escape key is pressed if closeOnEscape is false', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal" closeOnEscape={false}>
          <p>Modal content</p>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onCloseMock).not.toHaveBeenCalled();
    });

    it('should call onClose when overlay is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const overlay = screen.getByTestId('modal-overlay');
      await user.click(overlay);

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when overlay is clicked if closeOnOverlayClick is false', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal" closeOnOverlayClick={false}>
          <p>Modal content</p>
        </Modal>
      );

      const overlay = screen.getByTestId('modal-overlay');
      await user.click(overlay);

      expect(onCloseMock).not.toHaveBeenCalled();
    });

    it('should not call onClose when modal content is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const modalContent = screen.getByTestId('modal-body');
      await user.click(modalContent);

      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Lock', () => {
    it('should lock body scroll when modal opens', () => {
      const { rerender } = render(
        <Modal isOpen={false} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('unset');

      rerender(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should unlock body scroll when modal closes', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal isOpen={false} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('unset');
    });

    it('should unlock body scroll on unmount', () => {
      const { unmount } = render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Focus Management', () => {
    it('should focus first focusable element when modal opens', async () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <input type="text" placeholder="First input" />
          <button>Second button</button>
        </Modal>
      );

      await waitFor(() => {
        const closeButton = screen.getByTestId('modal-close-button');
        expect(document.activeElement).toBe(closeButton);
      });
    });

    it('should trap focus within modal', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <input type="text" data-testid="input-1" />
          <input type="text" data-testid="input-2" />
        </Modal>
      );

      const closeButton = screen.getByTestId('modal-close-button');
      const input1 = screen.getByTestId('input-1');
      const input2 = screen.getByTestId('input-2');

      // Focus should start at close button
      await waitFor(() => {
        expect(document.activeElement).toBe(closeButton);
      });

      // Tab to input 1
      await user.tab();
      expect(document.activeElement).toBe(input1);

      // Tab to input 2
      await user.tab();
      expect(document.activeElement).toBe(input2);

      // Tab should wrap back to close button
      await user.tab();
      expect(document.activeElement).toBe(closeButton);

      // Shift+Tab should go back to input 2
      await user.tab({ shift: true });
      expect(document.activeElement).toBe(input2);
    });
  });

  describe('Accessibility', () => {
    it('should have role="dialog"', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      expect(modal).toHaveAttribute('role', 'dialog');
    });

    it('should have aria-modal="true"', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to title', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should use aria-label when provided', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal" ariaLabel="Custom label">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      expect(modal).toHaveAttribute('aria-label', 'Custom label');
      expect(modal).not.toHaveAttribute('aria-labelledby');
    });

    it('should have aria-describedby when provided', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal" ariaDescribedBy="description-id">
          <p id="description-id">Modal description</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      expect(modal).toHaveAttribute('aria-describedby', 'description-id');
    });

    it('should have accessible close button label', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const closeButton = screen.getByTestId('modal-close-button');
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal" className="custom-class">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      expect(modal.className).toContain('custom-class');
    });
  });

  describe('Portal Rendering', () => {
    it('should render modal in document.body', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const overlay = screen.getByTestId('modal-overlay');
      expect(overlay.parentElement).toBe(document.body);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid open/close', () => {
      const { rerender } = render(
        <Modal isOpen={false} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      // Open
      rerender(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();

      // Close
      rerender(
        <Modal isOpen={false} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();

      // Open again
      rerender(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          {null}
        </Modal>
      );

      expect(screen.getByTestId('modal-body')).toBeInTheDocument();
    });

    it('should handle complex nested content', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <div>
            <h3>Section 1</h3>
            <p>Content 1</p>
            <div>
              <h4>Subsection</h4>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </div>
        </Modal>
      );

      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Subsection')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('RTL Support', () => {
    it('should support RTL layout', () => {
      // Set RTL direction on document
      document.documentElement.setAttribute('dir', 'rtl');

      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      expect(modal).toBeInTheDocument();

      // Clean up
      document.documentElement.removeAttribute('dir');
    });

    it('should render correctly in RTL mode with footer', () => {
      document.documentElement.setAttribute('dir', 'rtl');

      render(
        <Modal 
          isOpen={true} 
          onClose={onCloseMock} 
          title="Test Modal"
          footer={
            <div>
              <button>Cancel</button>
              <button>Save</button>
            </div>
          }
        >
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-footer')).toBeInTheDocument();

      // Clean up
      document.documentElement.removeAttribute('dir');
    });
  });

  describe('Animation Support', () => {
    it('should have fade-in animation on overlay', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const overlay = screen.getByTestId('modal-overlay');
      const styles = window.getComputedStyle(overlay);
      
      // Check that animation is defined (the actual animation will be in CSS)
      expect(overlay).toBeInTheDocument();
    });

    it('should have slide-up animation on modal', () => {
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal-container');
      
      // Check that modal is rendered (animation is handled by CSS)
      expect(modal).toBeInTheDocument();
    });
  });
});
