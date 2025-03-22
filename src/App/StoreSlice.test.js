import storeReducer, {
  setShowProduct,
  addToCart,
  removeFromCart,
  clearCart,
  setOrders,
  registerUser,
  loginUser,
  logoutUser,
  fetchProducts,
  fetchCategories,
  fetchOrders,
} from "./StoreSlice";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";

// Mock localStorage
vi.spyOn(Storage.prototype, "setItem");
vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
  if (key === "isLoggedIn") return "true";
  if (key === "userEmail") return "test@example.com";
  if (key.startsWith("orders_"))
    return JSON.stringify([{ id: "123", status: "Processing" }]);
  return null;
});
vi.spyOn(Storage.prototype, "removeItem");

describe("StoreSlice Reducers", () => {
  let initialState;

  beforeEach(() => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", "test@example.com");

    initialState = {
      products: [],
      categories: [],
      showProduct: "all",
      banners: [],
      cart: [],
      orders: [],
      user: {
        isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
        userEmail: localStorage.getItem("userEmail") || "",
        userData: JSON.parse(localStorage.getItem("signupFormData")) || null,
      },
    };
  });

  it("should handle setShowProduct", () => {
    const newState = storeReducer(initialState, setShowProduct("electronics"));
    expect(newState.showProduct).toBe("electronics");
  });

  it("should handle addToCart", () => {
    const product = { id: 1, name: "Item 1", price: 100 };
    const newState = storeReducer(initialState, addToCart(product));
    expect(newState.cart).toHaveLength(1);
    expect(newState.cart[0]).toMatchObject({ ...product, quantity: 1 });
  });

  it("should increase quantity when adding same product again", () => {
    const product = { id: 1, name: "Item 1", price: 100 };
    let newState = storeReducer(initialState, addToCart(product));
    newState = storeReducer(newState, addToCart(product));
    expect(newState.cart[0].quantity).toBe(2);
  });

  it("should handle removeFromCart", () => {
    const product = { id: 1, name: "Item 1", price: 100, quantity: 2 };
    let newState = { ...initialState, cart: [product] };
    newState = storeReducer(newState, removeFromCart(1));
    expect(newState.cart[0].quantity).toBe(1);
  });

  it("should remove product from cart if quantity is 0", () => {
    const product = { id: 1, name: "Item 1", price: 100, quantity: 1 };
    let newState = { ...initialState, cart: [product] };
    newState = storeReducer(newState, removeFromCart(1));
    expect(newState.cart).toHaveLength(0);
  });

  it("should clear cart", () => {
    const product = { id: 1, name: "Item 1", price: 100 };
    let newState = { ...initialState, cart: [product] };
    newState = storeReducer(newState, clearCart());
    expect(newState.cart).toHaveLength(0);
  });

  it("should handle setOrders", () => {
    const orders = [{ id: "101", status: "Shipped" }];
    const newState = storeReducer(initialState, setOrders(orders));
    expect(newState.orders).toHaveLength(1);
    expect(newState.orders[0].status).toBe("Shipped");
  });

  it("should handle registerUser", () => {
    const userData = { email: "test@example.com", name: "Test User" };
    const newState = storeReducer(initialState, registerUser(userData));
    expect(newState.user).toMatchObject({
      isLoggedIn: true,
      userEmail: "test@example.com",
      userData,
    });
  });

  it("should handle loginUser", () => {
    const newState = storeReducer(initialState, loginUser("user@test.com"));
    expect(newState.user).toMatchObject({
      isLoggedIn: true,
      userEmail: "user@test.com",
    });
  });

  it("should handle logoutUser and clear localStorage", () => {
    const newState = storeReducer(initialState, logoutUser());
    expect(newState.user).toMatchObject({
      isLoggedIn: false,
      userEmail: "",
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith("isLoggedIn");
    expect(localStorage.removeItem).toHaveBeenCalledWith("userEmail");
  });
});

describe("StoreSlice Async Thunks", () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: storeReducer });
  });

  it("should handle fetchProducts", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, name: "Test Product" }]),
      })
    );

    await store.dispatch(fetchProducts());
    const state = store.getState();
    expect(state.products).toHaveLength(1);
    expect(state.products[0].name).toBe("Test Product");
  });

  it("should handle fetchCategories", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, name: "Electronics" }]),
      })
    );

    await store.dispatch(fetchCategories());
    const state = store.getState();
    expect(state.categories).toHaveLength(1);
    expect(state.categories[0].name).toBe("Electronics");
  });

  it("should handle fetchOrders with existing data", async () => {
    localStorage.setItem(
      "orders_test@example.com",
      JSON.stringify([{ id: "123", status: "Processing" }])
    );

    await store.dispatch(fetchOrders("test@example.com"));
    const state = store.getState();
    expect(state.orders).toHaveLength(1);
    expect(state.orders[0].status).toBe("Processing");
  });
});
