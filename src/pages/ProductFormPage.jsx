import React from 'react';
import ProductForm from '../components/ProductFormTable';

function ProductFormPage() {
  // Jika Anda memerlukan onClose atau props lain, Anda bisa menambahkannya di sini
  const handleClose = () => {
    console.log("Form ditutup");
  };

  return (
    <div>
      <ProductForm onClose={handleClose} />
    </div>
    
  );
}

export default ProductFormPage;
