export type Task = {
  id: string;
  title: string;
  description?: string;
  subjectName?: string;
  subjectId?: string; 
  startDate?: string;
  endDate?: string;
};

type TaskListProps = {
  tasks: Task[];
  setCurrentTask: React.Dispatch<React.SetStateAction<Task | null>>;
  deleteTodo: (taskId: string) => void;
  onToggleAddTodo: () => void; // <-- Add this prop
  showAddTodoForm: boolean;    // <-- Optionally, for button text
};

export const TaskList = ({
  tasks,
  setCurrentTask,
  deleteTodo,
  subjects,
  onToggleAddTodo,
  showAddTodoForm,
}: TaskListProps & { subjects: { id: string; title: string }[] }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 w-full">
        <h1 className="text-title2-bold text-primary text-left">Tasks</h1>
        <button
          onClick={onToggleAddTodo}
          className="px-6 py-4 bg-white text-black rounded text-2xl font-bold"
        >
          {showAddTodoForm ? "Close ToDo" : "+"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            // Find subject title by subjectId
            const subjectTitle =
              task.subjectId && subjects.length > 0
                ? subjects.find((s) => s.id === task.subjectId)?.title || "Other"
                : "Other";
            return (
              <div
                key={task.id}
                className="p-6 rounded-lg shadow-md bg-white border border-primary-light flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-body1-bold text-primary mb-2">{task.title}</h3>
                  <p className="text-body2 text-gray-600 mb-2">
                    {task.description || "No description provided"}
                  </p>
                  <p className="text-body2 text-gray-600 mb-2">
                    Subject: {subjectTitle}
                  </p>
                </div>
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  {task.startDate && (
                    <p>Start: {new Date(task.startDate).toLocaleDateString()}</p>
                  )}
                  {task.endDate && (
                    <p>Due: {new Date(task.endDate).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentTask(task)}
                    className="px-4 py-2 bg-primary-light text-white rounded shadow"
                  >
                    Set as Current Task
                  </button>
                  <button
                    onClick={() => deleteTodo(task.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded shadow"
                  >
                    X
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-body2 text-gray-600">No tasks available.</p>
        )}
      </div>
    </div>
  );
};
