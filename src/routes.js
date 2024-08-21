import Home from "./layout/Home";
import BackOffice from "./layout/BackOffice";
import Users from "./layout/Users";
import Analysis from "./layout/Analysis";
import NewRequest from "./layout/NewRequest";
import {
  AuditOutlined,
  FormOutlined,
  UserSwitchOutlined,
  ScanOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const routes = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: "Accueil",
    path: "/",
    component: <Home />,
    role: "user",
  },
  {
    key: "2",
    icon: <AuditOutlined />,
    label: "Nouvelle demande",
    path: "/newRequest",
    component: <NewRequest />,
    role: "user",
  },
  {
    key: "3",
    icon: <ScanOutlined />,
    label: "Contrôle",
    path: "/scan",
    component: <Analysis />,
    role: "user",
  },
  {
    key: "4",
    icon: <FormOutlined />,
    label: "BackOffice",
    path: "/backoffice",
    component: <BackOffice />,
    role: "admin",
  },
  {
    key: "5",
    icon: <UserSwitchOutlined />,
    label: "Users",
    path: "/users",
    component: <Users />,
    role: "admin",
  },
];

export default routes;
