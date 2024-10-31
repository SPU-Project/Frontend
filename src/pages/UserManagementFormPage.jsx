import React from "react";
import UserManagementForm from "../components/UserManagementForm";

function UserManagementFormPage() {
  // Jika Anda memerlukan onClose atau props lain, Anda bisa menambahkannya di sini
  const handleClose = () => {
    console.log("Form ditutup");
  };

  return (
    <div>
      <UserManagementForm onClose={handleClose} />
    </div>
  );
}

export default UserManagementFormPage;