import { useContext, useEffect, useState } from "react";
import { sortByDate } from "../util/dataManipulation";
import Task from "../components/Task";
import TaskForm from "../components/TaskForm";
import Modal from "../UI/Modal";
import { TasksContext } from "../store/tasks-context";

export default function TaskList() {
  const {
    tasks,
    setTasks,
    error,
    setError,
    isFetching,
    selectedTask,
    setSelectedTask,
    deletingTask,
    setDeletingTask,
    deleteTask,
    addTask,
    updateTask
  } = useContext(TasksContext);

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
    setSelectedTask(tasks.find((task) => task.id === id));
  }

  async function handleMarking(id) {
    const prevTasks = [...tasks];
    const taskToEdit = tasks.find((task) => task.id === id);
    const editedTask = { ...taskToEdit, done: !taskToEdit.done };
    setTasks((prevState) =>
      prevState.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );

    try {
      await updateTask(id, editedTask);
    } catch (error) {
      setTasks(prevTasks);
    }
  }

  return (
    <>
      {error && (
        <Modal open={error}>
          <p>{error?.message}</p>
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
              type="button"
              className="btn bg-red-600 hover:bg-red-500 hover:text-slate-200"
              onClick={confirmDelete}
            >
              Confirm
            </button>
            <button type="button" className="btn" onClick={cancelDelete}>
              Cancel
            </button>
          </nav>
        </Modal>
      )}
      <div>
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="task-list grid grid-cols-[repeat(auto-fit,minmax(200px,250px))] gap-3 pt-4 pb-16">
          {isFetching ? (
            <p>Loading...</p>
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