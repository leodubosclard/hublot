import { createBrowserRouter, RouterProvider } from "react-router";
import { LandingPage } from "../pages/Landing";
import { CountdownPage } from "../pages/Countdown/Countdown";
import { CreateCountdownPage } from "../pages/Countdown/Create";
import { SubtitlesPage } from "../pages/Subtitles/Subtitles";
import { VideoViewerPage } from "../pages/VideoViewer/VideoViewer";

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
  {
    path: '/video-viewer',
    element: <VideoViewerPage />,
  }
]);

export const Router = () => (
    <RouterProvider router={router} />
);
