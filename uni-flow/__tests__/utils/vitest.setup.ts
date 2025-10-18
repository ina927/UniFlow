import '@testing-library/jest-dom/vitest';
import React from 'react';
import { vi } from 'vitest';

// Mock any global browser APIs here
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
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

// Mock any other browser APIs your tests might need
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({
    width,
    height,
    alt = '',
    ...rest
  }: {
    width?: number;
    height?: number;
    alt?: string;
    [key: string]: unknown;
  }) => {
    return React.createElement('img', {
      ...rest,
      alt,
      width,
      height,
    });
  },
}));
