import Link from "next/link";

type TimerHeaderProps = {
  showAddTodoForm: boolean;
  onToggleSettings: () => void;
  showSettings: boolean;
};

const TimerHeader = ({
  showAddTodoForm,
  onToggleSettings,
  showSettings,
}: TimerHeaderProps) => {
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-50">
      {/* History Page */}
      <Link href="/history">
        <button className="px-4 py-2 bg-primary-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light">
          History
        </button>
      </Link>

      {/* Settings Toggle */}
      <button
        onClick={onToggleSettings}
        className="px-4 py-2 bg-button-deactive-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light"
      >
        {showSettings ? "Close Settings" : "Settings"}
      </button>
    </div>
  );
};

export default TimerHeader;
