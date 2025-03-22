import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
  addToCart,
  removeFromCart,
  setShowProduct,
} from "../../App/StoreSlice";
import { Link, useParams } from "react-router-dom";
import { FiMinus, FiPlus } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";

const Products = () => {
  const dispatch = useDispatch();
  const { products, categories, showProduct, cart } = useSelector(
    (state) => state.store
  );
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([dispatch(fetchProducts()), dispatch(fetchCategories())])
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("Error fetching products/categories:", err);
        setError("Failed to load products.");
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const increaseQuantity = (product) => {
    dispatch(addToCart(product));
  };

  const decreaseQuantity = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const getQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div className="container text-center mt-4">Loading products...</div>
    );
  }

  if (error) {
    return (
      <div className="container text-center text-danger mt-4">{error}</div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Category Links */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <Link
            to="/products/all"
            className={`nav-link ${id === "all" ? "active" : ""}`}
            onClick={() => dispatch(setShowProduct("all"))}
          >
            All
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category._id} className="nav-item">
            <Link
              to={`/products/${category.id}`}
              className={`nav-link ${id === category.id ? "active" : ""}`}
              onClick={() => dispatch(setShowProduct(category.id))}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Product Cards */}
      <div className="row">
        {products
          .filter(
            (product) =>
              showProduct === "all" || String(product.category) === String(id)
          )
          .map((product) => (
            <div key={product.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm d-flex flex-column h-100">
                <img
                  src={`${import.meta.env.BASE_URL}${product.imageURL}`}
                  alt={product.name}
                  className="card-img-top"
                  loading="lazy"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted flex-grow-1">
                    {product.description}
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <span className="text-danger fw-bold">${product.price}</span>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => decreaseQuantity(product.id)}
                      disabled={getQuantity(product.id) === 0}
                      aria-label="decrease quantity"
                    >
                      <FiMinus />
                    </button>
                    <span className="btn btn-outline-secondary">
                      {getQuantity(product.id)}
                    </span>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => increaseQuantity(product)}
                      aria-label="increase quantity"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Products;
