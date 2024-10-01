import React, { useEffect, useState } from "react";
import "../styles/TotalCostProductTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduk } from "../redux/produkSlice";

function TotalCostProductTable() {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Ambil data dari localStorage saat komponen dimuat
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);
  }, []);

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
    // Persiapkan data untuk dikirim ke backend
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

    // Dispatch addProduk action
    dispatch(addProduk(produkData))
      .unwrap()
      .then(() => {
        // Jika sukses, navigasi ke halaman produk
        navigate("/products");
      })
      .catch((error) => {
        // Tangani error
        console.error("Gagal menambahkan produk:", error);
      });
  };

  const handleAddRow = (table) => {
    const newProduct = {
      id: new Date().getTime(), // Menggunakan timestamp sebagai ID unik
      name: "",
      hpp: 0,
    };

    if (table === 2) {
      setTable2Products([...table2Products, newProduct]);
    } else if (table === 3) {
      setTable3Products([...table3Products, newProduct]);
    }
  };

  // Fungsi untuk menghitung biaya per produk
  const calculateProductCost = (product) => {
    const pricePerGram = product.pricePerKg / 1000;
    const quantityInGrams = parseFloat(product.quantity);
    const cost = pricePerGram * quantityInGrams;
    return cost;
  };

  // Hitung total biaya bahan baku
  const totalCostProducts = products.reduce((total, product) => {
    const cost = calculateProductCost(product);
    return total + cost;
  }, 0);

  // Hitung total biaya overhead
  const totalCostTable2 = table2Products.reduce((total, product) => {
    const cost = parseFloat(product.hpp) || 0;
    return total + cost;
  }, 0);

  // Hitung total biaya kemasan
  const totalCostTable3 = table3Products.reduce((total, product) => {
    const cost = parseFloat(product.hpp) || 0;
    return total + cost;
  }, 0);

  // Hitung grand total
  const grandTotalCost = totalCostProducts + totalCostTable2 + totalCostTable3;

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
            {/* Total Cost Row */}
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
                <button className="add-button" onClick={() => handleAddRow(2)}>
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
                        className="save-button"
                        onClick={() => handleSaveEdit(product.id)}
                      >
                        Simpan
                      </button>
                    ) : (
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(product.id, 2)}
                      >
                        Ubah
                      </button>
                    )}
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(product.id, 2)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Tidak ada data overhead</td>
              </tr>
            )}
            {/* Total Cost Row */}
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
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
                <button className="add-button" onClick={() => handleAddRow(3)}>
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
                        className="save-button"
                        onClick={() => handleSaveEdit(product.id)}
                      >
                        Simpan
                      </button>
                    ) : (
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(product.id, 3)}
                      >
                        Ubah
                      </button>
                    )}
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(product.id, 3)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Tidak ada data kemasan</td>
              </tr>
            )}
            {/* Total Cost Row */}
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                Total Biaya Kemasan:
              </td>
              <td>Rp. {totalCostTable3.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Grand Total Cost */}
      <div className="total-cost-container">
        <h3>Grand Total Biaya: Rp. {grandTotalCost.toLocaleString()}</h3>
      </div>
      <button className="save-all-button" onClick={handleSaveProduct}>
        Simpan
      </button>
    </div>
  );
}

export default TotalCostProductTable;
