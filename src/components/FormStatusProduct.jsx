import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import AdminHeader from "./AdminHeader"; // Import AdminHeader
import "../styles/FormStatusProduct.css"; // Import CSS file

function FormStatusProduct() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [margin, setMargin] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    // Implement save functionality
    console.log({
      productName,
      productionDate,
      quantity,
      margin,
    });
  };

  const handleCancel = () => {
    navigate("/status-product");
    console.log("Form canceled");
  };

  return (
    <div className="product-form-table">
      <AdminHeader />
      <div className="form-status-product">
        <form onSubmit={handleSave}>
          <table className="status-product-table">
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Tanggal Produksi</th>
                <th>Jumlah</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Select
                    options={[{ value: "product1", label: "Product 1" }]}
                    onChange={(selectedOption) =>
                      setProductName(selectedOption.value)
                    }
                    placeholder="Pilih Produk"
                    className="select-input"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={productionDate}
                    onChange={(e) => setProductionDate(e.target.value)}
                    required
                    className="input-field"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Jumlah"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="input-field"
                  />
                </td>
                <td>
                  <Select
                    options={[{ value: "margin1", label: "Margin 1" }]}
                    onChange={(selectedOption) =>
                      setMargin(selectedOption.value)
                    }
                    placeholder="Pilih Margin"
                    className="select-input"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Tombol aksi */}
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
    </div>
  );
}

export default FormStatusProduct;
