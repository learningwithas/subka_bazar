import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Products from "./Products"; // Adjust path based on file location
import {
  addToCart,
  removeFromCart,
  setShowProduct,
} from "../../App/StoreSlice";

// Mock store
const mockStore = configureStore([]);
const store = mockStore({
  store: {
    products: [
      {
        id: 1,
        name: "Product 1",
        price: 100,
        category: "cat1",
        imageURL: "img1.jpg",
      },
      {
        id: 2,
        name: "Product 2",
        price: 200,
        category: "cat2",
        imageURL: "img2.jpg",
      },
    ],
    categories: [{ _id: "cat1", id: "cat1", name: "Category 1" }],
    showProduct: "all",
    cart: [],
  },
});

store.dispatch = vi.fn();

describe("Products Component", () => {
  it("renders category links", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Products />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Category 1")).toBeInTheDocument();
  });

  it("renders products", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Products />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
  });

  it("dispatches setShowProduct action when category is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Products />
        </MemoryRouter>
      </Provider>
    );

    const categoryLink = screen.getByText("Category 1");
    fireEvent.click(categoryLink);

    expect(store.dispatch).toHaveBeenCalledWith(setShowProduct("cat1"));
  });

  it("dispatches addToCart when plus button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Products />
        </MemoryRouter>
      </Provider>
    );

    const plusButton = screen.getAllByRole("button", {
      name: /increase quantity/i,
    })[0];
    fireEvent.click(plusButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      addToCart({
        id: 1,
        name: "Product 1",
        price: 100,
        category: "cat1",
        imageURL: "img1.jpg",
      })
    );
  });

  it("dispatches removeFromCart when minus button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Products />
        </MemoryRouter>
      </Provider>
    );

    const minusButton = screen.getAllByRole("button", {
      name: /decrease quantity/i,
    })[0];
    fireEvent.click(minusButton);

    expect(store.dispatch).toHaveBeenCalledWith(removeFromCart(1));
  });
});
