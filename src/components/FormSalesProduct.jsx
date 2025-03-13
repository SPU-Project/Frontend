// FormSalesProduct.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import AdminHeader from "./AdminHeader(Sales)";
import "../styles/FormSalesProduct.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createPenjualanProduk,
  updatePenjualanProduk,
  fetchPenjualanProdukById,
} from "../redux/penjualanProdukSlice";
// Import slice fetch status produksi
import { fetchStatusProduksi } from "../redux/statusprodukSlice";
import { Modal } from "react-bootstrap";

function FormSalesProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditing = !!id;

  // State penjualan
  const { currentItem, loading, error } = useSelector(
    (state) => state.penjualanproduk
  );
  // State statusProduksi
  const { items: statusItems } = useSelector((state) => state.statusproduksi);

  const [formData, setFormData] = useState({
    NamaProduk: "",
    Batch: "",
    Margin: "",
  });

  // State modal untuk notifikasi error saat menyimpan
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveModalMessage, setSaveModalMessage] = useState("");

  // List margin
  const marginOptions = [
    { value: "20%", label: "20%" },
    { value: "30%", label: "30%" },
    { value: "40%", label: "40%" },
    { value: "50%", label: "50%" },
    { value: "60%", label: "60%" },
    { value: "70%", label: "70%" },
    { value: "80%", label: "80%" },
    { value: "90%", label: "90%" },
    { value: "100%", label: "100%" },
  ];

  // --- [1] Ambil data statusproduksi dan data penjualan (jika edit)
  useEffect(() => {
    dispatch(fetchStatusProduksi()); // GET /status-produksi
    if (isEditing) {
      dispatch(fetchPenjualanProdukById(id));
    }
  }, [dispatch, isEditing, id]);

  // --- [2] Jika edit, set formData dari currentItem
  useEffect(() => {
    if (isEditing && currentItem) {
      setFormData({
        NamaProduk: currentItem.NamaProduk,
        Batch: currentItem.Batch,
        Margin: currentItem.Margin,
      });
    }
  }, [isEditing, currentItem]);

  // --- [3] Buat array options untuk NamaProduk & Batch
  const uniqueNamaProduk = [...new Set(statusItems.map((s) => s.NamaProduk))];
  const namaProdukOptions = uniqueNamaProduk.map((nama) => ({
    value: nama,
    label: nama,
  }));

  const uniqueBatch = [...new Set(statusItems.map((s) => s.Batch))];
  const batchOptions = uniqueBatch.map((b) => ({
    value: b,
    label: b,
  }));

  // onSubmit
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await dispatch(
          updatePenjualanProduk({
            id,
            updatedData: formData,
          })
        ).unwrap();
      } else {
        await dispatch(createPenjualanProduk(formData)).unwrap();
      }
      navigate("/sales-product");
    } catch (err) {
      console.error("Error:", err);
      // Tampilkan modal notifikasi error selama 2 detik
      const errMsg = err.message ? err.message : err;
      setSaveModalMessage("Gagal menyimpan data: " + errMsg);
      setShowSaveModal(true);
      setTimeout(() => setShowSaveModal(false), 2000);
    }
  };

  const handleCancel = () => {
    navigate("/sales-product");
  };

  // Mendapatkan nilai selected untuk react-select
  const selectedNama =
    namaProdukOptions.find((opt) => opt.value === formData.NamaProduk) || null;

  const selectedBatch =
    batchOptions.find((opt) => opt.value === formData.Batch) || null;

  const selectedMargin =
    marginOptions.find((m) => m.value === formData.Margin) || null;

  return (
    <div className="product-form-table">
      <AdminHeader />
      <div className="form-sales-product">
        {loading && <p>Loading...</p>}
        {/* Error dari slice tidak ditampilkan secara blocking */}
        {/* <p>{error && `Error: ${error}`}</p> */}

        <form onSubmit={handleSave}>
          <table className="sales-product-table">
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Batch</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Select
                    options={namaProdukOptions}
                    value={selectedNama}
                    onChange={(selected) =>
                      setFormData({
                        ...formData,
                        NamaProduk: selected.value,
                      })
                    }
                    placeholder="Pilih Nama Produk"
                    isClearable
                  />
                </td>
                <td>
                  <Select
                    options={batchOptions}
                    value={selectedBatch}
                    onChange={(selected) =>
                      setFormData({
                        ...formData,
                        Batch: selected.value,
                      })
                    }
                    placeholder="Pilih Batch"
                    isClearable
                  />
                </td>
                <td>
                  <Select
                    options={marginOptions}
                    value={selectedMargin}
                    onChange={(selected) =>
                      setFormData({ ...formData, Margin: selected.value })
                    }
                    placeholder="Pilih Margin"
                    isClearable
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="form-actions">
            <button type="submit" className="save-button">
              Simpan
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Batal
            </button>
          </div>
        </form>
      </div>

      {/* Modal untuk notifikasi error saat menyimpan */}
      <Modal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>{saveModalMessage}</Modal.Body>
      </Modal>
    </div>
  );
}

export default FormSalesProduct;
