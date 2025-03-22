import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanners } from "../../App/StoreSlice"; // Import fetchBanners from storeSlice

const Advertise = () => {
  const dispatch = useDispatch();
  const banners = useSelector((state) => state.store.banners); // Access banners from storeSlice

  useEffect(() => {
    dispatch(fetchBanners()); // Fetch banners when component mounts
  }, [dispatch]);

  console.log("Banners:", banners); // Logging banners to check
  let randomNumber =
    banners.length > 0 ? Math.floor(Math.random() * banners.length) : 0;

  return (
    <div className="advertise container">
      {banners.length > 0 && banners[randomNumber]?.bannerImageUrl && (
        <img
          className="img-fluid"
          src={banners[randomNumber].bannerImageUrl}
          alt="Advertisement"
        />
      )}
    </div>
  );
};

export default Advertise;
