import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../App/StoreSlice"; // Import fetchCategories from storeSlice
import "./CategoriesList.css";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.store.categories); // Access categories from storeSlice

  useEffect(() => {
    dispatch(fetchCategories()); // Fetch categories when component mounts
  }, [dispatch]);

  const [categoryid, setCategoryid] = useState("all");

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
              <div className="col-md-6 text-center">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="img-fluid category-image"
                />
              </div>

              {/* Content */}
              <div className="col-md-6">
                <div className="category-content text-md-start text-center">
                  <h5>{category.name}</h5>
                  <p>{category.description}</p>
                  <Link to={`/products/${category.id}`}>
                    <button
                      onClick={() => setCategoryid(category.id)}
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
