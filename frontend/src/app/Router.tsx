import { createBrowserRouter, RouterProvider } from "react-router";
import { LandingPage } from "../pages/Landing";
import { CountdownPage } from "../pages/Countdown/Countdown";
import { CreateCountdownPage } from "../pages/Countdown/Create";
import { SubtitlesPage } from "../pages/Subtitles/Subtitles";

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
  {
    path: '/subtitles',
    element: <SubtitlesPage />,
  },
]);

export const Router = () => (
    <RouterProvider router={router} />
);
