import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Connexion from "./layout/Connexion";
import Subscription from "./layout/Subscription";
import routes from "./routes";

function App() {
  const [r, setR] = useState([]);

  useEffect(() => {
    function renderRoutes(routes) {
      let r = routes.map((route) => (
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
      return r;
    }
    setR(renderRoutes(routes));
  }, []);

  return (
    <div>
      <Routes>
        <Route key="all" path="*" element={<Navigate to="/login" />} />
        <Route key="login" path="/login" element={<Connexion />} />
        <Route key="sub" path="/subscription" element={<Subscription />} />
        {r}
      </Routes>
    </div>
  );
}

export default App;
