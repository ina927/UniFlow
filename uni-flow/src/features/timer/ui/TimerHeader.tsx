import Link from "next/link";

type TimerHeaderProps = {
  showAddTodoForm?: boolean;
  onToggleSettings: () => void;
  showSettings: boolean;
  onToggleAddTodo?: () => void;
};

const TimerHeader = ({
  showAddTodoForm,
  onToggleSettings,
  showSettings,
  onToggleAddTodo
}: TimerHeaderProps) => {
  return (
    <div className="fixed right-4 top-[80px] z-40 flex items-center gap-2">
      {/* History Page */}
      <Link href="/history">
        <button className="px-4 py-2 bg-primary-light text-white rounded-full shadow text-body1-bold hover:bg-button-hover-light">
          History
        </button>
      </Link>

      {/* Settings Toggle */}
      <button
        onClick={onToggleSettings}
        className="px-4 py-2 bg-button-deactive-light text-white rounded-full shadow text-body1-bold hover:bg-button-hover-light"
      >
        {showSettings ? "Close Settings" : "Settings"}
      </button>
    </div>
  );
};

export default TimerHeader;
