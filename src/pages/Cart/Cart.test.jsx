import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Cart from "./Cart";
import { addToCart, removeFromCart, clearCart } from "../../App/StoreSlice";

const mockStore = configureStore([]);
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Cart Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      store: {
        cart: [
          {
            id: 1,
            name: "Product 1",
            price: 100,
            quantity: 1,
            imageURL: "image1.jpg",
          },
        ],
        user: {
          isLoggedIn: true,
          userEmail: "test@example.com",
        },
      },
    });

    store.dispatch = vi.fn();
    localStorage.clear();

    // Mock window.alert to prevent JSDOM errors
    vi.spyOn(window, "alert").mockImplementation(() => {});

    // Mock window.scrollTo (for Product tests)
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  it("renders cart items correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("$100 x 1 = $100")).toBeInTheDocument();
  });

  it("increases product quantity when '+' button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );

    const increaseButton = screen.getByText("+");
    fireEvent.click(increaseButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      addToCart(store.getState().store.cart[0])
    );
  });

  it("decreases product quantity when '-' button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );

    const decreaseButton = screen.getByText("-");
    fireEvent.click(decreaseButton);

    expect(store.dispatch).toHaveBeenCalledWith(removeFromCart(1));
  });

  it("prevents checkout when user is not logged in", () => {
    store = mockStore({
      store: {
        cart: [{ id: 1, price: 100, quantity: 1 }],
        user: { isLoggedIn: false },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );

    const checkoutButton = screen.getByText(/Proceed to Checkout/i);
    fireEvent.click(checkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("prevents checkout when cart is empty", () => {
    store = mockStore({ store: { cart: [], user: { isLoggedIn: true } } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );

    const checkoutButton = screen.queryByText(/Proceed to Checkout/i);
    expect(checkoutButton).not.toBeInTheDocument();
  });

  it("clears the cart when 'Clear Cart' button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );

    const clearCartButton = screen.getByText(/Clear Cart/i);
    fireEvent.click(clearCartButton);

    expect(store.dispatch).toHaveBeenCalledWith(clearCart());
  });

  it("processes checkout successfully", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      </Provider>
    );

    const checkoutButton = screen.getByText(/Proceed to Checkout/i);
    fireEvent.click(checkoutButton);

    const orders = JSON.parse(localStorage.getItem("orders_test@example.com"));
    expect(orders).toHaveLength(1);
    expect(orders[0]).toMatchObject({ status: "Processing" });
    expect(store.dispatch).toHaveBeenCalledWith(clearCart());
    expect(mockNavigate).toHaveBeenCalledWith("/thankyou");
  });
});
