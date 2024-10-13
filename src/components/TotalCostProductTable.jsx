import React, { useEffect, useState } from "react";
import "../styles/TotalCostProductTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProduk, updateProduct } from "../redux/produkSlice";
import { fetchProducts, fetchProductById } from "../redux/productTableSlice";
import { Modal } from "react-bootstrap";

function isValidString(str) {
  // Regex untuk memastikan string mengandung setidaknya satu huruf
  return /[a-zA-Z]/.test(str);
}

function TotalCostProductTable() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector(
    (state) => state.productTable
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showModal, setShowModal] = useState(false); // Add showModal state
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    // Periksa apakah ID ada
    if (id) {
      // Dispatch action untuk memuat produk berdasarkan ID
      dispatch(fetchProductById(id));
    } else {
      // Dispatch action untuk memuat semua produk
      dispatch(fetchProducts());
    }
    // Tandai bahwa initial load telah selesai
    setIsInitialLoad(false);
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct && !isInitialLoad) {
      console.log("Fetched Product:", currentProduct);

      setNewProductName(currentProduct.produk.namaProduk);
      // Ensure that bahanBaku is an array before mapping
      // Cek dan konversi bahanBaku menjadi array

      let bahanBakuArray = Array.isArray(currentProduct.bahanBaku)
        ? currentProduct.bahanBaku
        : currentProduct.bahanBaku
        ? [currentProduct.bahanBaku]
        : [];
      console.log("Fetched Product:", bahanBakuArray);

      const mappedIngredients = [];

      if (currentProduct.bahanBaku) {
        mappedIngredients.push({
          id: currentProduct.bahanBaku.id || "", // ID dari bahan baku
          name: currentProduct.bahanBaku.BahanBaku || "", // Nama dari bahan baku
          quantity: currentProduct.jumlah || 0, // Menggunakan jumlah
          pricePerKg: currentProduct.bahanBaku.Harga || 0, // Harga dari bahan baku
        });
      }
      // Handle overheads and kemasans similarly
      setTable2Products(
        Array.isArray(currentProduct.produk.overheads)
          ? currentProduct.produk.overheads.map((overhead) => ({
              id: overhead.id,
              name: overhead.namaOverhead,
              hpp: overhead.harga,
            }))
          : []
      );
      setTable3Products(
        Array.isArray(currentProduct.produk.kemasans)
          ? currentProduct.produk.kemasans.map((kemasan) => ({
              id: kemasan.id,
              name: kemasan.namaKemasan,
              hpp: kemasan.harga,
            }))
          : []
      );
    } else {
      const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
      const storedProductName = localStorage.getItem("productName") || "";
      setProducts(storedProducts);
      setNewProductName(storedProductName);
    }
  }, [currentProduct, isInitialLoad]);

  const [table2Products, setTable2Products] = useState([]);
  const [table3Products, setTable3Products] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ name: "", hpp: "" });
  const [currentTable, setCurrentTable] = useState(null);

  const handleEdit = (id, table) => {
    const productToEdit = (table === 2 ? table2Products : table3Products).find(
      (product) => product.id === id
    );
    setCurrentTable(table);
    setEditRowId(id);
    setEditedProduct({ name: productToEdit.name, hpp: productToEdit.hpp });
  };

  const handleSaveEdit = (id) => {
    const updatedProduct = {
      ...editedProduct,
      hpp: parseFloat(editedProduct.hpp),
    };
    if (currentTable === 2) {
      setTable2Products(
        table2Products.map((product) =>
          product.id === id ? { ...product, ...updatedProduct } : product
        )
      );
    } else if (currentTable === 3) {
      setTable3Products(
        table3Products.map((product) =>
          product.id === id ? { ...product, ...updatedProduct } : product
        )
      );
    }
    setEditRowId(null);
    setEditedProduct({ name: "", hpp: "" });
    setCurrentTable(null);
  };

  const handleDelete = (id, table) => {
    if (table === 2) {
      setTable2Products(table2Products.filter((product) => product.id !== id));
    } else if (table === 3) {
      setTable3Products(table3Products.filter((product) => product.id !== id));
    }
  };

  const handleSaveProduct = () => {
    // Validate the new product name
    if (!newProductName.trim()) {
      setModalMessage("Nama Produk tidak boleh kosong");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
      return;
    }

    // Check if the new product name contains only letters or a combination of letters and numbers
    if (!/^[a-zA-Z0-9\s]+$/.test(newProductName)) {
      setModalMessage(
        "Nama Produk harus terdiri dari huruf atau kombinasi huruf dan angka"
      );
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
      return;
    }

    // Check if the new product name contains at least one letter
    if (!/[a-zA-Z]/.test(newProductName)) {
      setModalMessage("Nama Produk harus mengandung setidaknya satu huruf");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
      return;
    }

    // Validasi untuk overhead
    for (const overhead of table2Products) {
      if (!overhead.name || !isValidString(overhead.name)) {
        setModalMessage(
          "Nama Overhead tidak boleh kosong dan harus mengandung huruf (boleh juga angka)"
        );
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000);
        return;
      }
    }

    // Validasi untuk kemasan
    for (const kemasan of table3Products) {
      if (!kemasan.name || !isValidString(kemasan.name)) {
        setModalMessage(
          "Nama Kemasan tidak boleh kosong dan harus mengandung huruf (boleh juga angka)"
        );
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000);
        return;
      }
    }

    const produkData = {
      namaProduk: newProductName,
      bahanBaku: products.map((product) => ({
        id: product.id,
        jumlah: parseFloat(product.quantity),
      })),
      overhead: table2Products.map((product) => ({
        namaOverhead: product.name,
        harga: parseFloat(product.hpp),
      })),
      kemasan: table3Products.map((product) => ({
        namaKemasan: product.name,
        harga: parseFloat(product.hpp),
      })),
    };

    if (id) {
      dispatch(updateProduct({ id, updatedData: produkData }))
        .unwrap()
        .then(() => {
          console.log("Produk berhasil diperbarui.");
          navigate("/products");
        })
        .catch((error) => {
          console.error("Gagal memperbarui produk:", error);
        });
    } else {
      dispatch(addProduk(produkData))
        .unwrap()
        .then(() => {
          console.log("Produk berhasil ditambahkan.");
          navigate("/products");
        })
        .catch((error) => {
          console.error("Gagal menambahkan produk:", error);
        });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddRow = (table) => {
    const newProduct = {
      id: new Date().getTime(),
      name: "",
      hpp: 0,
    };

    if (table === 2) {
      setTable2Products([...table2Products, newProduct]);
    } else if (table === 3) {
      setTable3Products([...table3Products, newProduct]);
    }
  };

  const calculateProductCost = (product) => {
    const pricePerGram = product.pricePerKg / 1000;
    const quantityInGrams = parseFloat(product.quantity);
    const cost = pricePerGram * quantityInGrams;
    return cost;
  };

  const totalCostProducts = products.reduce((total, product) => {
    const cost = calculateProductCost(product);
    return total + cost;
  }, 0);

  const totalCostTable2 = table2Products.reduce((total, product) => {
    const cost = parseFloat(product.hpp) || 0;
    return total + cost;
  }, 0);

  const totalCostTable3 = table3Products.reduce((total, product) => {
    const cost = parseFloat(product.hpp) || 0;
    return total + cost;
  }, 0);

  const grandTotalCost = totalCostProducts + totalCostTable2 + totalCostTable3;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-table">
      <div className="add-product-container">
        <input
          type="text"
          value={newProductName}
          placeholder="Ketik nama produk baru"
          onChange={(e) => setNewProductName(e.target.value)}
        />
      </div>
      {/* Tabel Pertama */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: "0.3%" }}>No</th>
              <th style={{ width: "5%" }}>Nama Bahan Baku</th>
              <th style={{ width: "5%" }}>Jumlah (gram)</th>
              <th style={{ width: "5%" }}>Harga per Kg</th>
              <th style={{ width: "5%" }}>Biaya</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => {
                const cost = calculateProductCost(product);
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>
                      Rp. {parseFloat(product.pricePerKg).toLocaleString()}
                    </td>
                    <td>Rp. {cost.toLocaleString()}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5">Tidak ada produk yang ditemukan</td>
              </tr>
            )}
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Total Biaya Bahan Baku:
              </td>
              <td>Rp. {totalCostProducts.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Tabel Kedua */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: "1%" }}>No</th>
              <th style={{ width: "10%" }}>Overhead</th>
              <th style={{ width: "10%" }}>Harga</th>
              <th style={{ width: "5%" }}>
                <button
                  className="add-overhead-button"
                  onClick={() => handleAddRow(2)}
                >
                  <FontAwesomeIcon icon={faPlus} /> Tambah
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {table2Products.length > 0 ? (
              table2Products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>
                    {editRowId === product.id && currentTable === 2 ? (
                      <input
                        type="text"
                        value={editedProduct.name}
                        onChange={(e) =>
                          setEditedProduct({
                            ...editedProduct,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td>
                    {editRowId === product.id && currentTable === 2 ? (
                      <input
                        type="number"
                        value={editedProduct.hpp}
                        onChange={(e) =>
                          setEditedProduct({
                            ...editedProduct,
                            hpp: e.target.value,
                          })
                        }
                      />
                    ) : (
                      `Rp. ${parseFloat(product.hpp).toLocaleString()}`
                    )}
                  </td>
                  <td>
                    {editRowId === product.id && currentTable === 2 ? (
                      <button
                        className="save-overhead-button"
                        onClick={() => handleSaveEdit(product.id)}
                      >
                        Simpan
                      </button>
                    ) : (
                      <button
                        className="edit-overhead-button"
                        onClick={() => handleEdit(product.id, 2)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="delete-overhead-button"
                      onClick={() => handleDelete(product.id, 2)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Tidak ada overhead yang ditemukan</td>
              </tr>
            )}
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                Total Biaya Overhead:
              </td>
              <td>Rp. {totalCostTable2.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Tabel Ketiga */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: "1%" }}>No</th>
              <th style={{ width: "10%" }}>Kemasan</th>
              <th style={{ width: "10%" }}>Harga</th>
              <th style={{ width: "5%" }}>
                <button
                  className="add-overhead-button"
                  onClick={() => handleAddRow(3)}
                >
                  <FontAwesomeIcon icon={faPlus} /> Tambah
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {table3Products.length > 0 ? (
              table3Products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>
                    {editRowId === product.id && currentTable === 3 ? (
                      <input
                        type="text"
                        value={editedProduct.name}
                        onChange={(e) =>
                          setEditedProduct({
                            ...editedProduct,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td>
                    {editRowId === product.id && currentTable === 3 ? (
                      <input
                        type="number"
                        value={editedProduct.hpp}
                        onChange={(e) =>
                          setEditedProduct({
                            ...editedProduct,
                            hpp: e.target.value,
                          })
                        }
                      />
                    ) : (
                      `Rp. ${parseFloat(product.hpp).toLocaleString()}`
                    )}
                  </td>
                  <td>
                    {editRowId === product.id && currentTable === 3 ? (
                      <button
                        className="save-overhead-button"
                        onClick={() => handleSaveEdit(product.id)}
                      >
                        Simpan
                      </button>
                    ) : (
                      <button
                        className="edit-overhead-button"
                        onClick={() => handleEdit(product.id, 3)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="delete-overhead-button"
                      onClick={() => handleDelete(product.id, 3)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Tidak ada kemasan yang ditemukan</td>
              </tr>
            )}
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                Total Biaya Kemasan:
              </td>
              <td>Rp. {totalCostTable3.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Grand Total Cost */}
      <div className="grand-total">
        <h2>Grand Total Biaya: Rp. {grandTotalCost.toLocaleString()}</h2>
      </div>
      {/* Save All Products Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button className="save-all-button" onClick={handleSaveProduct}>
          {id ? "Perbarui Produk" : "Simpan Produk"}
        </button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Informasi</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

export default TotalCostProductTable;
