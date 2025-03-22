import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../App/StoreSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Login.css"; // Import custom styles if needed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedData = localStorage.getItem("signupFormData");

    if (!savedData) {
      alert("No account found. Please sign up first.");
      return;
    }

    const parsedData = JSON.parse(savedData);

    if (parsedData.email === email && parsedData.password === password) {
      alert("Login successful!");

      // Dispatch Redux action to update user state
      dispatch(loginUser(email));

      navigate("/");
    } else {
      alert("Invalid credentials. Please try again.");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="row w-75">
        {/* Left Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="fw-bold">Login</h2>
          <p className="text-muted">
            Get access to your Orders, Wishlist, and Recommendations
          </p>
        </div>

        {/* Right Section */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="p-4 shadow rounded">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-danger w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
