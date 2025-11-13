import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock global para fetch
globalThis.fetch = vi.fn();

// Mock para matchMedia (para componentes que usan media queries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
