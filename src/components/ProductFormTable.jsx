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
  const { currentProduct, products } = useSelector(
    (state) => state.productTable
  );
  const [showModal, setShowModal] = useState(false); // State untuk modal
  const [overheads, setOverheads] = useState([]);
  const [kemasans, setKemasans] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    } else {
      dispatch(fetchProducts());
    }
    fetchIngredients();
  }, [dispatch, id]);

  useEffect(() => {
    if (id && currentProduct) {
      const product = currentProduct;
      console.log("Fetched Product Data:", product);
      if (product) {
        setProductName(product.namaProduk || "");

        // Handle ingredients
        let bahanBakuArray = Array.isArray(product.bahanbakumodel)
          ? product.bahanbakumodel
          : product.bahanbakumodel
          ? [product.bahanbakumodel]
          : [];

        const mappedIngredients = bahanBakuArray.map((bahanBaku) => ({
          id: bahanBaku.id || "",
          name: bahanBaku.BahanBaku || "",
          quantity: bahanBaku.jumlah || 0,
          pricePerKg: bahanBaku.Harga || 0,
        }));

        setIngredients(mappedIngredients);

        // Handle overheads
        let overheadsArray = Array.isArray(product.overheads)
          ? product.overheads
          : product.overheads
          ? [product.overheads]
          : [];

        const mappedOverheads = overheadsArray.map((overhead) => ({
          id: overhead.id || "",
          name: overhead.namaOverhead || "",
          price: overhead.harga || 0,
        }));

        setOverheads(mappedOverheads);

        // Handle kemasans
        let kemasansArray = Array.isArray(product.kemasans)
          ? product.kemasans
          : product.kemasans
          ? [product.kemasans]
          : [];

        const mappedKemasans = kemasansArray.map((kemasan) => ({
          id: kemasan.id || "",
          name: kemasan.namaKemasan || "",
          price: kemasan.harga || 0,
        }));

        setKemasans(mappedKemasans);
      }
    }
  }, [id, currentProduct]);

  const fetchIngredients = async () => {
    try {
      const response = await fetch("http://localhost:5000/bahanbaku");
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

    const overheadsDetails = overheads.map((overhead) => ({
      name: overhead.name,
      harga: overhead.price,
    }));

    const kemasansDetails = kemasans.map((kemasan) => ({
      name: kemasan.name,
      harga: kemasan.price,
    }));

    // Navigasi dengan mengirim data melalui state
    navigate(id ? `/total-cost/${id}` : "/total-cost", {
      state: {
        products: productsWithDetails,
        overheads: overheadsDetails,
        kemasans: kemasansDetails,
        productName: productName,
      },
    });
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
                      <th>Kuantitas</th>
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
