import {
  HomeOutlined,
  AuditOutlined,
  ScanOutlined,
  FormOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import "./index.css";
import { Link } from "react-router-dom";

function Sidenav() {
  let list = document.querySelectorAll(".list-sidenav");
  for (let i = 0; i < list.length; i++) {
    list[i].addEventListener("click", function () {
      let j = 0;
      while (j < list.length) {
        list[j++].className = "list-sidenav";
      }
      list[i].className = "list-sidenav active";
    });
  }

  return (
    <div class="navigation">
      <ul>
        <li class="list-sidenav active">
          <b></b>
          <b></b>
          <Link to="/">
            <span class="icon">
              <HomeOutlined />
            </span>
            <span class="title">Accueil</span>
          </Link>
        </li>
        <li class="list-sidenav">
          <b></b>
          <b></b>
          <Link to="/newRequest">
            <span class="icon">
              <AuditOutlined />
            </span>
            <span class="title">Nouvelle demande</span>
          </Link>
        </li>
        <li class="list-sidenav">
          <b></b>
          <b></b>
          <Link to="/scan">
            <span class="icon">
              <ScanOutlined />
            </span>
            <span class="title">Contrôle</span>
          </Link>
        </li>
        <li class="list-sidenav">
          <b></b>
          <b></b>
          <Link to="/backOffice">
            <span class="icon">
              <FormOutlined />
            </span>
            <span class="title">BackOffice</span>
          </Link>
        </li>
        <li class="list-sidenav">
          <b></b>
          <b></b>
          <Link to="/users">
            <span class="icon">
              <UserSwitchOutlined />
            </span>
            <span class="title">Utilisateurs</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidenav;
