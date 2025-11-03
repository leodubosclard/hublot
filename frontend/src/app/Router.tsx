import { createBrowserRouter, RouterProvider } from "react-router";
import { LandingPage } from "../pages/Landing";

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  }
]);

export const Router = () => (
    <RouterProvider router={router} />
);
