import React from "react";
import Advertise from "../../component/Advetisement/Advertise";
import CategoriesList from "../../component/CategoryList/CategoriesList";

const Home = () => {
  return (
    <div className="container">
      <Advertise />
      <CategoriesList />
    </div>
  );
};

export default Home;
