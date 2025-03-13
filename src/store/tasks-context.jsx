import { createContext, useEffect, useState } from "react";
import { sortByDate } from "../util/dataManipulation";
import { createTs, deleteTs, editTs, getTs } from "../util/api";

export const TasksContext = createContext({
  tasks: [],
  setTasks: () => {},
  error: [],
  setError: () => {},
  isFetching: false,
  setIsFetching: () => {},
  selectedTask: null,
  setSelectedTask: () => {},
  deletingTask: null,
  setDeletingTask: () => {},
  deleteTask: () => {},
  addTask: () => {},
  updateTask: () => {},
});

export default function TasksContextProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);

      try {
        const resData = await getTs();

        // const loadTasks = [];
        // for (const key in resData) {
        //   loadTasks.push({
        //     id: key,
        //     done: resData[key].done ?? false,
        //     ...resData[key],
        //   });
        // }

        const loadTasks = Object.keys(resData).map((key) => ({
          id: key,
          done: resData[key] ?? false,
          ...resData[key],
        }));

        sortByDate(loadTasks);
        setTasks(loadTasks);
        // setIsFetching(false);
      } catch (error) {
        setError({
          message: error.message || "There was an error while fetching data.",
        });
        // setIsFetching(false);
      } finally {
        setIsFetching(false);
      }
    }

    fetchData();
  }, []);

  async function deleteTask(id) {
    const prevTasks = [...tasks];
    const updatedTasks = sortByDate(prevTasks.filter((task) => task.id !== id));
    setTasks(updatedTasks);

    try {
      await deleteTs(id);
    } catch (error) {
      setError({
        message: error.message || "There was an error while deleting the item.",
      });
      setTasks(prevTasks);
    }
  }

  async function updateTask(id, task) {
    const prevTasks = [...tasks];
    setTasks((prevState) => {
      return sortByDate(
        prevState.map((item) => (item.id === id ? { ...item, ...task } : item))
      );
    });

    try {
      await editTs(id, task);
    } catch (error) {
      setError({
        message: error.message.includes("Failed to fetch")
          ? "Network error."
          : error.message || "Failed to update a task.",
      });
      setTasks(prevTasks);
    }
  }

  async function addTask(task) {
    const prevTasks = [...tasks];

    try {
      const resData = await createTs(task);
      const newTask = { id: resData.name, ...task };

      setTasks((prevState) => sortByDate([...prevState, newTask]));
    } catch (error) {
      setError({
        message: error.message.includes("Failed to fetch")
          ? "There is an network error."
          : "Failed to add the task.",
      });
      setTasks(prevTasks);
    }
  }

  const ctxValue = {
    tasks,
    setTasks,
    error,
    setError,
    isFetching,
    setIsFetching,
    selectedTask,
    setSelectedTask,
    deletingTask,
    setDeletingTask,
    deleteTask,
    addTask,
    updateTask,
  };

  return (
    <TasksContext.Provider value={ctxValue}>{children}</TasksContext.Provider>
  );
}
