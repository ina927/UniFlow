type TimerControlsProps = {
  isActive: boolean;
  toggle: () => void;
  reset: () => void;
  skip: () => void;
};

export const TimerControls = ({ isActive, toggle, reset, skip }: TimerControlsProps) => {
  return (
    <div>
      <button
        onClick={toggle}
        className={`px-4 py-2 mr-2 rounded text-body1-bold ${
          isActive
            ? "bg-button-active-light text-white"
            : "bg-button-deactive-light text-white"
        }`}
      >
        {isActive ? "Pause" : "Start"}
      </button>
      <button
        onClick={reset}
        className="px-4 py-2 rounded bg-components-fill text-primary"
      >
        Reset
      </button>
      <button
        onClick={skip}
        className="px-4 py-2 rounded bg-button-deactive-light text-white mr-2"
      >
        Skip
      </button>
    </div>
  );
};