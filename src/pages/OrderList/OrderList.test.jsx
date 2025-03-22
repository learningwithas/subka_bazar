import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import OrderList from "./OrderList";
import { fetchOrders } from "../../App/StoreSlice";

// Create a mock Redux store
const mockStore = configureStore([]);

vi.mock("../../App/StoreSlice", () => ({
  fetchOrders: vi.fn((email) => ({
    type: "store/fetchOrders",
    payload: email,
  })),
}));

describe("OrderList Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      store: {
        orders: [],
        user: { userEmail: "test@example.com" },
        loading: false,
        error: null,
      },
    });

    store.dispatch = vi.fn();
  });

  it("dispatches fetchOrders when mounted", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OrderList />
        </MemoryRouter>
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchOrders("test@example.com")
    );
  });

  it("displays loading state when loading", () => {
    store = mockStore({
      store: {
        orders: [],
        user: { userEmail: "test@example.com" },
        loading: true,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OrderList />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Loading orders...")).toBeInTheDocument();
  });

  it("displays error message when error exists", () => {
    store = mockStore({
      store: {
        orders: [],
        user: { userEmail: "test@example.com" },
        loading: false,
        error: "Failed to load orders",
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OrderList />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Failed to load orders")).toBeInTheDocument();
  });

  it("displays orders when they exist", () => {
    store = mockStore({
      store: {
        orders: [
          {
            _id: "order1",
            date: "2024-02-25T10:00:00Z",
            totalPrice: 100.5,
            status: "Delivered",
          },
        ],
        user: { userEmail: "test@example.com" },
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OrderList />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Order ID: order1")).toBeInTheDocument();
    expect(screen.getByText(/Date:/)).toBeInTheDocument();
    expect(screen.getByText("Total: $100.50")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByText("View Details")).toBeInTheDocument();
  });

  it("displays 'No orders found' when there are no orders", () => {
    store = mockStore({
      store: {
        orders: [],
        user: { userEmail: "test@example.com" },
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <OrderList />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("No orders found.")).toBeInTheDocument();
  });
});
