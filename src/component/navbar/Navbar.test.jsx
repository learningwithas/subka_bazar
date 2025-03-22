import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { setShowProduct, logoutUser } from "../../App/StoreSlice";
import { vi } from "vitest";

// Create mock Redux store
const mockStore = configureStore([]);

vi.mock("../../App/StoreSlice", () => ({
  setShowProduct: vi.fn((payload) => ({
    type: "store/setShowProduct",
    payload,
  })),
  logoutUser: vi.fn(() => ({ type: "store/logoutUser" })),
}));

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Navbar Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      store: {
        cart: [{ id: 1 }, { id: 2 }], // Two items in cart
        user: { isLoggedIn: true, userEmail: "test@example.com" },
      },
    });

    store.dispatch = vi.fn(); // Mock dispatch function
  });

  it("renders the Navbar with logo and links", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByAltText("Sabka Bazaar")).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Products/i)).toBeInTheDocument();
  });

  it("shows user initials and logout button when logged in", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("T")).toBeInTheDocument(); // First letter of email "test@example.com"
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it("shows Signup and Login links when user is not logged in", () => {
    store = mockStore({ store: { cart: [], user: { isLoggedIn: false } } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Signup/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("dispatches setShowProduct action when clicking on Products", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText(/Products/i));
    expect(store.dispatch).toHaveBeenCalledWith(setShowProduct("all"));
  });

  it("dispatches logoutUser action when clicking logout button", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText(/Logout/i));
    expect(store.dispatch).toHaveBeenCalledWith(logoutUser());
  });

  it("navigates to cart page when cart button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /cart/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });

  it("shows correct cart badge count", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("2")).toBeInTheDocument(); // Cart has 2 items
  });

  it("toggles mobile menu when hamburger is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );

    // Find the hamburger menu button
    const menuButton = screen.getByTestId("hamburger-menu");

    // Click the hamburger button
    fireEvent.click(menuButton);

    // Check if mobile menu appears
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });
});
