import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../styles/ProductForm.css';
import '../styles/ProductsPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function ProductForm({ onClose }) {
  const navigate = useNavigate(); // Initialize navigate
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, event) => {
    const newIngredients = [...ingredients];
    newIngredients[index][event.target.name] = event.target.value;
    setIngredients(newIngredients);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic untuk submit data produk baru
    navigate('/total'); // Navigate to TotalCostProductPage
  };

  const handleNextPage = () => {
    navigate('/total-cost'); // Navigate to ProductFormPage
  };

  const handlePreviousPage = () => {
    navigate('/products'); // Navigate to ProductFormPage
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="main-section">
        <AdminHeader />
        <div className="admin-table"> {/* Menambahkan class admin-table agar konsisten */}
          <div className="product-form-container">
            <button type="button" className="add-ingredient-button" onClick={handleAddIngredient}>
              Tambah
            </button>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <table className="ingredients-table">
                  <thead>
                    <tr>
                      <th>Nomor</th>
                      <th>Bahan Baku</th>
                      <th>Jumlah (gram)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ingredient, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, e)}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="quantity"
                            value={ingredient.quantity}
                            onChange={(e) => handleIngredientChange(index, e)}
                            required
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="delete-ingredient-button"
                            onClick={() => handleDeleteIngredient(index)}
                          >
                            <i className="fas fa-trash-alt"></i> {/* Ikon Delete */}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button" onClick={handleNextPage}>Selanjutnya</button>
                <button type="button" className="cancel-button" onClick={handlePreviousPage}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
