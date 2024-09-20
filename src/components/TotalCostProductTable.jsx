import React, { useEffect, useState } from "react";
import "../styles/TotalCostProductTable.css"; // Pastikan path CSS benar
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Menggunakan useNavigate hook

const initialProducts = [
  { id: 1, name: "Bahan Baku 1", hpp: "Rp. 12.500" },
  { id: 2, name: "Bahan Baku 2", hpp: "Rp. 10.000" },
  { id: 3, name: "Bahan Baku 3", hpp: "Rp. 15.000" },
];

function TotalCostProductTable({ searchTerm = "", onSearchChange }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Ambil data dari localStorage saat komponen dimuat
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);
  }, []);

  // Filter produk berdasarkan searchTerm
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to calculate the total cost for the products
  const calculateTotalCost = (products) => {
    return products.reduce((total, product) => {
      const cost = parseInt(
        product.hpp.replace("Rp. ", "").replace(/\./g, ""),
        10
      );
      return total + (isNaN(cost) ? 0 : cost);
    }, 0);
  };

  const [table1Products, setTable1Products] = useState(initialProducts);
  const [table2Products, setTable2Products] = useState(initialProducts);
  const [table3Products, setTable3Products] = useState(initialProducts);
  const [editRowId, setEditRowId] = useState(null); // State to manage which row is being edited
  const [editedProduct, setEditedProduct] = useState({ name: "", hpp: "" }); // State to store edited product data
  const [currentTable, setCurrentTable] = useState(null); // State to manage which table is being edited
  const navigate = useNavigate(); // Gunakan hook useNavigate untuk navigasi

  const filteredTable2Products = table2Products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTable3Products = table3Products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id, table) => {
    const productToEdit = (table === 2 ? table2Products : table3Products).find(
      (product) => product.id === id
    );
    setCurrentTable(table);
    setEditRowId(id);
    setEditedProduct({ name: productToEdit.name, hpp: productToEdit.hpp });
  };

  const handleSaveEdit = (id) => {
    if (currentTable === 2) {
      setTable2Products(
        table2Products.map((product) =>
          product.id === id
            ? { ...product, name: editedProduct.name, hpp: editedProduct.hpp }
            : product
        )
      );
    } else if (currentTable === 3) {
      setTable3Products(
        table3Products.map((product) =>
          product.id === id
            ? { ...product, name: editedProduct.name, hpp: editedProduct.hpp }
            : product
        )
      );
    }
    setEditRowId(null);
    setEditedProduct({ name: "", hpp: "" });
    setCurrentTable(null);
  };

  const handleDelete = (id, table) => {
    if (table === 1) {
      setTable1Products(table1Products.filter((product) => product.id !== id));
    } else if (table === 2) {
      setTable2Products(table2Products.filter((product) => product.id !== id));
    } else if (table === 3) {
      setTable3Products(table3Products.filter((product) => product.id !== id));
    }
  };

  const handleSaveProduct = () => {
    // Simpan data produk ke localStorage
    const allProducts = [
      ...table1Products,
      ...table2Products,
      ...table3Products,
    ];

    localStorage.setItem("products", JSON.stringify(allProducts));

    navigate("/products"); // Navigasi ke halaman produk
  };

  const handleAddRow = (table) => {
    const newProduct = {
      id:
        Math.max(
          table1Products.length,
          table2Products.length,
          table3Products.length
        ) + 1,
      name: `Bahan Baku ${
        Math.max(
          table1Products.length,
          table2Products.length,
          table3Products.length
        ) + 1
      }`,
      hpp: "Rp. 0",
    };

    if (table === 1) {
      setTable1Products([...table1Products, newProduct]);
    } else if (table === 2) {
      setTable2Products([...table2Products, newProduct]);
    } else if (table === 3) {
      setTable3Products([...table3Products, newProduct]);
    }
  };

  // Calculate total costs for table 2 and table 3
  const totalCostTable2 = calculateTotalCost(table2Products);
  const totalCostTable3 = calculateTotalCost(table3Products);
  const grandTotalCost = totalCostTable2 + totalCostTable3;

  return (
    <div className="admin-table">
      <div className="table-controls">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Cari Produk"
            value={searchTerm}
            onChange={onSearchChange}
            className="search-input"
          />
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: "0.3%" }}>No</th>
              <th style={{ width: "5%" }}>Nama Bahan Baku</th>
              <th style={{ width: "5%" }}>Harga/gr</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.hpp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Tidak ada produk yang ditemukan</td>
              </tr>
            )}
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
            {filteredTable2Products.length > 0 ? (
              filteredTable2Products.map((product, index) => (
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
                        type="text"
                        value={editedProduct.hpp}
                        onChange={(e) =>
                          setEditedProduct({
                            ...editedProduct,
                            hpp: e.target.value,
                          })
                        }
                      />
                    ) : (
                      product.hpp
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
                <td colSpan="4">Tidak ada produk yang ditemukan</td>
              </tr>
            )}
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
            {filteredTable3Products.length > 0 ? (
              filteredTable3Products.map((product, index) => (
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
                        type="text"
                        value={editedProduct.hpp}
                        onChange={(e) =>
                          setEditedProduct({
                            ...editedProduct,
                            hpp: e.target.value,
                          })
                        }
                      />
                    ) : (
                      product.hpp
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
                <td colSpan="4">Tidak ada produk yang ditemukan</td>
              </tr>
            )}
            {/* Total Cost Row */}
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                Total Cost:
              </td>
              <td colSpan="1">Rp. {grandTotalCost.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        {/* Add Save Button Here */}
        <button className="save-all-button" onClick={handleSaveProduct}>
          Simpan
        </button>
      </div>
    </div>
  );
}

export default TotalCostProductTable;
