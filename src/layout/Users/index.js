import React from "react";
import HomeLayout from "../../container";
import FormModal from "./FormModal";

function Users() {
  document.getElementById("title").innerHTML = "Users - Fraud Detection";

  return (
    <HomeLayout>
      <FormModal />
    </HomeLayout>
  );
}

export default Users;
