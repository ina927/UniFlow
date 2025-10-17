import { useHistory } from '@/features/history/hooks/useHistory';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock browser environment
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock document and window
beforeEach(() => {
  // Mock document
  global.document = {
    ...global.document,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    visibilityState: 'visible',
    hidden: false,
  } as any;

  // Mock window
  global.window = {
    ...global.window,
    localStorage: mockLocalStorage,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  } as any;

  // Mock fetch
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});

// Mock API response type
type TimerSession = {
  id: string;
  todo: {
    title: string;
    subject: { title: string };
    status: string;
  };
  startTime: string;
  endTime: string;
};

// Test data
const mockSessions: TimerSession[] = [
  {
    id: '1',
    todo: {
      title: 'Math Homework',
      subject: { title: 'Algebra' },
      status: 'DONE',
    },
    startTime: '2025-09-28T10:00:00Z',
    endTime: '2025-09-28T10:25:00Z',
  },
  {
    id: '2',
    todo: {
      title: 'Science Project',
      subject: { title: 'Physics' },
      status: 'DONE',
    },
    startTime: '2025-09-28T11:00:00Z',
    endTime: '2025-09-28T11:25:00Z',
  },
];

describe('useHistory', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock fetch implementation
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ timerSessions: mockSessions }),
    });
  });

  it('should fetch and return timer session history', async () => {
    const { result } = renderHook(() => useHistory('user-123'));

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify the data was processed correctly
    expect(result.current.history).toHaveLength(2);
    expect(result.current.totalPomodoros).toBe(2);

    // Verify the first session
    expect(result.current.history[0]).toEqual({
      id: '1',
      taskTitle: 'Math Homework',
      subject: 'Algebra',
      status: 'DONE',
      startTime: '2025-09-28T10:00:00Z',
      endTime: '2025-09-28T10:25:00Z',
      duration: 25, // minutes
    });

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/timer-sessions/user-123'),
      expect.any(Object)
    );
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch history';
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useHistory('user-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.history).toEqual([]);
    expect(result.current.totalPomodoros).toBe(0);
  });
});
