import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LogHistoryTable.css";
import "../styles/RawMaterialTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchRiwayat } from "../redux/riwayatSlice"; // Adjust the path as necessary

function LogHistoryTable({ searchTerm = "", onSearchChange }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get log history data from Redux store
  const { items: logs, loading, error } = useSelector((state) => state.riwayat);

  useEffect(() => {
    // Fetch log history when the component mounts
    dispatch(fetchRiwayat());
  }, [dispatch]);

  // Filter logs based on the search term (username or description)
  const filteredLogs = logs.filter(
    (log) =>
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-table-container">
      <div className="table-controls">
        <div className="search-container">
          <FontAwesomeIcon
            icon={faSearch}
            className={`search-icon ${searchTerm ? "hidden" : ""}`}
          />
          <input
            type="text"
            placeholder="Cari Pengguna atau Keterangan"
            value={searchTerm}
            onChange={onSearchChange}
            className="search-input"
          />
        </div>
      </div>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Hak Akses</th>
              <th>Waktu</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <tr key={log.id}>
                  <td>{index + 1}</td>
                  <td>{log.username}</td>
                  <td>{log.role}</td>
                  <td>{new Date(log.date).toLocaleString()}</td>
                  <td>{log.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Tidak ada riwayat yang ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Include Modal if needed */}
        <Modal show={false} onHide={() => {}}>
          {/* Modal content */}
        </Modal>
      </div>
    </div>
  );
}

export default LogHistoryTable;
