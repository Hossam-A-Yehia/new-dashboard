import { describe, it, expect, vi, beforeEach } from 'vitest';
import {  render, screen } from '@testing-library/react';
import MapComponent from './Map';
import {  useJsApiLoader } from '@react-google-maps/api';

vi.mock('@react-google-maps/api', () => ({
  useJsApiLoader: vi.fn(),
  GoogleMap: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
    <div data-testid="google-map" {...props}>
      {children}
    </div>
  ),
  Marker: ({ position }: { position: { lat: number; lng: number } }) => <div data-testid="marker" data-position={JSON.stringify(position)} />,
}));

const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};
vi.stubGlobal('navigator', {
  geolocation: mockGeolocation,
});

describe('MapComponent', () => {
  const defaultProps = {
    setLatLng: vi.fn(),
    defaultLocation: undefined,
  };

  const KSALatLng = { lat: 24.7136, lng: 46.6753 };

  beforeEach(() => {
    vi.clearAllMocks();
    (useJsApiLoader as any).mockReturnValue({
      isLoaded: false,
      loadError: null,
    });
    mockGeolocation.getCurrentPosition.mockReset();
  });

  it('renders loading state when Google Maps API is not loaded', () => {
    render(<MapComponent {...defaultProps} />);
    expect(screen.getByText('Loading maps...')).toBeInTheDocument();
  });

  it('renders error message when Google Maps API fails to load', () => {
    (useJsApiLoader as any).mockReturnValue({
      isLoaded: false,
      loadError: new Error('API load error'),
    });
    render(<MapComponent {...defaultProps} />);
    expect(screen.getByText('Error loading maps')).toBeInTheDocument();
  });

  it('renders GoogleMap with default KSA location when no defaultLocation or geolocation', () => {
    (useJsApiLoader as any).mockReturnValue({
      isLoaded: true,
      loadError: null,
    });
    render(<MapComponent {...defaultProps} />);
    const map = screen.getByTestId('google-map');
    expect(map).toBeInTheDocument();
    const marker = screen.getByTestId('marker');
    expect(marker).toHaveAttribute('data-position', JSON.stringify(KSALatLng));
  });

});