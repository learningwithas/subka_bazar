import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanners } from "../../App/StoreSlice"; // Import fetchBanners from storeSlice

const Advertise = () => {
  const dispatch = useDispatch();
  const banners = useSelector((state) => state.store.banners); // Access banners from storeSlice
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchBanners())
      .unwrap()
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching banners:", err);
        setError("Failed to load advertisement.");
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    if (banners.length > 0) {
      setRandomIndex(Math.floor(Math.random() * banners.length));
    }
  }, [banners]);

  if (loading) {
    return (
      <div className="advertise container text-center">
        Loading advertisement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="advertise container text-center text-danger">{error}</div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="advertise container text-center">
        No advertisements available.
      </div>
    );
  }

  return (
    <div className="advertise container">
      {banners[randomIndex]?.bannerImageUrl && (
        <img
          className="img-fluid"
          src={`${import.meta.env.BASE_URL}${
            banners[randomIndex].bannerImageUrl
          }`}
          alt="Advertisement"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default Advertise;
