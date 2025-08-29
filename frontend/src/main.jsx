import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import "./custom.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js"

import Home from "./routes/Home/Home.jsx";
import Loja from "./routes/Loja/Loja.jsx";
import Error from "./components/Error.jsx";
import Perfil from "./routes/Perfil/Perfil.jsx";
import Ranking from "./routes/Ranking/Ranking.jsx";
import Jogar from "./routes/Jogar/Jogar.jsx";

import Me from "./routes/Perfil/Me/Me.jsx";
import Inventario from "./routes/Perfil/Inventario/Inventario.jsx";
import Trocas from "./routes/Perfil/Trocas/Trocas.jsx";
import Time from "./routes/Perfil/Time/Time.jsx";
import Configuracoes from "./routes/Perfil/Configuracoes/Configuracoes.jsx";

import Login from "./services/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/Loja",
        element: <Loja />,
      },
      {
        path: "/Perfil",
        element: <Perfil />,
        children: [
          {
            path: "Me",
            element: <Me />,
          },
          {
            path: "Inventario",
            element: <Inventario />,
          },
          {
            path: "Trocas",
            element: <Trocas />,
          },
          {
            path: "Time",
            element: <Time />,
          },
          {
            path: "Configuracoes",
            element: <Configuracoes />,
          },
        ],
      },
      {
        path: "/Ranking",
        element: <Ranking />,
      },
      {
        path: "/Jogar",
        element: <Jogar />,
      },
      {
        path: "/auth",
        children: [
          {
            path: "discord",
            children: [
              {
                path: "callback",
                element: <Login btn={null} handleDropdown={null} />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
