import { NavLink } from "react-router";

export default function MainNavigation() {
  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 "
      aria-label="Sidebar"
    >
      <nav className="h-full px-3 py-4 overflow-y-auto bg-zinc-150 dark:bg-slate-950">
        <ul className="space-y-2 font-medium">
        <li>
            <h2 className="text-slate-50 text-2xl pt-6 pb-10">TaskPlanner</h2>
          </li>
          <li>
            <NavLink
              to={"/"}
              className="nav-link"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/tasks"}
              className="nav-link"
            >
              Tasks
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
