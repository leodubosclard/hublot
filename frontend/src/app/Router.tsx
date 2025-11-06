import { createBrowserRouter, RouterProvider } from "react-router";
import { LandingPage } from "../pages/Landing";
import { CountdownPage } from "../pages/Countdown/Countdown";
import { CreateCountdownPage } from "../pages/Countdown/Create";
import { YoutubeEditorPage } from "../pages/Tiktok/YoutubeEditor";

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
    path: '/tiktok/youtube',
    element: <YoutubeEditorPage />,
  },
]);

export const Router = () => (
    <RouterProvider router={router} />
);
