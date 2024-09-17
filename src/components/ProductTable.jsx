import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/ProductTable.css'; // Pastikan path CSS benar
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

// Dummy product data
const initialProducts = [
  { id: 1, name: 'Tepung Terigu', hpp: 'Rp. 12.500' },
  { id: 2, name: 'Gula Pasir', hpp: 'Rp. 10.000' },
  { id: 3, name: 'Susu Bubuk', hpp: 'Rp. 15.000' },
  { id: 4, name: 'Minyak Goreng', hpp: 'Rp. 20.000' },
  { id: 5, name: 'Telur Ayam', hpp: 'Rp. 22.000' },
  { id: 6, name: 'Mentega', hpp: 'Rp. 18.000' },
];

function ProductTable({ searchTerm = '', onSearchChange }) {
  const navigate = useNavigate(); // Initialize navigate
  const [products, setProducts] = useState(initialProducts);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProductName, setEditedProductName] = useState('');
  const [editedProductHpp, setEditedProductHpp] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product) => {
    setEditProductId(product.id);
    setEditedProductName(product.name);
    setEditedProductHpp(product.hpp);
  };

  const handleUpdate = () => {
    setProducts(products.map(product =>
      product.id === editProductId ? { ...product, name: editedProductName, hpp: editedProductHpp } : product
    ));
    setEditProductId(null);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleAddProduct = () => {
    navigate('/form'); // Navigate to ProductFormPage
  };

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
            <th rowSpan="2" style={{width: '5%'
            }}>Aksi</th>
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
            filteredProducts.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>
                  {editProductId === product.id ? (
                    <input
                      type="text"
                      value={editedProductName}
                      onChange={(e) => setEditedProductName(e.target.value)}
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {editProductId === product.id ? (
                    <input
                      type="text"
                      value={editedProductHpp}
                      onChange={(e) => setEditedProductHpp(e.target.value)}
                    />
                  ) : (
                    product.hpp
                  )}
                </td>
                <td>{product.hpp}</td> {/* 20% */}
                <td>{product.hpp}</td> {/* 30% */}
                <td>{product.hpp}</td> {/* 40% */}
                <td>{product.hpp}</td> {/* 50% */}
                <td>{product.hpp}</td> {/* 60% */}
                <td>{product.hpp}</td> {/* 70% */}
                <td>{product.hpp}</td> {/* 80% */}
                <td>{product.hpp}</td> {/* 90% */}
                <td>{product.hpp}</td> {/* 100% */}
                <td>
                  {editProductId === product.id ? (
                    <button 
                      className="save-button"
                      onClick={handleUpdate}
                    >
                      Simpan
                    </button>
                  ) : (
                    <>
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(product)}
                      >
                        Ubah
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(product.id)}
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
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
