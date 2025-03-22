import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../App/StoreSlice";
import "bootstrap/dist/css/bootstrap.min.css";

const ThankYou = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams(); // Get userId from URL

  useEffect(() => {
    // Clear cart after checkout using Redux
    dispatch(clearCart());

    // Redirect to order list page after 3 seconds
    const timer = setTimeout(() => {
      navigate(`/orders/${userId}`);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [dispatch, navigate, userId]);

  return (
    <div className="container text-center mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-success fw-bold">Thank You for Your Order!</h2>
        <p className="mt-3">
          Your order has been successfully placed. We appreciate your trust in
          us!
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
          alt="Thank You"
          width="150"
          className="my-3 d-block mx-auto"
        />

        <p>
          Your order is being processed. You will receive an email confirmation
          shortly.
        </p>

        <p className="text-muted">Redirecting to your orders page...</p>
      </div>
    </div>
  );
};

export default ThankYou;
