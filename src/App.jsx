import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./pages/Root";
import Home from "./pages/Home";
import TaskList from "./pages/TaskList";

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
    <RouterProvider router={router} />
  );
}

export default App;
