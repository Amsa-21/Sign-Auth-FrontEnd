import { Menu } from "antd";
import routes from "../../routes";
import { useNavigate } from "react-router-dom";

function Sidenav() {
  const navigate = useNavigate();

  const items = routes
    .filter((route) => {
      if (
        localStorage.getItem("role").toLowerCase() === "admin" ||
        (localStorage.getItem("role").toLowerCase() === "user" &&
          route.role === "user")
      ) {
        return true;
      }
      return false;
    })
    .map((route) => ({
      ...route,
      onClick: () => navigate(route.path),
    }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#0C356A",
      }}
    >
      <Menu
        defaultSelectedKeys={[
          items.find((item) => item.path === window.location.pathname)?.key ||
            "1",
        ]}
        mode="inline"
        theme="dark"
        items={items}
        style={{ backgroundColor: "#0C356A", fontSize: "14px" }}
      />
    </div>
  );
}
export default Sidenav;
