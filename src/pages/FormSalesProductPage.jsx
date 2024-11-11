import React from "react";
import FormSalesProduct from "../components/FormSalesProduct";

function ProductFormPage() {
  // Jika Anda memerlukan onClose atau props lain, Anda bisa menambahkannya di sini
  const handleClose = () => {
    console.log("Form ditutup");
  };

  return (
    <div>
      <FormSalesProduct onClose={handleClose} />
    </div>
  );
}

export default ProductFormPage;
