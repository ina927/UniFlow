import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  }),
}));


import React from 'react';

// Mock next/image
jest.mock('next/image', () => ({
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
