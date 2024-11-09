import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import Select from "react-select";
import "../styles/ProductForm.css";
import "../styles/ProductsPage.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchProductById } from "../redux/productTableSlice";
import { Modal } from "react-bootstrap"; // Impor modal dari React Bootstrap

function ProductFormTable() {
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ingredients, setIngredients] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { products } = useSelector((state) => state.productTable);
  const [showModal, setShowModal] = useState(false); // State untuk modal

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    } else {
      dispatch(fetchProducts());
    }
    fetchIngredients();
  }, [dispatch, id]);

  useEffect(() => {
    if (id && products.length > 0) {
      const product = products.find((p) => p.produkId.toString() === id);
      console.log("Fetched Product Data:", product); // Cek data produk
      if (product) {
        setProductName(product.produk?.namaProduk || "");

        // Cek dan konversi bahanBaku menjadi array
        let bahanBakuArray = Array.isArray(product.bahanBaku)
          ? product.bahanBaku
          : product.bahanBaku
          ? [product.bahanBaku]
          : [];

        console.log("Bahan Baku Array:", bahanBakuArray); // Cek bahan baku setelah konversi

        const mappedIngredients = [];

        if (product.bahanBaku) {
          mappedIngredients.push({
            id: product.bahanBaku.id || "", // ID dari bahan baku
            name: product.bahanBaku.BahanBaku || "", // Nama dari bahan baku
            quantity: product.jumlah || 0, // Menggunakan jumlah
            pricePerKg: product.bahanBaku.Harga || 0, // Harga dari bahan baku
          });
        }

        // Log hasil mapping
        console.log("Mapped Ingredients:", mappedIngredients);
        setIngredients(mappedIngredients);
      }
    }
  }, [id, products]);

  const fetchIngredients = async () => {
    try {
      const response = await fetch("https://apiv2.pabrikbumbu.com/bahanbaku");
      const data = await response.json();
      if (response.ok) {
        const options = data.data.map((bahanBaku) => ({
          value: bahanBaku.id,
          label: bahanBaku.BahanBaku,
          pricePerKg: bahanBaku.Harga,
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
      pricePerKg: selectedOption.pricePerKg,
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

    // Cek apakah ada bahan baku yang ditambahkan
    const hasIngredients = ingredients.some(
      (ingredient) => ingredient.id && ingredient.quantity > 0
    );

    if (!hasIngredients) {
      setShowModal(true); // Tampilkan modal jika tidak ada bahan baku
      return;
    }

    const productsWithDetails = ingredients.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      quantity: ingredient.quantity,
      pricePerKg: ingredient.pricePerKg,
    }));

    localStorage.setItem("products", JSON.stringify(productsWithDetails));
    localStorage.setItem("productName", productName);
    navigate(id ? `/total-cost/${id}` : "/total-cost");
  };

  const handlePreviousPage = () => {
    navigate("/products");
  };

  const handleCloseModal = () => setShowModal(false); // Fungsi untuk menutup modal

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
              Tambah Bahan Baku
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
            {/* Modal untuk menampilkan pesan kesalahan */}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Peringatan</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Tolong tambahkan bahan baku sebelum melanjutkan.
              </Modal.Body>
              <Modal.Footer>
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Tutup
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFormTable;
