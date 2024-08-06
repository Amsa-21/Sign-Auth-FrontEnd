import Home from "./layout/Home";
import BackOffice from "./layout/BackOffice";
import Users from "./layout/Users";
import Analysis from "./layout/Analysis";
import {
  AuditOutlined,
  FormOutlined,
  UserSwitchOutlined,
  ScanOutlined,
} from "@ant-design/icons";

const routes = [
  {
    key: 1,
    icon: <AuditOutlined />,
    label: "Accueil",
    path: "/home",
    component: <Home />,
    role: "user",
  },
  {
    key: 2,
    icon: <ScanOutlined />,
    label: "Contrôle",
    path: "/scan",
    component: <Analysis />,
    role: "user",
  },
  {
    key: 3,
    icon: <FormOutlined />,
    label: "BackOffice",
    path: "/backoffice",
    component: <BackOffice />,
    role: "admin",
  },
  {
    key: 4,
    icon: <UserSwitchOutlined />,
    label: "Users",
    path: "/users",
    component: <Users />,
    role: "admin",
  },
];

export default routes;
