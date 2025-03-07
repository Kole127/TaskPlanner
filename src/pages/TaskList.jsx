import { useEffect, useState } from "react";
import Task from "../components/Task";
import TaskForm from "../components/TaskForm";
import Modal from "../components/UI/Modal";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);

      try {
        const response = await fetch(
          "https://react-redux-80deb-default-rtdb.europe-west1.firebasedatabase.app/tasks.json"
        );

        if (!response.ok) {
          throw new Error("Failed to get the data!");
        }

        const resData = await response.json();
        const loadTasks = [];

        for (const key in resData) {
          loadTasks.push({
            id: key,
            ...resData[key],
          });
        }
        loadTasks.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });

        setTasks(loadTasks);
        setIsFetching(false);

      } catch (error) {
        setError({
          message: error.message || "There was an error while fetching data.",
        });
        setIsFetching(false);
      }
    }

    fetchData();
  }, []);

  async function deleteTask(id) {
    try {
      const response = await fetch(
        `https://react-redux-80deb-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get the data!");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    } catch (error) {
      setError({
        message: error.message || "There was an error while deleting the item.",
      });
    }
  }

  async function addTask(task) {
    try {
      const response = await fetch(
        "https://react-redux-80deb-default-rtdb.europe-west1.firebasedatabase.app/tasks.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add task!");
      }

      const responseData = await response.json();
      const newTask = { id: responseData.name, ...task };

      setTasks((prevState) =>
        [...prevState, newTask].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      );
      
    } catch (error) {
      setError({
        message: error.message.includes("Failed to fetch")
          ? "There is an network error."
          : message.error || "Failed to add the task.",
      });
    }
  }

  async function updateTask(id, task) {
    try {
      const response = await fetch(
        `https://react-redux-80deb-default-rtdb.europe-west1.firebasedatabase.app/tasks/${id}.json`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update a task");
      }

      setTasks((prevState) =>
        prevState.map((item) => (item.id === id ? { ...item, ...task } : item))
      );

    } catch (error) {
      setError({
        message: error.message.includes("Failed to fetch")
          ? "Network error."
          : error.message || "Failed to update a task.",
      });
    }
  }

  function handleDelete(id) {
    setDeletingTask(id);
  }

  function confirmDelete() {
    deleteTask(deletingTask);
    setDeletingTask(null);
  }

  function cancelDelete() {
    setDeletingTask(null);
  }

  function handleEdit(id) {
    const taskToEdit = tasks.find((task) => task.id === id);
    setSelectedTask(taskToEdit);
  }

  async function handleMarking(id) {
    const taskToEdit = tasks.find((task) => task.id === id);
    const editedTask = { ...taskToEdit, done: !taskToEdit.done };
    setTasks((prevTasks) =>
      prevTasks.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
    await updateTask(id, editedTask);
  }

  return (
    <>
      {error && (
        <Modal open={error}>
          <p>{error?.message}</p>
          {console.log(error.message)}
          <button
            className="btn w-24 mt-4 self-center"
            onClick={() => {
              setError(null);
            }}
          >
            Dismiss
          </button>
        </Modal>
      )}
      {deletingTask !== null && (
        <Modal open={deletingTask !== null}>
          <p className="pb-2">Are you sure?</p>
          <p className="pb-8">This action will permanently delete the task.</p>
          <nav className="flex justify-center gap-5">
            <button
              className="btn bg-red-600 hover:bg-red-500 hover:text-slate-200"
              onClick={confirmDelete}
            >
              Confirm
            </button>
            <button className="btn" onClick={cancelDelete}>
              Cancel
            </button>
          </nav>
        </Modal>
      )}
      <div>
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="task-list grid grid-cols-[repeat(auto-fit,minmax(200px,250px))] gap-3 pt-4 pb-16">
          {error && <p>{error.message}</p>}
          {isFetching ? (
            <p>There is no tasks at this moment..</p>
          ) : (
            tasks.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                done={task.done}
                name={task.name}
                date={task.date}
                description={task.description}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onMark={handleMarking}
                selectedTask={selectedTask}
              />
            ))
          )}
        </div>
      </div>
      <TaskForm
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        addTask={addTask}
        updateTask={updateTask}
      />
    </>
  );
}
