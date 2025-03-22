import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "../../App/StoreSlice";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const cart = useSelector((state) => state.store.cart);
  const user = useSelector((state) => state.store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Increase quantity
  const increaseQuantity = (product) => {
    dispatch(addToCart(product));
  };

  // Decrease quantity or remove item if quantity is 1
  const decreaseQuantity = (productId) => {
    dispatch(removeFromCart(productId));
  };

  // Handle checkout button
  const handleCheckout = () => {
    if (!user.isLoggedIn) {
      alert("You must be logged in to proceed to checkout.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) return;

    const newOrder = {
      _id: Date.now().toString(),
      date: new Date().toISOString(),
      totalPrice: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      status: "Processing",
      items: cart,
      userId: user.userEmail,
    };

    // Retrieve existing orders from localStorage
    const storedOrders =
      JSON.parse(localStorage.getItem(`orders_${user.userEmail}`)) || [];

    // Save updated order list in localStorage
    localStorage.setItem(
      `orders_${user.userEmail}`,
      JSON.stringify([...storedOrders, newOrder])
    );

    // Clear cart after checkout
    dispatch(clearCart());

    navigate("/thankyou");
  };

  return (
    <div className="container my-4">
      <h5 className="fw-bold">
        My Cart ({cart.length} item{cart.length !== 1 ? "s" : ""})
      </h5>

      {cart.length > 0 ? (
        <>
          {cart.map((product) => (
            <div className="card p-3 shadow-sm mb-3" key={product.id}>
              <div className="d-flex align-items-center">
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className="rounded me-3"
                  width="60"
                />

                <div className="flex-grow-1">
                  <h6 className="mb-1">{product.name}</h6>
                  <p className="mb-0">
                    ${product.price} x {product.quantity} = $
                    {product.price * product.quantity}
                  </p>
                </div>

                {/* Quantity Control Buttons */}
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => decreaseQuantity(product.id)}
                  >
                    -
                  </button>
                  <span className="mx-2">{product.quantity}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => increaseQuantity(product)}
                  >
                    +
                  </button>
                </div>

                {/* Delete Item */}
                <button
                  className="btn btn-outline-danger btn-sm ms-3"
                  onClick={() => decreaseQuantity(product.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          {/* Clear Cart Button */}
          <div className="text-end mt-3">
            <button
              className="btn btn-danger fw-bold px-4 me-2"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
            {/* Proceed to Checkout Button */}
            <button
              className="btn btn-primary fw-bold px-4"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
