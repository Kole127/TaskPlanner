import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./pages/Root";
import Home from "./pages/Home";
import TaskList from "./pages/TaskList";
import TasksContextProvider from "./store/tasks-context";

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: 'tasks',
          element: <TaskList />
        }
      ]
    }
    
  ])

  return (
    <TasksContextProvider>
      <RouterProvider router={router} />
    </TasksContextProvider>
  );
}

export default App;
