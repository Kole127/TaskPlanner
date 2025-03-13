import { useContext } from "react";
import { TasksContext } from "../store/tasks-context";

export default function Home() {
  const {tasks, error} = useContext(TasksContext);

  return (
    <div className="text-center">
      <h2 className="text-3xl">Hello User</h2>
      <div className="next-tasks pt-10">Upcoming tasks</div>
    </div>
  );
}
