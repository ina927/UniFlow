type TimerControlsProps = {
  isActive: boolean;
  toggle: () => void;
  reset: () => void;
  skip: () => void;
};

export const TimerControls = ({ isActive, toggle, reset, skip }: TimerControlsProps) => {
  return (
    <div className="flex gap-4 mt-2 mb-8">
      <button
        onClick={toggle}
        className={`w-28 py-2 rounded-full font-bold transition-colors duration-150 ${
          isActive
            ? "bg-primary text-white border-2 border-white hover:bg-primary-dark"
            : "bg-white text-primary border border-primary hover:bg-primary-light"
        }`}
      >
        {isActive ? "Pause" : "Start"}
      </button>

      <button
        onClick={reset}
        className="w-28 py-2 rounded-full font-bold bg-white text-primary border border-primary hover:bg-primary-light transition-colors duration-150"
      >
        Reset
      </button>

      <button
        onClick={skip}
        className="w-28 py-2 rounded-full font-bold bg-white text-primary border border-primary hover:bg-primary-light transition-colors duration-150"
      >
        Skip
      </button>
    </div>
  );
};

export default TimerControls;