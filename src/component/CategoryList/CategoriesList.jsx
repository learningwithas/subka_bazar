import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../App/StoreSlice"; // Import fetchCategories from storeSlice
import "./CategoriesList.css";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.store.categories); // Access categories from storeSlice
  const [categoryId, setCategoryId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories())
      .unwrap()
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container text-center mt-4">Loading categories...</div>
    );
  }

  if (error) {
    return (
      <div className="container text-center text-danger mt-4">{error}</div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="container text-center mt-4">No categories available.</div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {categories.map((category, index) => (
          <div key={category.id} className="col-md-12 mb-4">
            <div
              className={`row align-items-center category-card ${
                index % 2 === 0 ? "flex-row-reverse" : ""
              }`}
            >
              {/* Image Section */}
              <div className="col-md-6 text-center">
                <img
                  src={`${import.meta.env.BASE_URL}${category.imageUrl}`}
                  alt={category.name}
                  className="img-fluid category-image"
                  loading="lazy"
                />
              </div>

              {/* Content Section */}
              <div className="col-md-6">
                <div className="category-content text-md-start text-center">
                  <h5>{category.name}</h5>
                  <p>{category.description}</p>
                  <Link
                    style={{ color: "black" }}
                    to={`/products/${category.id}`}
                  >
                    <button
                      onClick={() => setCategoryId(category.id)}
                      className="btn explore-btn"
                    >
                      Explore {category.key}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
