import { useState } from "react";

type AddTodoFormProps = {
  subjects: { id: string; title: string }[];
  newTodo: any;
  setNewTodo: (todo: any) => void;
  addTodo: () => void;
  onCancel: () => void;
};

export const AddTodoForm = ({
  subjects,
  newTodo,
  setNewTodo,
  addTodo,
  onCancel,
}: AddTodoFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    // Title validation
    if (!newTodo.title || newTodo.title.trim() === "") {
      setError("Title is required.");
      return;
    }
    // Date validation
    if (!newTodo.endDate) {
      setError("End Date is required.");
      return;
    }
    // Check if date is valid and in the future
    const selectedDate = new Date(newTodo.endDate);
    const now = new Date();
    if (isNaN(selectedDate.getTime())) {
      setError("End Date is invalid.");
      return;
    }
    if (selectedDate < now) {
      setError("End Date must be in the future.");
      return;
    }
    setError(null);
    addTodo();
    onCancel(); 
  };

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-title3-bold mb-4">Add Task</h3>
      <div className="flex flex-col gap-4">
        {error && (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        )}
        <label>
          Title:
          <input
            type="text"
            value={newTodo.title}
            onChange={(e) =>
              setNewTodo({
                ...newTodo,
                title: e.target.value,
              })
            }
            className="ml-2 px-2 py-1 rounded border border-primary-light w-full"
            placeholder="Enter task title"
            required
          />
        </label>
        <label>
          Content:
          <textarea
            value={newTodo.content}
            onChange={(e) =>
              setNewTodo({
                ...newTodo,
                content: e.target.value,
              })
            }
            className="ml-2 px-2 py-1 rounded border border-primary-light w-full"
            placeholder="Enter task content"
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={newTodo.endDate}
            onChange={(e) =>
              setNewTodo({
                ...newTodo,
                endDate: e.target.value,
              })
            }
            className="ml-2 px-2 py-1 rounded border border-primary-light"
            required
          />
        </label>
        <label>
          Subject:
          <select
            value={newTodo.subjectId || ""}
            onChange={(e) =>
              setNewTodo({
                ...newTodo,
                subjectId: e.target.value,
              })
            }
            className="ml-2 px-2 py-1 rounded border border-primary-light w-full"
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.title}
              </option>
            ))}
          </select>
        </label>
        <div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-light text-white rounded shadow w-full"
          >
            Create
          </button>
        </div>
        <div>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded shadow w-full mt-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};