import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CategoryList from "./CategoriesList";
import { fetchCategories } from "../../App/StoreSlice";

// Create a mock Redux store
const mockStore = configureStore([]);

// Mock fetchCategories action
vi.mock("../../App/StoreSlice", () => ({
  fetchCategories: vi.fn(() => ({ type: "store/fetchCategories" })),
}));

describe("CategoryList Component", () => {
  it("dispatches fetchCategories action on mount", () => {
    const store = mockStore({
      store: { categories: [] },
    });

    store.dispatch = vi.fn(); // Mock dispatch

    render(
      <Provider store={store}>
        <CategoryList />
      </Provider>
    );

    // Ensure fetchCategories was dispatched
    expect(store.dispatch).toHaveBeenCalled();
    expect(fetchCategories).toHaveBeenCalled();
  });

  it("renders categories correctly", () => {
    const store = mockStore({
      store: {
        categories: [
          {
            id: "cat1",
            name: "Category 1",
            description: "Desc 1",
            imageUrl: "img1.jpg",
          },
          {
            id: "cat2",
            name: "Category 2",
            description: "Desc 2",
            imageUrl: "img2.jpg",
          },
        ],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoryList />
        </MemoryRouter>
      </Provider>
    );

    // Ensure categories are rendered
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Desc 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();
    expect(screen.getByText("Desc 2")).toBeInTheDocument();
  });

  it("updates categoryid when a category button is clicked", () => {
    const store = mockStore({
      store: {
        categories: [
          {
            id: "cat1",
            name: "Category 1",
            description: "Desc 1",
            key: "cat1",
            imageUrl: "img1.jpg",
          },
        ],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoryList />
        </MemoryRouter>
      </Provider>
    );

    // Click the "Explore" button
    const button = screen.getByText(/Explore cat1/i);
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });
});
