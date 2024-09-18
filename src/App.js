import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Connexion from "./layout/Connexion";
import Subscription from "./layout/Subscription";
import ExternalSign from "./layout/ExternalSign";
import routes from "./routes";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Connexion />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route
        path="/extSign/:name/:doc/:refreshToken"
        element={<ExternalSign />}
      />
      {routes.map((route) => (
        <Route
          key={route.key}
          path={route.path}
          element={
            localStorage.getItem("accessToken") !== null ? (
              route.component
            ) : (
              <Connexion />
            )
          }
        />
      ))}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
