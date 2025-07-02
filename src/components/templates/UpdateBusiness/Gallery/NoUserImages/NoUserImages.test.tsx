import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NoUserImages from './NoUserImages';
import { useTranslation } from 'react-i18next';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

describe('NoUserImages Component', () => {
  const mockTranslate = vi.fn((key) => key);

  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslation as any).mockReturnValue({
      t: mockTranslate,
    });
  });

  it('renders correctly with translated text', () => {
    render(<NoUserImages />);
    
    expect(screen.getByText('Your Gallery is Empty')).toBeInTheDocument();
    expect(
      screen.getByText('You currently have no images in your gallery. Start uploading images to showcase your creativity!')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Upload your first image using the drop zone above. We look forward to seeing your work!')
    ).toBeInTheDocument();
    expect(screen.getByText('Go to Upload')).toBeInTheDocument();
  });

  it('handles button click to scroll to top', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<NoUserImages />);
    
    const uploadButton = screen.getByText('Go to Upload');
    fireEvent.click(uploadButton);
    
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    scrollToSpy.mockRestore();
  });

});