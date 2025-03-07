import { Outlet } from "react-router";
import MainNavigation from "../components/MainNavigation";

export default function RootLayout() {
  return (
    <>
      <MainNavigation />
      <main className="h-full px-6 py-16 sm:ml-64">
        <Outlet />
      </main>
    </>
  );
}
