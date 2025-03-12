// src/components/AdminSidebar.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminSidebar.css";
import UserPicPlaceholder from "../assets/images/UserPic.png";
import { fetchUser, logoutUser } from "../redux/userSlice";
import { fetchImage, uploadImage } from "../redux/imageSlice"; // Import actions
import { FiEdit } from "react-icons/fi";
import CropperModal from "./CropperModal"; // Import komponen CropperModal

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.user.user?.role);
  const username = useSelector((state) => state.user.user?.username || "User");
  const userStatus = useSelector((state) => state.user.status);
  const profileImage =
    useSelector((state) => state.image.image) || UserPicPlaceholder;
  const [hover, setHover] = useState(false);
  // State untuk file yang dipilih dan sumber gambarnya (data URL)
  const [selectedImage, setSelectedImage] = useState(null);
  // State untuk menampilkan modal cropper
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    dispatch(fetchUser())
      .unwrap()
      .then(() => {
        console.log("User data fetched");
      })
      .catch((err) => {
        console.error(err.message);
        navigate("/");
      });

    // Panggil fetchImage secara terpisah
    dispatch(fetchImage())
      .unwrap()
      .then(() => {
        console.log("Profile image fetched successfully");
      })
      .catch((err) => {
        console.error("Error fetching image:", err);
      });
  }, [dispatch, navigate]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err.message);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Baca file sebagai data URL agar bisa dipreview di cropper
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi untuk menangani hasil crop dari modal
  const handleCropComplete = (croppedImageBlob) => {
    setShowCropper(false);
    // Konversi blob ke File dengan nama dan tipe yang tepat
    const croppedImageFile = new File([croppedImageBlob], "cropped.jpg", {
      type: "image/jpeg",
    });

    // Dispatch uploadImage dengan file yang telah dikonversi
    dispatch(uploadImage(croppedImageFile))
      .unwrap()
      .then((response) => {
        console.log("Upload successful:", response);
        dispatch(fetchImage());
      })
      .catch((error) => {
        console.error("Upload error:", error);
      });
  };

  // Jika crop dibatalkan
  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedImage(null);
  };

  return (
    <nav className="admin-sidebar">
      <div className="profile">
        <div
          className="profile-pic-container"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <img src={profileImage} alt="Profile" className="profile-pic" />
          {hover && (
            <label htmlFor="file-upload" className="edit-icon">
              <FiEdit />
            </label>
          )}
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <h3>{username}</h3>
      </div>
      <ul>
        {["Admin", "Operator", "User"].includes(role) && (
          <li>
            <Link to="/raw-materials" className="sidebar-link">
              Bahan Baku
            </Link>
          </li>
        )}
        {["Admin", "Operator"].includes(role) && (
          <>
            <li>
              <Link to="/stock-raw-materials" className="sidebar-link">
                Stok Bahan Baku
              </Link>
            </li>
            <li>
              <Link to="/products" className="sidebar-link">
                Produk
              </Link>
            </li>
            <li>
              <Link to="/status-product" className="sidebar-link">
                Status Produk
              </Link>
            </li>
          </>
        )}
        {role === "Admin" && (
          <>
            <li>
              <Link to="/sales-product" className="sidebar-link">
                Penjualan Produk
              </Link>
            </li>
            <li>
              <Link to="/user-management" className="sidebar-link">
                Manajemen Pengguna
              </Link>
            </li>
            <li>
              <Link to="/log-history" className="sidebar-link">
                Riwayat Log
              </Link>
            </li>
          </>
        )}
        <hr
          style={{ width: "100%", borderWidth: "4px", borderColor: "white" }}
        />
        <li>
          <button
            onClick={handleLogout}
            className="sidebar-link"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Keluar
          </button>
        </li>
      </ul>
      {/* Tampilkan modal cropper jika ada file yang dipilih */}
      {showCropper && selectedImage && (
        <CropperModal
          imageSrc={selectedImage}
          onCancel={handleCropCancel}
          onComplete={handleCropComplete}
        />
      )}
    </nav>
  );
}

export default AdminSidebar;
