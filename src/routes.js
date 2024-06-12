import Home from "./layout/Home";
import BackOffice from "./layout/BackOffice";
import Users from "./layout/Users";
import {
  AuditOutlined,
  FormOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const routes = [
  {
    key: "1",
    icon: <AuditOutlined />,
    label: "Home",
    path: "/home",
    component: <Home />,
    role: "user",
  },
  {
    key: "2",
    icon: <FormOutlined />,
    label: "BackOffice",
    path: "/backoffice",
    component: <BackOffice />,
    role: "user",
  },
  {
    key: "3",
    icon: <UserSwitchOutlined />,
    label: "Users",
    path: "/users",
    component: <Users />,
    role: "admin",
  },
];

export default routes;
