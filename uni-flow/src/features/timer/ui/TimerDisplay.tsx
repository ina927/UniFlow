type TimerDisplayProps = {
  isWorkTime: boolean;
  secondsLeft: number;
  currentTask: { title: string } | null;
  formatTime: (seconds: number) => string;
};

export const TimerDisplay = ({ isWorkTime, secondsLeft, currentTask, formatTime }: TimerDisplayProps) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-primary-light">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-title1 text-white">
          {isWorkTime ? "Work Time" : "Break Time"}
        </h1>
        <div className="text-large-title-bold my-4 text-white">
          {formatTime(secondsLeft)}
        </div>
        {currentTask && (
          <div className="text-body1 text-white mt-2">
            Current Task: <strong>{currentTask.title}</strong>
          </div>
        )}
      </div>
    </div>
  );
};