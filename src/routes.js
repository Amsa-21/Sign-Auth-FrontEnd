import Home from "./layout/Home";
import BackOffice from "./layout/BackOffice";
import Users from "./layout/Users";
import Analysis from "./layout/Analysis";
import NewRequest from "./layout/NewRequest";

const routes = [
  {
    key: "1",
    path: "/",
    component: <Home />,
    role: "user",
  },
  {
    key: "2",
    path: "/newRequest",
    component: <NewRequest />,
    role: "user",
  },
  {
    key: "3",
    path: "/scan",
    component: <Analysis />,
    role: "user",
  },
  {
    key: "4",
    path: "/backoffice",
    component: <BackOffice />,
    role: "admin",
  },
  {
    key: "5",
    path: "/users",
    component: <Users />,
    role: "admin",
  },
];

export default routes;
