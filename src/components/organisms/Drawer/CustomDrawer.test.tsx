import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CustomDrawer from './Drawer';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@mui/material/styles';
import {
  ADMIN_TYPE,
  SUPPLIER_TYPE,
} from '@/constants/Constants';

vi.mock('@/context/UserContext', () => ({
  useUser: vi.fn(),
}));

vi.mock('@mui/material/styles', async () => {
  const actual = await vi.importActual('@mui/material/styles');
  return {
    ...actual,
    useTheme: vi.fn(),
    styled: (component: any) => () => component,
  };
});

vi.mock('@mui/material', () => ({
  ...vi.importActual('@mui/material'),
  Drawer: (props: any) => <div data-testid="MuiDrawer-root" {...props} />,
  ListItemText: (props: any) => <span data-testid="MuiListItemText-root" {...props} />,
  HomeIcon: (props: any) => <span data-testid="HomeIcon" {...props} />,
  PeopleIcon: (props: any) => <span data-testid="PeopleIcon" {...props} />,
  SettingsIcon: (props: any) => <span data-testid="SettingsIcon" {...props} />,
  BusinessIcon: (props: any) => <span data-testid="BusinessIcon" {...props} />,
  ListAltIcon: (props: any) => <span data-testid="ListAltIcon" {...props} />,
  CategoryIcon: (props: any) => <span data-testid="CategoryIcon" {...props} />,
  WorkIcon: (props: any) => <span data-testid="WorkIcon" {...props} />,
  GroupWorkIcon: (props: any) => <span data-testid="GroupWorkIcon" {...props} />,
  LayersIcon: (props: any) => <span data-testid="LayersIcon" {...props} />,
  ShoppingBagIcon: (props: any) => <span data-testid="ShoppingBagIcon" {...props} />,
  InventoryIcon: (props: any) => <span data-testid="InventoryIcon" {...props} />,
  SearchIcon: (props: any) => <span data-testid="SearchIcon" {...props} />,
  WalletIcon: (props: any) => <span data-testid="WalletIcon" {...props} />,
  RequestQuoteIcon: (props: any) => <span data-testid="RequestQuoteIcon" {...props} />,
  MailIcon: (props: any) => <span data-testid="MailIcon" {...props} />,
  SupportAgentIcon: (props: any) => <span data-testid="SupportAgentIcon" {...props} />,
  HistoryIcon: (props: any) => <span data-testid="HistoryIcon" {...props} />,
  PolicyIcon: (props: any) => <span data-testid="PolicyIcon" {...props} />,
  ArticleIcon: (props: any) => <span data-testid="ArticleIcon" {...props} />,
  AdUnitsIcon: (props: any) => <span data-testid="AdUnitsIcon" {...props} />,
  QuestionAnswerIcon: (props: any) => <span data-testid="QuestionAnswerIcon" {...props} />,
  CommentIcon: (props: any) => <span data-testid="CommentIcon" {...props} />,
  BookIcon: (props: any) => <span data-testid="BookIcon" {...props} />,
}));

describe('CustomDrawer Component', () => {
  const mockOnClose = vi.fn();
  const mockTheme = {
    direction: 'ltr',
    spacing: (value: number) => `${value * 8}px`,
    transitions: {
      create: vi.fn(() => 'transition'),
      easing: { sharp: 'sharp' },
      duration: { enteringScreen: 225, leavingScreen: 195 },
    },
    breakpoints: {
      up: vi.fn(() => ({})),
    },
    mixins: { toolbar: { minHeight: 64 } },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as any).mockReturnValue(mockTheme);
  });

  it('renders the drawer when open and displays menu items for admin user', () => {
    (useUser as any).mockReturnValue({
      userData: { user_type: ADMIN_TYPE[0] },
    });

    render(
      <MemoryRouter>
        <CustomDrawer isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(screen.getByText('Users List')).toBeInTheDocument();
    expect(screen.getByText('Business users')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('filters menu items based on user type (supplier)', () => {
    (useUser as any).mockReturnValue({
      userData: { user_type: SUPPLIER_TYPE[0] },
    });

    render(
      <MemoryRouter>
        <CustomDrawer isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Technical docs')).toBeInTheDocument();
    expect(screen.queryByText('Categories')).not.toBeInTheDocument();
    expect(screen.queryByText('Services')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    (useUser as any).mockReturnValue({
      userData: { user_type: ADMIN_TYPE[0] },
    });

    render(
      <MemoryRouter>
        <CustomDrawer isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays no menu items when userType is undefined', () => {
    (useUser as any).mockReturnValue({
      userData: { user_type: undefined },
    });

    render(
      <MemoryRouter>
        <CustomDrawer isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    expect(screen.queryByText('Users List')).not.toBeInTheDocument();
    expect(screen.queryByText('Categories')).not.toBeInTheDocument();
  });


  it('renders correct icon for each menu item', () => {
    (useUser as any).mockReturnValue({
      userData: { user_type: SUPPLIER_TYPE[0] },
    });

    render(
      <MemoryRouter>
        <CustomDrawer isOpen={true} onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('HomeIcon')).toBeInTheDocument();
    expect(screen.getByTestId('ShoppingBagIcon')).toBeInTheDocument();
    expect(screen.getByTestId('BookIcon')).toBeInTheDocument();
  });
});