import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../App/StoreSlice";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderList = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.store.orders);
  const userEmail = useSelector((state) => state.store.user.userEmail);
  const loading = useSelector((state) => state.store.loading);
  const error = useSelector((state) => state.store.error);

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchOrders(userEmail));
    }
  }, [dispatch, userEmail]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h4 className="fw-bold mb-3">My Orders</h4>

      {orders.length > 0 ? (
        <div className="list-group">
          {orders.map((order) => (
            <div
              key={order._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h6>Order ID: {order._id}</h6>
                <p className="mb-1">
                  Date: {new Date(order.date).toLocaleDateString()}
                </p>
                <p className="mb-1">Total: ${order.totalPrice.toFixed(2)}</p>
                <span
                  className={`badge ${
                    order.status === "Delivered" ? "bg-success" : "bg-warning"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <Link
                to={`/orders/${order._id}`}
                className="btn btn-primary btn-sm"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderList;
