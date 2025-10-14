type HistorySummaryProps = {
  totalFocusHours: number;
  totalPomodoros: number;
};

const HistorySummary = ({ totalFocusHours, totalPomodoros }: HistorySummaryProps) => {
  return (
    <div className="bg-primary-light rounded-lg shadow-lg px-8 py-6 mb-8 flex flex-col items-center w-full max-w-[1920px] max-h-[1080px]">
      <span className="text-title2-bold text-white mb-2">Total Focus Hours</span>
      <span className="text-large-title-bold text-white mb-4">
        {totalFocusHours.toFixed(2)} hrs
      </span>
      <span className="text-title2-bold text-white mb-2">Total Pomodoros Completed</span>
      <span className="text-large-title-bold text-white">
        {totalPomodoros}
      </span>
    </div>
  );
};

export default HistorySummary;