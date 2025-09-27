type TimerHeaderProps = {
  onToggleAddTodo: () => void;
  showAddTodoForm: boolean;
  onToggleSettings: () => void;
  showSettings: boolean;
};

const TimerHeader = ({
  onToggleAddTodo,
  showAddTodoForm,
  onToggleSettings,
  showSettings,
}: TimerHeaderProps) => {
  return (
    <header className="w-full text-white px-4 py-4 flex justify-end">
      {/* Buttons */}
      <div className="flex gap-4">
        {/* Add ToDo Button */}
        <button
          onClick={onToggleAddTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow"
        >
          {showAddTodoForm ? "Close Add ToDo" : "Add ToDo"}
        </button>

        {/* Settings Button */}
        <button
          onClick={onToggleSettings}
          className="px-4 py-2 bg-gray-500 text-white rounded shadow"
        >
          {showSettings ? "Close Settings" : "Open Settings"}
        </button>

        {/* History Button */}
        <button
          onClick={() => (window.location.href = "/history")}
          className="px-4 py-2 bg-green-500 text-white rounded shadow"
        >
          View History
        </button>
      </div>
    </header>
  );
};

export default TimerHeader;