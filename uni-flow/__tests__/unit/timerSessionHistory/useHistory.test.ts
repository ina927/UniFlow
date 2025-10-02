/// <reference types="vitest" />
/**
 * @vitest-environment jsdom
 */

import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useHistory } from "../../../src/features/history/hooks/useHistory";

// Mock fetch for timer sessions
beforeEach(() => {
  global.fetch = vi.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      timerSessions: [
        {
          id: "1",
          todo: { title: "Math", subject: { title: "Algebra" }, status: "DONE" },
          startTime: "2025-09-28T10:00:00Z",
          endTime: "2025-09-28T10:25:00Z",
        },
        {
          id: "2",
          todo: { title: "Science", subject: { title: "Physics" }, status: "DONE" },
          startTime: "2025-09-28T11:00:00Z",
          endTime: "2025-09-28T11:25:00Z",
        },
      ],
    }),
  })
  ) as unknown as typeof fetch;
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("useHistory", () => {
  it("counts completed Pomodoro sessions", async () => {
    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.history.length).toBe(2);
    });

    expect(result.current.totalPomodoros).toBe(2);
    expect(result.current.history.length).toBe(2);
    expect(result.current.history[0].taskTitle).toBe("Math");
    expect(result.current.history[1].subject).toBe("Physics");
  });
});