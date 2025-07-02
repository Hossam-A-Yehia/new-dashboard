import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header'; 

vi.mock('@/context/UserContext', () => {
    return {
      useUser: () => ({
        userData: {
          name: 'Test User',
          email: 'test@example.com',
          business_user_detail: {
            logo: 'https://example.com/logo.png',
            business_name: 'Test Business',
          },
        },
      }),
    };
  });

  describe('Header Component', () => {
  it('renders logo and dropdowns', () => {
    render(<Header isDrawerOpen={false} onMenuClick={() => {}} />);
    
    expect(screen.getByAltText('Logo')).toBeInTheDocument();

    expect(screen.getByTestId("select language")).toBeInTheDocument();
    expect(screen.getByTestId('fullscreen-icon')).toBeInTheDocument();
    expect(screen.getByTestId('profile-icon')).toBeInTheDocument(); 
  });

  it('calls onMenuClick when menu button is clicked', () => {
    const onClickMock = vi.fn();
    render(<Header isDrawerOpen={false} onMenuClick={onClickMock} />);
    
    const menuButton = screen.getByLabelText(/open drawer/i);
    fireEvent.click(menuButton);
    expect(onClickMock).toHaveBeenCalled();
  });
});
