import Home from "./layout/Home";
import BackOffice from "./layout/BackOffice";
import Users from "./layout/Users";
import Analysis from "./layout/Analysis";
import NewRequest from "./layout/NewRequest";
import {
  HomeOutlined,
  AuditOutlined,
  ScanOutlined,
  FormOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const routes = [
  {
    key: "1",
    path: "/",
    component: <Home />,
    role: "user",
    icon: <HomeOutlined />,
    title: "Accueil",
  },
  {
    key: "2",
    path: "/newRequest",
    component: <NewRequest />,
    role: "user",
    icon: <AuditOutlined />,
    title: "Nouvelle demande",
  },
  {
    key: "3",
    path: "/scan",
    component: <Analysis />,
    role: "user",
    icon: <ScanOutlined />,
    title: "Vérification",
  },
  {
    key: "4",
    path: "/backoffice",
    component: <BackOffice />,
    role: "admin",
    icon: <FormOutlined />,
    title: "BackOffice",
  },
  {
    key: "5",
    path: "/users",
    component: <Users />,
    role: "admin",
    icon: <UserSwitchOutlined />,
    title: "Utilisateurs",
  },
];

export default routes;
