import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('@/context/UserContext', () => ({
  UserContext: { Provider: vi.fn(), Consumer: vi.fn() },
}));