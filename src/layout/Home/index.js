import React from "react";
import HomeLayout from "../../container";
import RequestList from "./RequestList";
import MyRequestList from "./MyRequestList";
import Tabs from "../component/Tabs";

function Home() {
  document.getElementById("title").innerHTML = "Accueil - Mandarga";

  const items = [
    {
      key: "1",
      name: "Demandes reçues",
      content: <RequestList />,
    },
    {
      key: "2",
      name: "Demandes envoyées",
      content: <MyRequestList />,
    },
  ];

  return (
    <HomeLayout>
      <Tabs defaultActiveKey="1" items={items} />
    </HomeLayout>
  );
}

export default Home;
