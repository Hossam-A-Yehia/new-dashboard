import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavLink from './NavLink';

vi.mock('@/types/Atoms', () => ({
  LinkProps: {},
}));

describe('NavLink Component', () => {
  it('renders the Link with correct href and children', () => {
    render(
      <MemoryRouter>
        <NavLink href="/test" classN="">
          Test Link
        </NavLink>
      </MemoryRouter>
    );

    const link = screen.getByText('Test Link');
    expect(link).toBeInTheDocument();

    expect(link.closest('a')).toHaveAttribute('href', '/test');
  });

  it('applies default and custom className correctly', () => {
    render(
      <MemoryRouter>
        <NavLink href="/test" classN="custom-class">
          Test Link
        </NavLink>
      </MemoryRouter>
    );

    const link = screen.getByText('Test Link').closest('a');
    expect(link).toHaveClass('text-main');
    expect(link).toHaveClass('text-sm');
    expect(link).toHaveClass('font-medium');
    expect(link).toHaveClass('custom-class');
  });

  it('renders without classN prop', () => {
    render(
      <MemoryRouter>
        <NavLink href="/test" classN="">
          Test Link
        </NavLink>
      </MemoryRouter>
    );

    const link = screen.getByText('Test Link').closest('a');
    expect(link).toHaveClass('text-main text-sm font-medium');
    expect(link).not.toHaveClass('undefined'); 
  });

  it('renders with empty children', () => {
    render(
      <MemoryRouter>
        <NavLink href="/test" classN="" children={undefined}>
        </NavLink>
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders with complex children', () => {
    render(
      <MemoryRouter>
        <NavLink href="/test" classN="">
          <span>Test</span>
          <strong>Link</strong>
        </NavLink>
      </MemoryRouter>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();

    const link = screen.getByText('Test').closest('a');
    expect(link).toHaveAttribute('href', '/test');
  });
});