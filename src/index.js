import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LogIn, { action as loginAction } from './routes/LogInPage';
import ErrorPage from './components/error-page';
import Home, { loader as homeLoader } from './routes/HomePage';
import Channel, { action as createMessageAction, loader as channelLoader } from './routes/Channel';
import Edit, { action as editAction, loader as editLoader} from './routes/EditPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LogIn />,
    action: loginAction,
    errorElement: <LogIn errorMessage={"Datos incorrectos."} />,
  },
  {
    path: "/:userId",
    element: <Home />,
    loader: homeLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/:userId/:channelId",
        element: <Channel />,
        loader: channelLoader,
        action: createMessageAction
      },
      {
        path: "/:userId/:channelId/:messageId",
        element: <Edit />,
        action: editAction,
        loader: editLoader
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
