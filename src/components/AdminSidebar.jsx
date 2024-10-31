import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminSidebar.css";
import UserPicPlaceholder from "../assets/images/UserPic.png"; // Placeholder image
import { fetchUser, logoutUser } from "../redux/userSlice";
import { fetchProfileImage } from "../redux/profileSlice"; // Import fetchProfileImage

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useSelector((state) => state.user.user?.username || "User");
  const status = useSelector((state) => state.user.status);
  const profileImage = useSelector(
    (state) => state.profile.profileImage || UserPicPlaceholder
  );

  useEffect(() => {
    if (status === "idle") {
      Promise.all([
        dispatch(fetchUser()).unwrap(),
        dispatch(fetchProfileImage()).unwrap(),
      ])
        .then(() => {
          // Semua data berhasil di-fetch
          console.log("User data and profile image fetched successfully");
        })
        .catch((err) => {
          console.error(err.message);
          navigate("/");
        });
    }
  }, [dispatch, status, navigate]);

  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      await dispatch(logoutUser()).unwrap();
      console.log("Logout successful, clearing user data from Redux store");
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err.message);
    }
  };

  return (
    <nav className="admin-sidebar">
      <div className="profile">
        <img
          src={profileImage}
          alt="Profile"
          style={{
            borderRadius: "50%",
            width: "120px",
            height: "120px",
            objectFit: "cover",
          }}
        />
        <h3>{username}</h3> {/* Menampilkan username dari Redux */}
      </div>
      <ul>
        <li>
          <Link to="/raw-materials" className="sidebar-link">
            Bahan Baku
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
        <li>
          <Link to="/user-management" className="sidebar-link">
            Manajemen Pengguna
          </Link>
        </li>
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
    </nav>
  );
}

export default AdminSidebar;
