import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ASKsGlobalFilter from './AskFilter';

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

// Mock the translation hook and initReactI18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

describe('ASKsGlobalFilter', () => {
  const defaultProps = {
    updateFilters: vi.fn(),
    setValue: vi.fn(),
    filters: {},
    SearchPlaceholder: 'Search...',
    value: '',
    isNotAdmin: false,
  };

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <ASKsGlobalFilter {...defaultProps} {...props} />
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
    const filterButton = screen.getByRole('button');
    expect(filterButton).toBeInTheDocument();
    expect(screen.getByTestId('filter-icon')).toBeInTheDocument();
  });

  it('opens modal when filter button is clicked', () => {
    renderComponent();
    const filterButton = screen.getByRole('button');
    fireEvent.click(filterButton);
    expect(screen.getByText('asks.filter.filterBy')).toBeInTheDocument();
  });
  it('clears filters when reset button is clicked', () => {
    renderComponent({
      filters: { service: 'test' },
      value: 'test',
    });
    
    const filterButton = screen.getByRole('button');
    fireEvent.click(filterButton);
    
    const resetButton = screen.getByTestId('reset-icon').closest('button');
    fireEvent.click(resetButton!);
    
    expect(defaultProps.updateFilters).toHaveBeenCalledWith({});
    expect(defaultProps.setValue).toHaveBeenCalledWith('');
  });

}); 