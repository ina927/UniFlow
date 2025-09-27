type Task = {
  id: string;
  title: string;
  description?: string;
  subjectName?: string;
  subjectId?: string; // <-- Add this line
  startDate?: string;
  endDate?: string;
};

type TaskListProps = {
  tasks: Task[];
  setCurrentTask: (task: Task) => void;
  deleteTodo: (taskId: string) => void;
};

export const TaskList = ({ tasks, setCurrentTask, deleteTodo }: TaskListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {tasks.length > 0 ? (
        tasks.map((task) => (
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
                Subject: {task.subjectName}
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
                onClick={() => setCurrentTask(task)} // Pass the full task object
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
        ))
      ) : (
        <p className="text-body2 text-gray-600">No tasks available.</p>
      )}
    </div>
  );
};