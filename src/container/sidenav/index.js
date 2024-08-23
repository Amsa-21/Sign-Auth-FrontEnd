import React from "react";
import "./index.css";
import routes from "../../routes";
import { Link, useLocation } from "react-router-dom";

function Sidenav() {
  const location = useLocation();

  return (
    <div className="navigation">
      <ul>
        {routes.map((item, index) => (
          <li
            key={index}
            className={`list-sidenav ${
              item.path === location.pathname ? "active" : ""
            }`}
          >
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
