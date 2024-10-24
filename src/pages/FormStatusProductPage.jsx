import React from "react";
import FormStatusProduct from "../components/FormStatusProduct";

function ProductFormPage() {
  // Jika Anda memerlukan onClose atau props lain, Anda bisa menambahkannya di sini
  const handleClose = () => {
    console.log("Form ditutup");
  };

  return (
    <div>
      <FormStatusProduct onClose={handleClose} />
    </div>
  );
}

export default ProductFormPage;