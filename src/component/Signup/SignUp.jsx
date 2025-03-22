import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../App/StoreSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./SignUp.css"; // Import custom styles if needed

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const existingUser = useSelector((state) => state.store.user.userData);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if email already exists
    if (existingUser && existingUser.email === formData.email) {
      alert("This email is already registered. Please use a different email.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      return;
    }

    // Dispatch Redux action to register user
    dispatch(registerUser(formData));

    alert("Signup Successful! You are now logged in.");

    navigate("/");
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="row w-75">
        {/* Left Section */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="fw-bold">Signup</h2>
          <p className="text-muted">
            We do not share your personal details with anyone.
          </p>
        </div>

        {/* Right Section */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="p-4 shadow rounded">
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-danger w-100">
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
