type SettingsModelProps = {
  workTime: number;
  setWorkTime: (value: number) => void;
  shortBreakTime: number;
  setShortBreakTime: (value: number) => void;
  longBreakTime: number;
  setLongBreakTime: (value: number) => void;
  longBreakInterval: number;
  setLongBreakInterval: (value: number) => void;
  autoStartBreaks: boolean;
  setAutoStartBreaks: (value: boolean) => void;
  autoStartPomodoro: boolean;
  setAutoStartPomodoro: (value: boolean) => void;
  closeSettings: () => void;
};

const SettingsModel = ({
  workTime,
  setWorkTime,
  shortBreakTime,
  setShortBreakTime,
  longBreakTime,
  setLongBreakTime,
  longBreakInterval,
  setLongBreakInterval,
  autoStartBreaks,
  setAutoStartBreaks,
  autoStartPomodoro,
  setAutoStartPomodoro,
  closeSettings,
}: SettingsModelProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-4 max-w-md w-full">
      <h3 className="text-title3-bold mb-4">Timer Settings</h3>
      <div className="flex flex-col gap-4">
        <label>
          Work Time (minutes):
          <input
            type="number"
            value={workTime / 60}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value)); // Prevent values less than 1
              console.log("Work Time Updated:", value);
              setWorkTime(value * 60);
            }}
            className="ml-2 px-2 py-1 rounded border border-primary-light w-full"
          />
        </label>
        <label>
          Short Break Time (minutes):
          <input
            type="number"
            value={shortBreakTime / 60}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              console.log("Short Break Time Updated:", value);
              setShortBreakTime(value * 60);
            }}
            className="ml-2 px-2 py-1 rounded border border-primary-light w-full"
          />
        </label>
        <label>
          Long Break Time (minutes):
          <input
            type="number"
            value={longBreakTime / 60}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              console.log("Long Break Time Updated:", value);
              setLongBreakTime(value * 60);
            }}
            className="ml-2 px-2 py-1 rounded border border-primary-light w-full"
          />
        </label>
        <label>
          Long Break Interval (Pomodoros):
          <input
            type="number"
            value={longBreakInterval}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              console.log("Long Break Interval Updated:", value);
              setLongBreakInterval(value);
            }}
            className="ml-2 px-2 py-1 rounded border border-primary-light w-full"
          />
        </label>
        <label>
          Auto-Start Breaks:
          <input
            type="checkbox"
            checked={autoStartBreaks}
            onChange={(e) => {
              console.log("Auto-Start Breaks Updated:", e.target.checked);
              setAutoStartBreaks(e.target.checked);
            }}
            className="ml-2"
          />
        </label>
        <label>
          Auto-Start Pomodoros:
          <input
            type="checkbox"
            checked={autoStartPomodoro}
            onChange={(e) => {
              console.log("Auto-Start Pomodoros Updated:", e.target.checked);
              setAutoStartPomodoro(e.target.checked);
            }}
            className="ml-2"
          />
        </label>
      </div>
      <button
        onClick={() => {
          console.log("Closing Settings");
          closeSettings();
        }}
        className="px-4 py-2 bg-red-500 text-white rounded shadow mt-4"
      >
        Close
      </button>
    </div>
  );
};

export default SettingsModel;