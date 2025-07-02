import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import SocialButton from './SocialButton';
import { FaFacebook } from 'react-icons/fa';

describe('SocialButton Component', () => {
  it('renders with label and icon', () => {
    const { getByText } = render(
      <SocialButton
        icon={<FaFacebook />}
        label="Facebook"
        onClick={() => {}}
        additionalClasses=""
        children={undefined}
      />,
    );

    expect(getByText('Facebook')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    const { getByText } = render(
      <SocialButton
        icon={<FaFacebook />}
        label="Facebook"
        onClick={handleClick}
        additionalClasses=""
        children={undefined}
      />,
    );

    fireEvent.click(getByText('Facebook'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies additional classes', () => {
    const { container } = render(
      <SocialButton
        icon={<FaFacebook />}
        label="Facebook"
        onClick={() => {}}
        additionalClasses="extra-class"
        children={undefined}
      />,
    );

    expect(container.firstChild).toHaveClass('extra-class');
  });

  it('applies default classes when no additional classes are provided', () => {
    const { container } = render(
      <SocialButton
        icon={<FaFacebook />}
        label="Facebook"
        onClick={() => {}}
        additionalClasses=""
        children={undefined}
      />,
    );

    expect(container.firstChild).toHaveClass(
      'flex items-center justify-center w-full py-2 px-4 border rounded-md transition-colors duration-300',
    );
  });

  it('renders the icon correctly', () => {
    const { container } = render(
      <SocialButton
        icon={<FaFacebook />}
        label="Facebook"
        onClick={() => {}}
        additionalClasses=""
        children={undefined}
      />,
    );

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
