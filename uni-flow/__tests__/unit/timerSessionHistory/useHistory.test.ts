import { renderHook, act } from "@testing-library/react";
import { useHistory } from "./useHistory";

// Mock fetch for timer sessions
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
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
) as jest.Mock;

describe("useHistory", () => {
  it("counts completed Pomodoro sessions", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useHistory());

    // Wait for useEffect to fetch and set history
    await waitForNextUpdate();

    expect(result.current.totalPomodoros).toBe(2);
    expect(result.current.history.length).toBe(2);
    expect(result.current.history[0].taskTitle).toBe("Math");
    expect(result.current.history[1].subject).toBe("Physics");
  });
});