import Home from "./layout/Home";

import {
  AuditOutlined,
  FormOutlined,
  UserSwitchOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import BackOffice from "./layout/BackOffice";
import Users from "./layout/Users";
import Prediction from "./layout/Prediction";

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
  {
    key: "4",
    icon: <ScanOutlined />,
    label: "Prediction",
    path: "/predict",
    component: <Prediction />,
    role: "admin",
  },
];

export default routes;
