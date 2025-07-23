import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBahanBaku,
  deleteBahanBaku,
  updateBahanBaku,
  addBahanBaku,
} from "../redux/bahanbakuslice";
import "../styles/RawMaterialTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSortUp, faSortDown, faSort } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const RawMaterialsTable = () => {
  const dispatch = useDispatch();

  const bahanBaku = useSelector((state) => state.bahanBaku.items);
  const status = useSelector((state) => state.bahanBaku.status);
  const role = useSelector((state) => state.user.user?.role);
  const [searchTerm, setSearchTerm] = useState("");
  const [formBahanBaku, setFormBahanBaku] = useState("");
  const [formHarga, setFormHarga] = useState("");
  const [formSatuan, setFormSatuan] = useState("");
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 

  const formRef = useRef(null);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Bahan Baku", 14, 10);

    const tableColumn = ["No", "Bahan Baku", "Satuan", "Harga", "Terakhir Diperbarui"];
    const tableRows = [];

    sortedItems.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.BahanBaku,
        item.Satuan,
        formatRupiah(item.Harga),
        item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "Tidak tersedia",
      ];
      tableRows.push(rowData);
    });

    if (tableRows.length === 0) {
      doc.text("Tidak ada data yang sesuai filter pencarian.", 14, 20);
    } else {
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });
    }

    doc.save("Laporan_Bahan_Baku.pdf");
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBahanBaku());
    }
  }, [dispatch, status]);

  const exportExcel = () => {
    const data = sortedItems.map((item, index) => ({
      No: index + 1,
      "Bahan Baku": item.BahanBaku,
      Satuan: item.Satuan,
      Harga: item.Harga,
      "Harga (Rp)": formatRupiah(item.Harga),
      "Terakhir Diperbarui": item.updatedAt
        ? new Date(item.updatedAt).toLocaleString()
        : "Tidak tersedia",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Bahan Baku");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(dataBlob, "Laporan_Bahan_Baku.xlsx");
  };

  // Fungsi untuk memformat harga ke dalam format Rupiah
  const formatRupiah = (angka) => {
    const formattedNumber = angka
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `Rp. ${formattedNumber}`;
  };

  const handleSimpan = async (e) => {
    e.preventDefault();

    if (!formBahanBaku || !formHarga || !formSatuan) {
      setErrorMessage("Kolom harus lengkap terisi!");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    if (!/^[\w\s!@#$%^&*()\-+=,.<>?;:'"{}[\]\\|/`~]*$/.test(formBahanBaku)) {
      setErrorMessage("Input tidak valid");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    if (isNaN(formHarga) || parseFloat(formHarga) < 0) {
      setErrorMessage("Harga hanya bisa diisi dengan Angka");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    if (!/^[A-Za-z]{1,3}$/.test(formSatuan)) {
      setErrorMessage("Satuan harus terdiri dari maksimal 3 huruf saja");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    // // **Cek apakah BahanBaku sudah ada di daftar**
    // const isDuplicate = bahanBaku.some(
    //   (item) => item.BahanBaku.toLowerCase() === formBahanBaku.toLowerCase()
    // );
    // if (isDuplicate) {
    //   setErrorMessage("Bahan Baku sudah ada, tidak dapat menambahkan!");
    //   setTimeout(() => {
    //     setErrorMessage("");
    //   }, 3000);
    //   return;
    // }

    setErrorMessage("");
    setLoading(true);
    // const currentDate = new Date().toLocaleString();

    if (editId) {
      await dispatch(
        updateBahanBaku({
          id: editId,
          BahanBaku: formBahanBaku,
          Harga: formHarga,
          Satuan: formSatuan,
          LastUpdated: lastUpdated,
        })
      )
        .unwrap()
        .then(() => {
          setSuccessMessage("Bahan Baku berhasil diupdate!");
          setTimeout(() => setSuccessMessage(""), 3000);
          dispatch(fetchBahanBaku());
        });
      setEditId(null);
    } else {
      await dispatch(
        addBahanBaku({
          BahanBaku: formBahanBaku,
          Harga: formHarga,
          Satuan: formSatuan,
          LastUpdated: lastUpdated,
        })
      )
        .unwrap()
        .then(() => {
          setSuccessMessage("Bahan Baku berhasil ditambahkan!");
          setTimeout(() => setSuccessMessage(""), 3000);
          dispatch(fetchBahanBaku());
        });
    }

    setLoading(false);
    setFormBahanBaku("");
    setFormHarga("");
    setFormSatuan("");
    setLastUpdated("");
  };

  const handleUbah = (id) => {
    const itemToEdit = bahanBaku.find((item) => item.id === id);

    if (itemToEdit) {
      setFormBahanBaku(itemToEdit.BahanBaku);
      setFormHarga(itemToEdit.Harga);
      setFormSatuan(itemToEdit.Satuan);
      setEditId(id);
      setLastUpdated(itemToEdit.updatedAt);

      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleHapus = async (id) => {
    try {
      setShowDeleteConfirmation(true);
      setIdToDelete(id);
      setModalMessage("Anda yakin ingin menghapus bahan baku ini?");
      setShowModal(true);
    } catch (error) {
      setModalMessage("Maaf, terjadi kesalahan saat menghapus Bahan Baku.");
      setShowModal(true);
    }
  };

  const handleDeleteConfirmation = async () => {
    try {
      const { error, payload } = await dispatch(deleteBahanBaku(idToDelete));

      if (error) {
        if (payload.includes("Bahan Baku tidak dapat dihapus")) {
          setModalMessage(
            "Bahan Baku tidak dapat dihapus karena sedang digunakan oleh Produk"
          );
        } else {
          setModalMessage(`Terjadi kesalahan: ${payload}`);
        }
      } else {
        setModalMessage("Bahan Baku berhasil dihapus!");
      }

      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      setShowDeleteConfirmation(false);
    } catch (error) {
      setModalMessage("Maaf, terjadi kesalahan saat menghapus Bahan Baku.");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteConfirmation(false);
  };

  const filteredStockItems = bahanBaku.filter((item) => {
    const search = searchTerm.toLowerCase();
    const hargaFormatted = formatRupiah(item.Harga).toLowerCase(); // ✅ Format harga ke Rupiah string

    return (
      item.BahanBaku.toLowerCase().includes(search) ||
      item.Satuan.toLowerCase().includes(search) ||
      hargaFormatted.includes(search) || // ✅ Cocokkan dengan harga dalam format Rupiah
      (item.updatedAt &&
        new Date(item.updatedAt)
          .toLocaleString()
          .toLowerCase()
          .includes(search))
    );
  });
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = [...filteredStockItems].sort((a, b) => {
    if (sortConfig.key) {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === "string") {
        return sortConfig.direction === "ascending"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
      } else {
        return sortConfig.direction === "ascending" ? aVal - bVal : bVal - aVal;
      }
    }
  return 0;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} />;
    return sortConfig.direction === "ascending" ? (
      <FontAwesomeIcon icon={faSortUp} />
    ) : (
      <FontAwesomeIcon icon={faSortDown} />
    );
  };

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

  return (
    <div className="admin-table-container">
      {/* Form for Adding/Updating Bahan Baku - Visible to Admin, Operator, and User */}
      {["Admin", "Operator", "User"].includes(role) && (
        <form onSubmit={handleSimpan} className="form-container" ref={formRef}>
          {/* Form fields */}
          <div className="form-group">
            <label htmlFor="formBahanBaku" className="text-form">
              Bahan Baku
            </label>
            <input
              type="text"
              id="formBahanBaku"
              placeholder="Masukan Bahan Baku"
              value={formBahanBaku}
              onChange={(e) => setFormBahanBaku(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Satuan (Maks 3 Huruf)</label>
            <input
              type="text"
              placeholder="cth: Kg"
              value={formSatuan}
              onChange={(e) => setFormSatuan(e.target.value.toUpperCase())}
              className="form-input"
              maxLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="formHargaKilo" className="text-form">
              Harga/Satuan
            </label>
            <input
              type="text"
              id="formHargaKilo"
              placeholder="cth: 10000"
              value={formHarga}
              onChange={(e) => setFormHarga(e.target.value)}
              className="form-input"
            />
          </div>

          {errorMessage && (
            <div className="message error-message">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="message success-message">{successMessage}</div>
          )}

          <div className="button-group-container">
            <button type="submit" className="button-group" disabled={loading}>
              {loading ? <div className="spinner"></div> : "Simpan"}
            </button>
          </div>
        </form>
      )}

      {/* Table and Search */}
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

        <button className="export-excel-button" onClick={exportExcel}>
          Export Excel
        </button>

        <div className="search-container">
          <FontAwesomeIcon
            icon={faSearch}
            className={`search-icon ${searchTerm ? "hidden" : ""}`}
          />
          <input
            type="text"
            placeholder="      Cari Bahan Baku"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>No</th>
            <th onClick={() => handleSort("BahanBaku")}>Bahan Baku {getSortIcon("BahanBaku")}</th>
            <th onClick={() => handleSort("Satuan")}>Satuan {getSortIcon("Satuan")}</th>
            <th onClick={() => handleSort("Harga")}>Harga/satuan {getSortIcon("Harga")}</th>
            <th onClick={() => handleSort("updatedAt")}>Terakhir Diperbarui {getSortIcon("updatedAt")}</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{item.BahanBaku}</td>
              <td>{item.Satuan}</td>
              <td>{formatRupiah(item.Harga)}</td>
              <td>{new Date(item.updatedAt).toLocaleString()}</td>
              <td>
                {["Admin", "Operator", "User"].includes(role) ? (
                  <>
                    <button onClick={() => handleUbah(item.id)} className="edit-raw-button">Ubah</button>
                    <button onClick={() => handleHapus(item.id)} className="delete-raw-button">Hapus</button>
                  </>
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          &laquo; Prev
        </button>
        <span> Halaman {currentPage} dari {totalPages} </span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next &raquo;
        </button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Informasi</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>localf
        <Modal.Footer>
          {showDeleteConfirmation && (
            <>
              <Button variant="danger" onClick={handleDeleteConfirmation}>
                Hapus
              </Button>
              <Button variant="secondary" onClick={handleCloseModal}>
                Batal
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RawMaterialsTable;
