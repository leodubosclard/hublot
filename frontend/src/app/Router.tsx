import { createBrowserRouter, RouterProvider } from "react-router";
import { LandingPage } from "../pages/Landing";
import { CountdownPage } from "../pages/Countdown/Countdown";
import { CreateCountdownPage } from "../pages/Countdown/Create";

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/countdown',
    element: <CountdownPage />,
  },
  {
    path: '/countdown/create',
    element: <CreateCountdownPage />,
  },
]);

export const Router = () => (
    <RouterProvider router={router} />
);
