import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IdeasGlobalFilter from './IdeasFilter';

// Mock MUI icons
vi.mock('@mui/icons-material', () => ({
  FilterList: () => <div data-testid="filter-icon">Filter Icon</div>,
  RotateLeft: () => <div data-testid="reset-icon">Reset Icon</div>,
  Close: () => <div data-testid="close-icon">Close Icon</div>,
  Search: () => <div data-testid="search-icon">Search Icon</div>,
}));

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('IdeasGlobalFilter', () => {
  const defaultProps = {
    updateFilters: vi.fn(),
    setValue: vi.fn(),
    filters: {},
    SearchPlaceholder: 'Search...',
    value: '',
  };

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <IdeasGlobalFilter {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders filter button', () => {
    renderComponent();
    const filterButton = screen.getByRole('button', { name: /filter/i });
    expect(filterButton).toBeInTheDocument();
    expect(screen.getByTestId('filter-icon')).toBeInTheDocument();
  });

  it('opens modal when filter button is clicked', () => {
    renderComponent();
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    expect(screen.getByText('Filter Ideas')).toBeInTheDocument();
  });

  it('clears filters when reset button is clicked', () => {
    renderComponent({
      filters: { title: 'test' },
      value: 'test',
    });
    
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    expect(defaultProps.updateFilters).toHaveBeenCalledWith({});
    expect(defaultProps.setValue).toHaveBeenCalledWith('');
  });


  it('disables apply button when no filter option is selected', () => {
    renderComponent();
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    
    const applyButton = screen.getByRole('button', { name: /apply filter/i });
    expect(applyButton).toBeDisabled();
  });

  it('updates search value when text field changes', () => {
    renderComponent();
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(defaultProps.setValue).toHaveBeenCalledWith('test search');
  });
}); 