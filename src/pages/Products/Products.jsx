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
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const increaseQuantity = (product) => {
    dispatch(addToCart(product));
    setQuantities((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));
  };

  const decreaseQuantity = (productId) => {
    dispatch(removeFromCart(productId));
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  };

  return (
    <div className="container mt-4">
      {/* Category Links */}
      <ul className="nav nav-pills mb-4">
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
                  src={product.imageURL}
                  alt={product.name}
                  className="card-img-top"
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
                      aria-label="decrease quantity"
                    >
                      <FiMinus />
                    </button>
                    <span className="btn btn-outline-secondary">
                      {quantities[product.id] || 0}
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
