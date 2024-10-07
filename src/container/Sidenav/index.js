import React, { useEffect, useState } from "react";
import routes from "../../routes";
import { Link, useLocation } from "react-router-dom";
import "./index.css";

function Sidenav() {
  const location = useLocation();
  const [routesDisplayed, setRoutesDisplayed] = useState([]);
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (role.toLowerCase() === "user") {
      setRoutesDisplayed(routes.filter((route) => route.role === "user"));
    } else {
      setRoutesDisplayed(routes);
    }
  }, [role]);

  return (
    <div className="navigation">
      <ul>
        {routesDisplayed.map((item, index) => (
          <li
            key={index}
            className={`list-sidenav ${
              item.path === location.pathname ? "active" : ""
            }`}>
            <b></b>
            <b></b>
            <Link to={item.path}>
              <span className="icon">{item.icon}</span>
              <span className="title">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidenav;
