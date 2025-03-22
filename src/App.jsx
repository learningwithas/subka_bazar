import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home/Home";
import { Routes, Route, useParams } from "react-router-dom";
import Products from "./pages/Products/Products";
import Navbar from "./component/navbar/Navbar";
import Footer from "./component/Footer/Footer";
import SignUp from "./component/Signup/SignUp";
import Login from "./component/Login/Login";
import Cart from "./pages/Cart/Cart";
import ThankYou from "./component/ThankYou/ThankYou";
import OrderList from "./pages/OrderList/OrderList";

const App = () => {
  const { userId } = useParams(); // Get userId from URL
  return (
    <div className="app_container border-bottom">
      <Navbar />
      {/*  */}
      <Routes>
        <Route path="/" element={<Home />} key="home" />
        <Route path="/products" element={<Products />} key="products" />
        <Route
          path="/products/:id"
          element={<Products />}
          key="product-details"
        />
        <Route path="/signup" element={<SignUp />} key="signup" />
        <Route path="/login" element={<Login />} key="login" />
        <Route path="/cart" element={<Cart />} key="cart" />

        <Route path="/thankyou" element={<ThankYou />} key="thankyou" />
        <Route path="/orders" element={<OrderList />} key="orders" />
        <Route
          path="/orders/:userId"
          element={<OrderList />}
          key="userOrders"
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
