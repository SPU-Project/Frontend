import React, { useEffect, useState } from "react";
import "../styles/TotalCostProductTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProduk, updateProduct } from "../redux/produkSlice";
import { fetchProductById } from "../redux/productTableSlice";
import { Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

function isValidString(str) {
  // Regex untuk memastikan string mengandung setidaknya satu huruf
  return /[a-zA-Z]/.test(str);
}

function TotalCostProductTable() {
  const { id } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector(
    (state) => state.productTable
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showModal, setShowModal] = useState(false); // Add showModal state
  const [modalMessage, setModalMessage] = useState("");
  const [table2Products, setTable2Products] = useState([]);
  const [table3Products, setTable3Products] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [editRowId, setEditRowId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ name: "", hpp: "" });
  const [currentTable, setCurrentTable] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    setIsInitialLoad(false);
  }, [dispatch, id]);

  useEffect(() => {
    if (id && !isInitialLoad) {
      if (location.state) {
        // Menggunakan data yang diteruskan melalui location.state
        const {
          products: storedProducts,
          overheads: storedOverheads,
          kemasans: storedKemasans,
          productName: storedProductName,
        } = location.state;

        setProducts(storedProducts || []);
        setTable2Products(
          (storedOverheads || []).map((overhead, index) => ({
            id: index,
            name: overhead.name,
            hpp: parseFloat(overhead.harga),
          }))
        );
        setTable3Products(
          (storedKemasans || []).map((kemasan, index) => ({
            id: index,
            name: kemasan.name,
            hpp: parseFloat(kemasan.harga),
          }))
        );
        setNewProductName(storedProductName || "");
      } else if (currentProduct) {
        // Jika tidak ada data, inisialisasi kosong
        setProducts([]);
        setTable2Products([]);
        setTable3Products([]);
        setNewProductName("");
      } else {
        dispatch(fetchProductById(id));
      }
    } else if (!id && !isInitialLoad) {
      // Menambahkan produk baru
      if (location.state) {
        const {
          products: storedProducts,
          overheads: storedOverheads,
          kemasans: storedKemasans,
          productName: storedProductName,
        } = location.state;

        setProducts(storedProducts || []);
        setTable2Products(
          (storedOverheads || []).map((overhead, index) => ({
            id: index,
            name: overhead.name,
            hpp: overhead.harga,
          }))
        );
        setTable3Products(
          (storedKemasans || []).map((kemasan, index) => ({
            id: index,
            name: kemasan.name,
            hpp: kemasan.harga,
          }))
        );
        setNewProductName(storedProductName || "");
      } else {
        // Jika tidak ada data, inisialisasi kosong
        setProducts([]);
        setTable2Products([]);
        setTable3Products([]);
        setNewProductName("");
      }
    }
  }, [currentProduct, isInitialLoad, id, location.state]);

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text(`Detail Produk: ${newProductName}`, 14, 10);
    doc.setFontSize(12);
    doc.text(`Tanggal: ${new Date().toLocaleDateString()}`, 14, 20);

    // Table 1: Bahan Baku
    autoTable(doc, {
      startY: 30,
      head: [
        ["No", "Nama Bahan Baku", "Jumlah (gram)", "Harga per Kg", "Biaya"],
      ],
      body: products.map((product, index) => [
        index + 1,
        product.name,
        product.quantity,
        `Rp. ${parseFloat(product.pricePerKg).toLocaleString("id-ID")}`,
        `Rp. ${calculateProductCost(product).toLocaleString("id-ID")}`,
      ]),
      foot: [
        [
          "",
          "",
          "",
          "Total Biaya Bahan Baku",
          `Rp. ${totalCostProducts.toLocaleString()}`,
        ],
      ],
    });

    // Table 2: Overhead
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["No", "Nama Overhead", "Harga"]],
      body: table2Products.map((product, index) => [
        index + 1,
        product.name,
        `Rp. ${parseFloat(product.hpp).toLocaleString()}`,
      ]),
      foot: [["", "Total Biaya Overhead", `Rp. ${totalCostTable2}`]],
    });

    // Table 3: Kemasan
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["No", "Nama Kemasan", "Harga"]],
      body: table3Products.map((product, index) => [
        index + 1,
        product.name,
        `Rp. ${parseFloat(product.hpp).toLocaleString()}`,
      ]),
      foot: [
        ["", "Total Biaya Kemasan", `Rp. ${totalCostTable3.toLocaleString()}`],
      ],
    });

    // Total
    doc.text(
      `Total Biaya Keseluruhan: Rp. ${grandTotalCost.toLocaleString()}`,
      14,
      doc.lastAutoTable.finalY + 20
    );

    // Save
    doc.save(`Detail_Produk_${newProductName}.pdf`);
  };

  const handleEdit = (id, table) => {
    const productToEdit = (table === 2 ? table2Products : table3Products).find(
      (product) => product.id === id
    );
    setCurrentTable(table);
    setEditRowId(id);
    setEditedProduct({
      name: productToEdit.name,
      hpp: productToEdit.hpp,
    });
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
    const pricePerGram = product.pricePerKg;
    const quantityInGrams = parseFloat(product.quantity);
    const cost = pricePerGram * quantityInGrams;
    return cost;
  };

  const totalCostProducts = products.reduce((total, product) => {
    const cost = calculateProductCost(product);
    return total + cost;
  }, 0);

  const totalCostTable2 = table2Products.reduce((total, product) => {
    const cost = product.hpp || 0;
    return total + cost;
  }, 0);

  const totalCostTable3 = table3Products.reduce((total, product) => {
    const cost = product.hpp || 0;
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
        <button className="export-pdf-button-detail" onClick={exportToPDF}>
          <FontAwesomeIcon icon={faFilePdf} /> Export to PDF
        </button>
      </div>
      {/* Tabel Pertama */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: "0.3%" }}>No</th>
              <th style={{ width: "5%" }}>Nama Bahan Baku</th>
              <th style={{ width: "5%" }}>Kuantitas</th>
              <th style={{ width: "5%" }}>Harga/Satuan</th>
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
                    <td>Rp. {cost.toLocaleString("id-ID")}</td>
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
              <td>Rp. {totalCostProducts.toLocaleString("id-ID")}</td>
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
                        onChange={(e) => {
                          // Hanya ambil digit dengan menghapus titik dan karakter non-digit
                          const value = e.target.value
                            .replace(/\./g, "")
                            .replace(/\D/g, "");
                          setEditedProduct({ ...editedProduct, hpp: value });
                        }}
                        onBlur={(e) => {
                          const rawValue = e.target.value.replace(/\./g, "");
                          if (rawValue) {
                            const formatted = rawValue;
                            setEditedProduct({
                              ...editedProduct,
                              hpp: formatted,
                            });
                          }
                        }}
                      />
                    ) : (
                      `Rp. ${parseFloat(product.hpp).toLocaleString("id-ID")}`
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
              <td>Rp. {totalCostTable2.toLocaleString("id-ID")}</td>
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
                        onChange={(e) => {
                          // Hilangkan titik dan karakter non-digit
                          const value = e.target.value
                            .replace(/\./g, "")
                            .replace(/\D/g, "");
                          setEditedProduct({ ...editedProduct, hpp: value });
                        }}
                        onBlur={(e) => {
                          // Ambil nilai mentah tanpa titik
                          const rawValue = e.target.value.replace(/\./g, "");
                          if (rawValue) {
                            // Format hanya jika perlu (misal, "1" dan "10" akan tetap seperti itu)
                            const formatted = rawValue;
                            setEditedProduct({
                              ...editedProduct,
                              hpp: formatted,
                            });
                          }
                        }}
                      />
                    ) : (
                      `Rp. ${parseFloat(product.hpp).toLocaleString("id-ID")}`
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
              <td>Rp. {totalCostTable3.toLocaleString("id-ID")}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Grand Total Cost */}
      <div className="grand-total">
        <h2>Grand Total Biaya: Rp. {grandTotalCost.toLocaleString("id-ID")}</h2>
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
