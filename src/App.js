import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Connexion from "./layout/Connexion";
import routes from "./routes";

function renderRoutes() {
  return routes.map((route) => (
    <Route
      key={route.key}
      path={route.path}
      element={
        Boolean(localStorage.getItem("userToken")) ? (
          route.component
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  ));
}

function App() {
  return (
    <div>
      <Routes>
        {renderRoutes()}
        <Route key="login" path="/login" element={<Connexion />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
