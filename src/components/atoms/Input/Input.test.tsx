import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Input from './Input';

describe('Input Component', () => {
  const defaultProps = {
    id: 'test-input',
    type: 'text',
    value: '',
    onChange: vi.fn(),
    placeholder: 'Enter text',
    required: false,
    name: 'test',
    touched: false,
    errors: '',
    readOnly: false,
    onClick: vi.fn(),
    disabled: false,
    onBlur: vi.fn(),
  };

  it('renders TextField with correct props', () => {
    render(<Input {...defaultProps} />);
    
    const input = screen.getByTestId('test-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).not.toBeRequired();
    expect(input).not.toBeDisabled();
    expect(input).not.toHaveAttribute('readonly');
  });

  it('displays error state when touched and errors exist', () => {
    render(<Input {...defaultProps} touched={true} errors="Required field" />);
    
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies disabled prop correctly', () => {
    render(<Input {...defaultProps} disabled={true} />);
    
    const input = screen.getByTestId('test-input');
    expect(input).toBeDisabled();
  });

  it('applies readOnly prop correctly', () => {
    render(<Input {...defaultProps} readOnly={true} />);
    
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('readonly');
  });

  it('calls onClick handler when input is clicked', () => {
    render(<Input {...defaultProps} />);
    
    const input = screen.getByTestId('test-input');
    input.click();
    
    expect(defaultProps.onClick).toHaveBeenCalled();
  });
});