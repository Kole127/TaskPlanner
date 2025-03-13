import { Link } from "react-router";
import { HashLink } from "react-router-hash-link";

export default function Task({
  id,
  done,
  name,
  date,
  description,
  onDelete,
  onEdit,
  onMark,
  selectedTask,
}) {
  const formatedDate = new Date(date)
    .toLocaleDateString("hr")
    .replace(/\s+/g, "");

  const taskClass = done
    ? `card-wrapper aspect-square w-full ${done ? "active" : undefined}`
    : "card-wrapper aspect-square w-full";

  return (
    <div className={taskClass}>
      <div className="card-content flex flex-col items-center justify-center text-xs">
        <h4 className=" text-xl pb-3">{name}</h4>
        {!selectedTask && (
          <input
            className="mb-5"
            type="checkbox"
            name="mark"
            checked={done}
            onChange={() => {
              onMark(id);
            }}
          />
        )}
        <p className=" pb-4 text-xs italic">Due date: {formatedDate}</p>
        <p className="text-center">{description}</p>
        <menu className="mt-5 flex gap-2">
          {!selectedTask && (
            <>
              <HashLink smooth to={'#form'}>
                <button className="btn" onClick={() => onEdit(id)}>
                  Edit
                </button>
              </HashLink>
              <button className="btn" onClick={() => onDelete(id)}>
                Delete
              </button>
            </>
          )}
        </menu>
      </div>
    </div>
  );
}
