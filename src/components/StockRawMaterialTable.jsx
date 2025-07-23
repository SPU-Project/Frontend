import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faSearch, faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/StockRawMaterialTable.css";
import "../styles/RawMaterialTable.css";
import { fetchStockItems, updateStockItem } from "../redux/stokbahanbakuSlice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function StockRawMaterialTable({ searchTerm = "", onSearchChange }) {
  const dispatch = useDispatch();

  const [editingRow, setEditingRow] = useState(null);
  const [tempStock, setTempStock] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchStockItems());
  }, [dispatch]);

  const { stockItems, status, error } = useSelector((state) => state.stokbahanbaku);

  const filteredStockItems = stockItems.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.BahanBaku.toLowerCase().includes(search) ||
      item.Satuan.toLowerCase().includes(search) ||
      (item.Stok !== null &&
        item.Stok !== undefined &&
        item.Stok.toString().toLowerCase().includes(search)) ||
      (item.TanggalPembaruan &&
        new Date(item.TanggalPembaruan).toLocaleString().toLowerCase().includes(search))
    );
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} />;
    return sortConfig.direction === "ascending" ? (
      <FontAwesomeIcon icon={faSortUp} />
    ) : (
      <FontAwesomeIcon icon={faSortDown} />
    );
  };

  const sortedItems = [...filteredStockItems].sort((a, b) => {
    if (sortConfig.key) {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === "string") {
        return sortConfig.direction === "ascending"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (aVal instanceof Date || bVal instanceof Date) {
        return sortConfig.direction === "ascending"
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      } else {
        return sortConfig.direction === "ascending" ? aVal - bVal : bVal - aVal;
      }
    }
    return 0;
  });

  const indexOfLastItem = currentPage * (itemsPerPage === "All" ? sortedItems.length : itemsPerPage);
  const indexOfFirstItem = indexOfLastItem - (itemsPerPage === "All" ? sortedItems.length : itemsPerPage);

  const currentItems =
    itemsPerPage === "All"
      ? sortedItems
      : sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages =
    itemsPerPage === "All"
      ? 1
      : Math.ceil(sortedItems.length / itemsPerPage);

  const handleEditClick = (stockItemId, stock) => {
    setEditingRow(stockItemId);
    setTempStock({ ...tempStock, [stockItemId]: stock });
  };

  const handleSaveClick = (stockItemId) => {
    const updatedStock = tempStock[stockItemId];
    dispatch(updateStockItem({ id: stockItemId, Stok: updatedStock }))
      .unwrap()
      .then(() => setEditingRow(null))
      .catch((error) => {
        console.error("Failed to update stock item:", error.message);
      });
  };

  const handleStockChange = (stockItemId, value) => {
    setTempStock({ ...tempStock, [stockItemId]: value });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Stok Bahan Baku", 14, 10);

    const tableColumn = ["No", "Bahan Baku", "Stok", "Satuan", "Tanggal Pembaruan"];
    const tableRows = [];

    sortedItems.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.BahanBaku,
        item.Stok !== null && item.Stok !== undefined ? item.Stok.toLocaleString() : "N/A",
        item.Satuan,
        item.TanggalPembaruan ? new Date(item.TanggalPembaruan).toLocaleString() : "Tidak tersedia",
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("stok_bahan_baku.pdf");
  };

  const exportToExcel = () => {
  const data = sortedItems.map((item, index) => ({
    No: index + 1,
    "Bahan Baku": item.BahanBaku,
    Stok:
      item.Stok !== null && item.Stok !== undefined
        ? item.Stok.toLocaleString()
        : "N/A",
    Satuan: item.Satuan,
    "Tanggal Pembaruan": item.TanggalPembaruan
      ? new Date(item.TanggalPembaruan).toLocaleString()
      : "Tidak tersedia",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Stok Bahan Baku");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const dataBlob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(dataBlob, "stok_bahan_baku.xlsx");
};

  return (
    <div className="admin-table">
      <div className="table-controls">
        <div className="entries-per-page">
          <label>Tampilkan&nbsp;</label>
          <select
            value={itemsPerPage}
            onChange={(e) =>
              setItemsPerPage(e.target.value === "All" ? "All" : parseInt(e.target.value))
            }
          >
            <option value={5}>5</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value="All">All</option>
          </select>
          <label>&nbsp;entri</label>
        </div>
        <button className="export-pdf-button" onClick={exportPDF}>
          Export PDF
        </button>
        <button className="export-excel-button" onClick={exportToExcel}>
          Export Excel
        </button>
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
          <>
            <table>
              <thead>
                <tr>
                  <th> No </th>
                  <th onClick={() => handleSort("BahanBaku")}>Bahan Baku {getSortIcon("BahanBaku")}</th>
                  <th onClick={() => handleSort("Stok")}>Stok {getSortIcon("Stok")}</th>
                  <th onClick={() => handleSort("Satuan")}>Satuan {getSortIcon("Satuan")}</th>
                  <th onClick={() => handleSort("TanggalPembaruan")}>
                    Tanggal Pembaruan {getSortIcon("TanggalPembaruan")}
                  </th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{item.BahanBaku}</td>
                      <td>
                        {editingRow === item.id ? (
                          <input
                            type="number"
                            value={tempStock[item.id] || ""}
                            onChange={(e) => handleStockChange(item.id, e.target.value)}
                          />
                        ) : item.Stok !== null && item.Stok !== undefined ? (
                          item.Stok.toLocaleString()
                        ) : (
                          "Stok belum di tambahkan"
                        )}
                      </td>
                      <td>{item.Satuan}</td>
                      <td>{new Date(item.TanggalPembaruan).toLocaleString()}</td>
                      <td>
                        {editingRow === item.id ? (
                          <button className="save-button" onClick={() => handleSaveClick(item.id)}>
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

            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &laquo; Prev
              </button>
              <span>
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next &raquo;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StockRawMaterialTable;
