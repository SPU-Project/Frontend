import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/productTableSlice";

function ProductTable({ searchTerm = "", onSearchChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.productTable
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product) =>
    product.produk.namaProduk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product) => {
    // Pass the product details, including ingredients, to the form page
    navigate(`/form/${product.produkId}`, { state: { product } });
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id))
      .unwrap()
      .then(() => {
        // Dispatch fetchProducts to refresh the product list
        dispatch(fetchProducts());
      })
      .catch((err) => {
        console.error("Gagal menghapus produk:", err);
      });
  };

  const handleAddProduct = () => {
    navigate("/form");
  };

  if (loading) {
    return <div>Memuat data produk...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-table">
      <div className="table-controls">
        <button className="add-button" onClick={handleAddProduct}>
          <FontAwesomeIcon icon={faPlus} /> Tambah Produk
        </button>
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
      <table>
        <thead>
          <tr>
            <th rowSpan="2">No</th>
            <th rowSpan="2">Produk</th>
            <th rowSpan="2">HPP</th>
            <th colSpan="9">Margin</th>
            <th rowSpan="2">Aksi</th>
          </tr>
          <tr>
            <th>20%</th>
            <th>30%</th>
            <th>40%</th>
            <th>50%</th>
            <th>60%</th>
            <th>70%</th>
            <th>80%</th>
            <th>90%</th>
            <th>100%</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => {
              const produk = product.produk;
              return (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{produk.namaProduk}</td>
                  <td>{`Rp. ${parseFloat(produk.hpp).toLocaleString()}`}</td>
                  <td>{`Rp. ${parseFloat(
                    produk.margin20
                  ).toLocaleString()}`}</td>
                  <td>{`Rp. ${parseFloat(
                    produk.margin30
                  ).toLocaleString()}`}</td>
                  <td>{`Rp. ${parseFloat(
                    produk.margin40
                  ).toLocaleString()}`}</td>
                  <td>{`Rp. ${parseFloat(
                    produk.margin50
                  ).toLocaleString()}`}</td>
                  <td>{`Rp. ${parseFloat(
                    produk.margin60
                  ).toLocaleString()}`}</td>
                  <td>{`Rp. ${parseFloat(
                    produk.margin70
                  ).toLocaleString()}`}</td>
                  <td>{`Rp. ${parseFloat(
                    produk.margin80
                  ).toLocaleString()}`}</td>
                  <td>{`Rp. ${parseFloat(
                    produk.margin90
                  ).toLocaleString()}`}</td>
                  <td>{`Rp. ${parseFloat(
                    produk.margin100
                  ).toLocaleString()}`}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(product)}
                    >
                      Ubah
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(product.produkId)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="14">Tidak ada produk yang ditemukan</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
