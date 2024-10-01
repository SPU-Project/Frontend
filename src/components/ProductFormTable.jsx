import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import Select from "react-select";
import "../styles/ProductForm.css";
import "../styles/ProductsPage.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function ProductFormTable() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([
    { id: "", name: "", quantity: "", pricePerKg: 0 },
  ]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data bahan baku dari API saat komponen dimuat
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch("http://localhost:5000/bahanbaku");
        const data = await response.json();
        console.log(data); // Untuk debugging
        if (response.ok) {
          let bahanBakuList = [];

          if (Array.isArray(data.data)) {
            // Jika data ada di properti 'data'
            bahanBakuList = data.data;
          } else {
            setError("Format data dari API tidak didukung.");
            setLoading(false);
            return;
          }

          const options = bahanBakuList.map((bahanBaku) => ({
            value: bahanBaku.id,
            label: bahanBaku.BahanBaku,
            pricePerKg: bahanBaku.Harga, // Menyertakan harga per kg
          }));
          setIngredientOptions(options);
        } else {
          setError(data.message || "Gagal mengambil data bahan baku.");
        }
      } catch (err) {
        setError(
          err.message || "Terjadi kesalahan saat mengambil data bahan baku."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: "", name: "", quantity: "", pricePerKg: 0 },
    ]);
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, selectedOption) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      id: selectedOption.value,
      name: selectedOption.label,
      pricePerKg: selectedOption.pricePerKg, // Menyimpan harga per kg
    };
    setIngredients(newIngredients);
  };

  const handleQuantityChange = (index, event) => {
    const newIngredients = [...ingredients];
    newIngredients[index].quantity = event.target.value;
    setIngredients(newIngredients);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const productsWithDetails = ingredients.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      quantity: ingredient.quantity,
      pricePerKg: ingredient.pricePerKg,
    }));

    localStorage.setItem("products", JSON.stringify(productsWithDetails));
    navigate("/total-cost");
  };

  const handlePreviousPage = () => {
    navigate("/products");
  };

  if (loading) {
    return <div>Memuat data bahan baku...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                          <Select
                            options={ingredientOptions}
                            value={ingredientOptions.find(
                              (option) => option.value === ingredient.id
                            )}
                            onChange={(selectedOption) =>
                              handleIngredientChange(index, selectedOption)
                            }
                            placeholder="Pilih Bahan Baku"
                            isSearchable
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="quantity"
                            value={ingredient.quantity}
                            onChange={(e) => handleQuantityChange(index, e)}
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
