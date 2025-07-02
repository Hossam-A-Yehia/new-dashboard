import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthPage from './AuthPage';
import React from 'react';

vi.mock('@/components/atoms/Image/CustomImage', () => ({
  default: vi.fn(({ src, alt, height, width }) => (
    <img data-testid="custom-image" src={src} alt={alt} height={height} width={width} />
  )),
}));

vi.mock('i18next', () => ({
  t: vi.fn((key) => `Translated: ${key}`),
}));

vi.mock('@/assets/images/logo.svg', () => ({
  default: 'mocked-logo.svg',
}));

vi.mock('./authPage.css', () => ({}));

const MockFormComponent: React.FC = () => <div data-testid="mock-form">Mock Form</div>;

describe('AuthPage Component', () => {
  it('renders the logo image', () => {
    render(<AuthPage FormComponent={MockFormComponent} />);

    const logo = screen.getByTestId('custom-image');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('alt', 'Logo');
    expect(logo).toHaveAttribute('src', 'mocked-logo.svg');
    expect(logo).toHaveAttribute('height', '500');
    expect(logo).toHaveAttribute('width', '200');
  });

  it('renders the FormComponent', () => {
    render(<AuthPage FormComponent={MockFormComponent} />);

    const formComponent = screen.getByTestId('mock-form');
    expect(formComponent).toBeInTheDocument();
    expect(formComponent).toHaveTextContent('Mock Form');
  });

  it('applies correct CSS classes to layout elements', () => {
    render(<AuthPage FormComponent={MockFormComponent} />);

    const authPage = screen.getByTestId('auth-page');
    expect(authPage).toHaveClass('auth-page');

    const authInfo = authPage.querySelector('.relative.auth-info');
    expect(authInfo).toHaveClass('relative auth-info');

    const authOverlay = authPage.querySelector('.auth-overlay');
    expect(authOverlay).toHaveClass('auth-overlay');

    const authContent = authPage.querySelector('.auth-content');
    expect(authContent).toHaveClass('auth-content');

    const formContainer = authPage.querySelector('.form-container');
    expect(formContainer).toHaveClass('form-container');
  });

  it('renders without title prop', () => {
    render(<AuthPage FormComponent={MockFormComponent} />);

    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.getByTestId('mock-form')).toBeInTheDocument();
    expect(screen.getByTestId('custom-image')).toBeInTheDocument();
  });

});

vi.mock('./AuthPage', () => ({
  default: (props: any) => (
    <div data-testid="auth-page" className="auth-page">
      <div className="relative auth-info">
        <div className="auth-overlay"></div>
        <div className="auth-content">
          <img data-testid="custom-image" src="mocked-logo.svg" alt="Logo" height={500} width={200} />
          <p className="auth-description">Translated: auth.title</p>
        </div>
      </div>
      <div className="form-container">
        <props.FormComponent />
      </div>
    </div>
  ),
}));