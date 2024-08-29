import React from "react";
import HomeLayout from "../../container";
import FormModal from "./FormModal";

function Users() {
  document.getElementById("title").innerHTML = "Utilisateurs - Mandarga";

  return (
    <HomeLayout>
      <FormModal />
    </HomeLayout>
  );
}

export default Users;
