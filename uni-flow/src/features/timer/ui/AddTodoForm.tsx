type AddTodoFormProps = {
  newTodo: any;
  setNewTodo: (todo: any) => void;
  subjects: { id: string; title: string }[];
  addTodo: () => void;
  onCancel: () => void; // New prop for handling cancel action
};

export const AddTodoForm = ({ newTodo, setNewTodo, subjects, addTodo, onCancel }: AddTodoFormProps) => {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-title3-bold mb-4">Add ToDo Item</h3>
      <div className="flex flex-col gap-4">
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
            value={newTodo.subjectId}
            onChange={(e) =>
              setNewTodo({
                ...newTodo,
                subjectId: e.target.value,
              })
            }
            className="ml-2 px-2 py-1 rounded border border-primary-light w-full"
          >
            <option value="">Select a subject</option>
            {Array.isArray(subjects) &&
              subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.title}
                </option>
              ))}
          </select>
        </label>
        <div>
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-primary-light text-white rounded shadow w-full"
          >
            Save ToDo
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