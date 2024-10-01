import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import "../styles/ProductForm.css";
import "../styles/ProductsPage.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function ProductFormTable() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
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
    const productsWithIds = ingredients.map((ingredient, index) => ({
      id: index + 1, // ID unik untuk setiap produk
      name: ingredient.name,
      hpp: `Rp. ${parseInt(ingredient.quantity, 10).toLocaleString("id-ID")}`, // Format harga
    }));

    localStorage.setItem("products", JSON.stringify(productsWithIds)); // Simpan data ke localStorage
    navigate("/total-cost");
  };

  const handlePreviousPage = () => {
    navigate("/products");
  };

  return (
    <div className="admin-dashboard">
      <div className="main-section">
        <AdminHeader />
        <div className="admin-table">
          <div className="product-form-container">
            <button
              type="button"
              className="add-ingredient-button"
              onClick={handleAddIngredient}
            >
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
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ingredient, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <select
                            name="name"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, e)}
                            required
                          >
                            <option value="">Pilih Bahan Baku</option>
                            <option value="Tepung">Tepung</option>
                            <option value="Gula">Gula</option>
                            <option value="Telur">Telur</option>
                            <option value="Mentega">Mentega</option>
                            <option value="Susu">Susu</option>
                            {/* Add more options here */}
                          </select>
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
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Selanjutnya
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handlePreviousPage}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFormTable;
