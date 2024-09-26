import React, { useEffect } from "react";
import HomeLayout from "../../container";
import FormModal from "./FormModal";

function Users() {
  document.getElementById("title").innerHTML = "Utilisateurs - Mandarga";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <HomeLayout>
      <FormModal />
    </HomeLayout>
  );
}

export default Users;
