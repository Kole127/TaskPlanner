import { startTransition, useActionState, useEffect, useRef, memo } from "react";
import { isNotEmpty } from "../util/validation";
import { useLocation } from "react-router";

const initialFormState = {
  errors: null,
  enteredValues: {
    name: "",
    date: "",
    description: "",
  },
};

const TaskForm = memo(function TaskForm({
  selectedTask,
  setSelectedTask,
  addTask,
  updateTask,
}) {
  const formRef = useRef();
  const location = useLocation();

  useEffect(() => {
    setSelectedTask(null);
  }, [location.pathname]);

  async function addTaskAction(prevFormState, formData) {
    if (formData === null) {
      return initialFormState;
    }

    const name = formData.get("name");
    const date = formData.get("date");
    const description = formData.get("description");

    let errors = [];

    if (!isNotEmpty(name)) {
      errors.push("Name field is empty.");
    }
    if (!isNotEmpty(date)) {
      errors.push("Date field is empty.");
    }
    if (!isNotEmpty(description)) {
      errors.push("Description is not added.");
    }

    if (errors.length > 0) {
      return {
        errors,
        enteredValues: {
          name,
          date,
          description,
        },
      };
    }

    const task = { name, date, description };

    if (selectedTask) {
      await updateTask(selectedTask.id, task);
      setSelectedTask(null);
    } else {
      await addTask({ ...task, done: false });
    }

    return initialFormState;
  }

  const [formState, formAction, pending] = useActionState(
    addTaskAction,
    initialFormState
  );

  const handleCancelEdit = () => {
    formRef.current.reset();
    startTransition(() => formAction(null));
    setSelectedTask(null);
  };

  useEffect(() => {
    formRef.current.reset();
    startTransition(() => formAction(null));
  }, [selectedTask]);

  return (
    <div className="new-task">
      {!selectedTask && (
        <h2 className="text-2xl font-bold mb-5">Enter new task</h2>
      )}
      {selectedTask && <h2 className="text-2xl font-bold mb-5">Edit task</h2>}
      <form action={formAction} className="max-w-xl grid gap-4" ref={formRef} id="form">
        <p>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={
              selectedTask?.name || formState.enteredValues?.name || ""
            }
          />
        </p>
        <p>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            defaultValue={
              selectedTask?.date || formState.enteredValues?.date || ""
            }
          />
        </p>
        <p>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            defaultValue={
              selectedTask?.description ||
              formState.enteredValues?.description ||
              ""
            }
          />
        </p>
        {formState && formState.errors && (
          <ul>
            {formState.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
        <p className="pt-3">
          {!selectedTask && !pending && <button className="btn">Add</button>}
          {!selectedTask && pending && (
            <button className="btn">Submitting...</button>
          )}
          {selectedTask && !pending && (
            <>
              <button
                className="btn mr-2"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button className="btn">Save</button>
            </>
          )}
          {selectedTask && pending && (
            <>
              <button className="btn disabled:">Saving...</button>
            </>
          )}
        </p>
      </form>
    </div>
  );
});

export default TaskForm;
