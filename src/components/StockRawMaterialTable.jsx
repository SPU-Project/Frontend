import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/StockRawMaterialTable.css";
import "../styles/RawMaterialTable.css";
import { fetchStockItems, updateStockItem } from "../redux/stokbahanbakuSlice";

function StockRawMaterialTable({ searchTerm = "", onSearchChange }) {
  const dispatch = useDispatch();

  const [editingRow, setEditingRow] = useState(null);
  const [tempStock, setTempStock] = useState({});

  useEffect(() => {
    dispatch(fetchStockItems());
  }, [dispatch]);

  const { stockItems, status, error } = useSelector(
    (state) => state.stokbahanbaku
  );

  const filteredStockItems = stockItems.filter((item) =>
    item.BahanBaku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (stockItemId, stock) => {
    setEditingRow(stockItemId);
    setTempStock({ ...tempStock, [stockItemId]: stock });
  };

  const handleSaveClick = (stockItemId) => {
    const updatedStock = tempStock[stockItemId];

    dispatch(updateStockItem({ id: stockItemId, Stok: updatedStock }))
      .unwrap()
      .then(() => {
        setEditingRow(null); // Exit editing mode
      })
      .catch((error) => {
        console.error("Failed to update stock item:", error.message);
      });
  };

  const handleStockChange = (stockItemId, value) => {
    setTempStock({ ...tempStock, [stockItemId]: value });
  };

  return (
    <div className="admin-table">
      <div className="table-controls">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Cari Bahan Baku"
            value={searchTerm}
            onChange={onSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-wrapper">
        {status === "loading" ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Bahan Baku</th>
                <th>Stok</th>
                <th>Satuan</th>
                <th>Tanggal Pembaruan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredStockItems.length > 0 ? (
                filteredStockItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.BahanBaku}</td>
                    <td>
                      {editingRow === item.id ? (
                        <input
                          type="number"
                          value={tempStock[item.id] || ""}
                          onChange={(e) =>
                            handleStockChange(item.id, e.target.value)
                          }
                        />
                      ) : (
                        item.Stok.toLocaleString()
                      )}
                    </td>
                    {/* Bungkus Satuan dalam <td> */}
                    <td>{item.Satuan}</td>
                    <td>{new Date(item.TanggalPembaruan).toLocaleString()}</td>
                    <td>
                      {editingRow === item.id ? (
                        <button
                          className="save-button"
                          onClick={() => handleSaveClick(item.id)}
                        >
                          Simpan
                        </button>
                      ) : (
                        <button
                          className="edit-product-button"
                          onClick={() => handleEditClick(item.id, item.Stok)}
                        >
                          Ubah
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Tidak ada stok bahan baku yang ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StockRawMaterialTable;
