import React from "react";
import HomeLayout from "../../container";
import Tabs from "../component/Tabs";
import Intern from "./Intern";
import Extern from "./Extern";

function NewRequest() {
  document.getElementById("title").innerHTML = "Nouvelle demande - Mandarga";

  const items = [
    {
      key: "1",
      name: "Demande interne",
      content: <Intern />,
    },
    {
      key: "2",
      name: "Demande externe",
      content: <Extern />,
    },
  ];

  return (
    <HomeLayout>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 800 }}>
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      </div>
    </HomeLayout>
  );
}

export default NewRequest;
