import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Connexion from "./layout/Connexion";
import Subscription from "./layout/Subscription";
import routes from "./routes";

const renderRoutes = () => {
  return routes.map((route) => (
    <Route
      key={route.key}
      path={route.path}
      element={
        localStorage.getItem("userToken") !== null ? (
          route.component
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  ));
};

function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<Navigate to="/login" />} />
        <Route key="login" path="/login" element={<Connexion />} />
        <Route key="sub" path="/subscription" element={<Subscription />} />
        {renderRoutes()}
      </Routes>
    </div>
  );
}

export default App;
