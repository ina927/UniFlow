"use client";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";

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
    <div className="w-full max-w-xl rounded-2xl bg-white px-4">
      <h3 className="text-title2-bold mt-6 mb-1">Timer Settings</h3>
      <p className="text-sm text-[var(--muted-foreground)] mb-8">
        Adjust your focus and break preferences.
      </p>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Work Time */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[var(--primary)]">
            Work Time (minutes)
          </Label>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            value={workTime / 60}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              setWorkTime(value * 60);
            }}
            placeholder="e.g. 25"
            className="h-10"
          />
        </div>

        {/* Short Break */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[var(--primary)]">
            Short Break (minutes)
          </Label>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            value={shortBreakTime / 60}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              setShortBreakTime(value * 60);
            }}
            placeholder="e.g. 5"
            className="h-10"
          />
        </div>

        {/* Long Break */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[var(--primary)]">
            Long Break (minutes)
          </Label>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            value={longBreakTime / 60}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              setLongBreakTime(value * 60);
            }}
            placeholder="e.g. 15"
            className="h-10"
          />
        </div>

        {/* Long Break Interval */}
        <div className="flex flex-col gap-2">
          <Label className="font-semibold text-[var(--primary)]">
            Long Break Interval (Pomodoros)
          </Label>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            value={longBreakInterval}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              setLongBreakInterval(value);
            }}
            placeholder="e.g. 4"
            className="h-10"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <input
              id="autoBreaks"
              type="checkbox"
              checked={autoStartBreaks}
              onChange={(e) => setAutoStartBreaks(e.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            <Label htmlFor="autoBreaks" className="text-sm">
              Auto-Start Breaks
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="autoPomo"
              type="checkbox"
              checked={autoStartPomodoro}
              onChange={(e) => setAutoStartPomodoro(e.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            <Label htmlFor="autoPomo" className="text-sm">
              Auto-Start Pomodoros
            </Label>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end gap-8">
          <Button
            type="button"
            onClick={closeSettings}
            className="h-10 px-5"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsModel;
