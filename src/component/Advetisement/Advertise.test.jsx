import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { vi } from "vitest";
import Advertise from "./Advertise";
import { fetchBanners } from "../../App/StoreSlice";

// Create a mock Redux store without middleware
const mockStore = configureStore([]);

// Mock `fetchBanners` to return a plain object action (not async)
vi.mock("../../App/StoreSlice", () => ({
  fetchBanners: vi.fn(() => ({ type: "store/fetchBanners" })),
}));

describe("Advertise Component", () => {
  it("dispatches fetchBanners action on mount", () => {
    const store = mockStore({
      store: { banners: [] },
    });

    store.dispatch = vi.fn(); // Mock dispatch function

    render(
      <Provider store={store}>
        <Advertise />
      </Provider>
    );

    // Ensure fetchBanners was dispatched
    expect(store.dispatch).toHaveBeenCalled();
    expect(fetchBanners).toHaveBeenCalled();
  });

  it("renders an advertisement image if banners exist", () => {
    const store = mockStore({
      store: {
        banners: [{ bannerImageUrl: "https://example.com/banner.jpg" }],
      },
    });

    render(
      <Provider store={store}>
        <Advertise />
      </Provider>
    );

    // Ensure image is displayed
    const imgElement = screen.getByRole("img", { name: "Advertisement" });
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", "https://example.com/banner.jpg");
  });

  it("does not render an image when there are no banners", () => {
    const store = mockStore({
      store: { banners: [] },
    });

    render(
      <Provider store={store}>
        <Advertise />
      </Provider>
    );

    // Ensure no image is displayed
    const imgElement = screen.queryByRole("img");
    expect(imgElement).not.toBeInTheDocument();
  });
});
