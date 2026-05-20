import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Table from './Table';

describe('Table Component', () => {
  const mockColumns = [
    { key: 'id', header: 'ID', accessor: 'id', sortable: true },
    { key: 'name', header: 'Name', accessor: 'name', sortable: true },
    { key: 'email', header: 'Email', accessor: 'email', sortable: true },
    { key: 'status', header: 'Status', accessor: 'status', sortable: false },
  ];

  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'Active' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', status: 'Inactive' },
  ];

  describe('Basic Rendering', () => {
    it('should render table with data', () => {
      render(<Table columns={mockColumns} data={mockData} />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('should render all column headers', () => {
      render(<Table columns={mockColumns} data={mockData} />);
      
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render all rows', () => {
      render(<Table columns={mockColumns} data={mockData} />);
      
      const rows = screen.getAllByRole('row');
      // +1 for header row
      expect(rows).toHaveLength(mockData.length + 1);
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Table columns={mockColumns} data={mockData} className="custom-class" />
      );
      
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading is true', () => {
      render(<Table columns={mockColumns} data={mockData} loading={true} />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should have proper ARIA attributes for loading state', () => {
      render(<Table columns={mockColumns} data={mockData} loading={true} />);
      
      const loadingContainer = screen.getByRole('status');
      expect(loadingContainer).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Empty State', () => {
    it('should show empty message when data is empty', () => {
      render(<Table columns={mockColumns} data={[]} />);
      
      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should show custom empty message', () => {
      render(
        <Table 
          columns={mockColumns} 
          data={[]} 
          emptyMessage="No records found" 
        />
      );
      
      expect(screen.getByText('No records found')).toBeInTheDocument();
    });
  });

  describe('Sorting Functionality', () => {
    it('should sort data in ascending order when clicking sortable column', async () => {
      const user = userEvent.setup();
      render(<Table columns={mockColumns} data={mockData} sortable={true} />);
      
      const nameHeader = screen.getByText('Name').closest('th');
      await user.click(nameHeader);
      
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1];
      expect(within(firstDataRow).getByText('Alice Williams')).toBeInTheDocument();
    });

    it('should sort data in descending order on second click', async () => {
      const user = userEvent.setup();
      render(<Table columns={mockColumns} data={mockData} sortable={true} />);
      
      const nameHeader = screen.getByText('Name').closest('th');
      await user.click(nameHeader);
      await user.click(nameHeader);
      
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1];
      expect(within(firstDataRow).getByText('John Doe')).toBeInTheDocument();
    });

    it('should clear sort on third click', async () => {
      const user = userEvent.setup();
      render(<Table columns={mockColumns} data={mockData} sortable={true} />);
      
      const nameHeader = screen.getByText('Name').closest('th');
      await user.click(nameHeader);
      await user.click(nameHeader);
      await user.click(nameHeader);
      
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1];
      expect(within(firstDataRow).getByText('John Doe')).toBeInTheDocument();
    });

    it('should not sort when column is not sortable', async () => {
      const user = userEvent.setup();
      render(<Table columns={mockColumns} data={mockData} sortable={true} />);
      
      const statusHeader = screen.getByText('Status').closest('th');
      await user.click(statusHeader);
      
      // Data should remain in original order
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1];
      expect(within(firstDataRow).getByText('John Doe')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes for sorted columns', async () => {
      const user = userEvent.setup();
      render(<Table columns={mockColumns} data={mockData} sortable={true} />);
      
      const nameHeader = screen.getByText('Name').closest('th');
      await user.click(nameHeader);
      
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('should disable sorting when sortable prop is false', () => {
      render(<Table columns={mockColumns} data={mockData} sortable={false} />);
      
      const nameHeader = screen.getByText('Name').closest('th');
      expect(nameHeader).not.toHaveClass(/sortable/);
    });
  });

  describe('Filtering Functionality', () => {
    it('should show filter bar when filterable is true', () => {
      render(<Table columns={mockColumns} data={mockData} filterable={true} />);
      
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should filter data based on search input', async () => {
      const user = userEvent.setup();
      render(<Table columns={mockColumns} data={mockData} filterable={true} />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'Jane');
      
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('should show result count', async () => {
      const { container } = render(<Table columns={mockColumns} data={mockData} filterable={true} />);
      
      // Check initial count
      const resultCount = container.querySelector('[aria-live="polite"]');
      expect(resultCount).toHaveTextContent('5');
      expect(resultCount).toHaveTextContent('results');
      
      // Verify the result count element exists and shows results
      expect(resultCount).toBeInTheDocument();
    });

    it('should show clear button when filter text exists', async () => {
      const user = userEvent.setup();
      render(<Table columns={mockColumns} data={mockData} filterable={true} />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      await user.type(searchInput, 'test');
      
      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeInTheDocument();
      
      await user.click(clearButton);
      expect(searchInput).toHaveValue('');
    });

    it('should have proper ARIA labels for search', () => {
      render(<Table columns={mockColumns} data={mockData} filterable={true} />);
      
      const searchInput = screen.getByLabelText('Search table');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Pagination Functionality', () => {
    it('should show pagination controls when paginated is true', () => {
      render(<Table columns={mockColumns} data={mockData} paginated={true} pageSize={2} />);
      
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Last')).toBeInTheDocument();
    });

    it('should display correct number of rows per page', () => {
      render(<Table columns={mockColumns} data={mockData} paginated={true} pageSize={2} />);
      
      const rows = screen.getAllByRole('row');
      // +1 for header row
      expect(rows).toHaveLength(3);
    });

    it('should navigate to next page', async () => {
      const user = userEvent.setup();
      render(<Table columns={mockColumns} data={mockData} paginated={true} pageSize={2} />);
      
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('should navigate to previous page', async () => {
      const user = userEvent.setup();
      render(<Table columns={mockColumns} data={mockData} paginated={true} pageSize={2} />);
      
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      const prevButton = screen.getByText('Previous');
      await user.click(prevButton);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should navigate to specific page number', async () => {
      const user = userEvent.setup();
      render(<Table columns={mockColumns} data={mockData} paginated={true} pageSize={2} />);
      
      const page2Button = screen.getByLabelText('Go to page 2');
      await user.click(page2Button);
      
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should disable first and previous buttons on first page', () => {
      render(<Table columns={mockColumns} data={mockData} paginated={true} pageSize={2} />);
      
      expect(screen.getByText('First')).toBeDisabled();
      expect(screen.getByText('Previous')).toBeDisabled();
    });

    it('should disable next and last buttons on last page', async () => {
      const user = userEvent.setup();
      render(<Table columns={mockColumns} data={mockData} paginated={true} pageSize={2} />);
      
      const lastButton = screen.getByText('Last');
      await user.click(lastButton);
      
      expect(screen.getByText('Next')).toBeDisabled();
      expect(screen.getByText('Last')).toBeDisabled();
    });

    it('should show pagination info', () => {
      render(<Table columns={mockColumns} data={mockData} paginated={true} pageSize={2} />);
      
      expect(screen.getByText(/Showing 1 to 2 of 5 entries/)).toBeInTheDocument();
    });

    it('should have proper ARIA labels for pagination', () => {
      render(<Table columns={mockColumns} data={mockData} paginated={true} pageSize={2} />);
      
      const nav = screen.getByRole('navigation', { name: 'Table pagination' });
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Row Selection', () => {
    it('should show checkboxes when selectable is true', () => {
      render(<Table columns={mockColumns} data={mockData} selectable={true} />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      // +1 for select all checkbox
      expect(checkboxes).toHaveLength(mockData.length + 1);
    });

    it('should select individual row', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <Table 
          columns={mockColumns} 
          data={mockData} 
          selectable={true}
          onSelectionChange={onSelectionChange}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]); // First data row
      
      expect(onSelectionChange).toHaveBeenCalledWith([0]);
    });

    it('should select all rows', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <Table 
          columns={mockColumns} 
          data={mockData} 
          selectable={true}
          onSelectionChange={onSelectionChange}
        />
      );
      
      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(selectAllCheckbox);
      
      expect(onSelectionChange).toHaveBeenCalledWith([0, 1, 2, 3, 4]);
    });

    it('should deselect all rows', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <Table 
          columns={mockColumns} 
          data={mockData} 
          selectable={true}
          selectedRows={[0, 1, 2, 3, 4]}
          onSelectionChange={onSelectionChange}
        />
      );
      
      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(selectAllCheckbox);
      
      expect(onSelectionChange).toHaveBeenCalledWith([]);
    });

    it('should support single selection mode', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <Table 
          columns={mockColumns} 
          data={mockData} 
          selectable={true}
          selectionMode="single"
          onSelectionChange={onSelectionChange}
        />
      );
      
      const radios = screen.getAllByRole('radio');
      await user.click(radios[0]);
      
      expect(onSelectionChange).toHaveBeenCalledWith([0]);
    });

    it('should deselect previous selection in single mode', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <Table 
          columns={mockColumns} 
          data={mockData} 
          selectable={true}
          selectionMode="single"
          selectedRows={[0]}
          onSelectionChange={onSelectionChange}
        />
      );
      
      const radios = screen.getAllByRole('radio');
      await user.click(radios[1]);
      
      expect(onSelectionChange).toHaveBeenCalledWith([1]);
    });

    it('should have proper ARIA attributes for selected rows', async () => {
      const user = userEvent.setup();
      render(
        <Table 
          columns={mockColumns} 
          data={mockData} 
          selectable={true}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);
      
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('should not trigger row click when clicking checkbox', async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();
      render(
        <Table 
          columns={mockColumns} 
          data={mockData} 
          selectable={true}
          onRowClick={onRowClick}
        />
      );
      
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]);
      
      expect(onRowClick).not.toHaveBeenCalled();
    });
  });

  describe('Row Click Handler', () => {
    it('should call onRowClick when row is clicked', async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();
      render(
        <Table 
          columns={mockColumns} 
          data={mockData} 
          onRowClick={onRowClick}
        />
      );
      
      const rows = screen.getAllByRole('row');
      await user.click(rows[1]); // First data row
      
      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    });

    it('should add clickable class when onRowClick is provided', () => {
      const onRowClick = vi.fn();
      render(
        <Table 
          columns={mockColumns} 
          data={mockData} 
          onRowClick={onRowClick}
        />
      );
      
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveClass(/clickable/);
    });
  });

  describe('Custom Rendering', () => {
    it('should use custom render function for column', () => {
      const customColumns = [
        ...mockColumns,
        {
          key: 'actions',
          header: 'Actions',
          render: (value, row) => <button>Edit {row.name}</button>
        }
      ];
      
      render(<Table columns={customColumns} data={mockData} />);
      
      expect(screen.getByText('Edit John Doe')).toBeInTheDocument();
    });

    it('should support column alignment', () => {
      const alignedColumns = [
        { ...mockColumns[0], align: 'center' },
        { ...mockColumns[1], align: 'right' },
      ];
      
      const { container } = render(
        <Table columns={alignedColumns} data={mockData} />
      );
      
      const headers = container.querySelectorAll('th');
      expect(headers[0]).toHaveStyle({ textAlign: 'center' });
      expect(headers[1]).toHaveStyle({ textAlign: 'right' });
    });
  });

  describe('Striped and Bordered Variants', () => {
    it('should apply striped class when striped is true', () => {
      const { container } = render(
        <Table columns={mockColumns} data={mockData} striped={true} />
      );
      
      const tbody = container.querySelector('tbody');
      expect(tbody).toHaveClass(/striped/);
    });

    it('should apply bordered class when bordered is true', () => {
      const { container } = render(
        <Table columns={mockColumns} data={mockData} bordered={true} />
      );
      
      const tableWrapper = container.querySelector('[class*="tableWrapper"]');
      expect(tableWrapper).toHaveClass(/bordered/);
    });
  });

  describe('Accessibility', () => {
    it('should have proper table role', () => {
      render(<Table columns={mockColumns} data={mockData} />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should have proper row roles', () => {
      render(<Table columns={mockColumns} data={mockData} />);
      
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
    });

    it('should have proper cell roles', () => {
      render(<Table columns={mockColumns} data={mockData} />);
      
      const cells = screen.getAllByRole('cell');
      expect(cells.length).toBeGreaterThan(0);
    });

    it('should have proper columnheader roles', () => {
      render(<Table columns={mockColumns} data={mockData} />);
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(mockColumns.length);
    });
  });

  describe('Integration - Sorting + Filtering + Pagination', () => {
    it('should work correctly with all features enabled', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Table 
          columns={mockColumns} 
          data={mockData} 
          sortable={true}
          filterable={true}
          paginated={true}
          pageSize={2}
        />
      );
      
      // Verify all features are present
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      expect(screen.getByText('First')).toBeInTheDocument();
      
      // Sort data
      const nameHeader = screen.getByText('Name').closest('th');
      await user.click(nameHeader);
      
      // Check pagination works
      expect(screen.getByText(/Showing 1 to 2 of 5 entries/)).toBeInTheDocument();
    });
  });
});
