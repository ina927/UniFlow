import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

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
