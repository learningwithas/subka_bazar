import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setShowProduct, logoutUser } from "../../App/StoreSlice";
import { FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cart = useSelector((state) => state.store.cart);
  const user = useSelector((state) => state.store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav id="navbar" className="container">
      <div className="logo-menu d-flex justify-content-between align-items-center">
        {/* Logo */}
        <div className="logo">
          <img src="logo.png" alt="Sabka Bazaar" />
        </div>

        {/* Hamburger Icon - Visible on mobile */}
        <div
          data-testid="hamburger-menu" // Add test ID here
          className="hamburger d-md-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </div>

        {/* Main Menu - Desktop */}
        <div className="menuitem d-none d-md-flex gap-3">
          <Link to="/">Home</Link>
          <Link onClick={() => dispatch(setShowProduct("all"))} to="/products">
            Products
          </Link>
        </div>
      </div>

      {/* Mobile Menu - Shows when the hamburger is clicked */}
      {isMobileMenuOpen && (
        <div className="mobile-menu d-md-none" data-testid="mobile-menu">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link
            onClick={() => {
              dispatch(setShowProduct("all"));
              setIsMobileMenuOpen(false);
            }}
            to="/products"
          >
            Products
          </Link>
        </div>
      )}

      {/* User Section */}
      <div className="menu_signup d-none d-md-flex">
        <div className="signup d-flex">
          {user.isLoggedIn ? (
            <div className="user-profile d-flex align-items-center">
              <div
                className="user-initial d-flex justify-content-center align-items-center rounded-circle bg-primary text-white fw-bold"
                style={{ width: "50px", height: "50px", fontSize: "20px" }}
              >
                {user.userEmail.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-danger ms-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/signup">Signup</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </div>

        {/* Cart Icon */}
        <div className="menu_cart d-flex align-items-center position-relative">
          <button
            onClick={() => navigate("/cart")}
            className="cart d-flex align-items-center border position-relative"
          >
            <img src="cart.svg" alt="Cart" />
            {cart.length > 0 && (
              <span className="cart-badge position-absolute top-0 start-100 translate-middle bg-danger text-white rounded-circle px-2">
                {cart.length}
              </span>
            )}
          </button>

          <div className="orderList border p-2 rounded bg-light">
            <Link
              to={`/orders/${user.userEmail}`}
              className="text-primary fw-bold text-decoration-none"
            >
              Your Orders
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
