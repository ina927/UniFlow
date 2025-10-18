import TimerControls from "./TimerControls";

type TimerDisplayProps = {
  isWorkTime: boolean;
  secondsLeft: number;
  currentTask?: { title: string } | null;
  formatTime: (seconds: number) => string;
  isActive: boolean;
  toggle: () => void;
  reset: () => void;
  skip: () => void;
  totalSessionTime: number;
};

export const TimerDisplay = ({
  isWorkTime,
  secondsLeft,
  currentTask,
  formatTime,
  isActive,
  toggle,
  reset,
  skip,
  totalSessionTime, // <- use this instead of workTime
}: TimerDisplayProps) => {
  const radius = 120;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = secondsLeft / totalSessionTime;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="w-full h-full flex items-center justify-center bg-primary-light">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-title1 text-white mt-8">
          {isWorkTime ? "Work Time" : "Break Time"}
        </h1>
        <div className="my-4 relative flex items-center justify-center w-64 h-64">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="absolute"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              stroke="#fff"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              style={{ opacity: 0.2 }}
            />
            <circle
              stroke="#fff"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span className="text-large-title-bold text-white absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {formatTime(secondsLeft)}
          </span>
        </div>
        {currentTask && (
          <div className="text-body1 text-white mt-2">
            Current Task: <strong>{currentTask.title}</strong>
          </div>
        )}
        <div className="mt-6">
          <TimerControls
            isActive={isActive}
            toggle={toggle}
            reset={reset}
            skip={skip}
          />
        </div>
      </div>
    </div>
  );
};
