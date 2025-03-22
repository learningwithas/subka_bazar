import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { loginUser } from "../../App/StoreSlice";

// Create a mock Redux store
const mockStore = configureStore([]);

vi.mock("../../App/StoreSlice", () => ({
  loginUser: vi.fn((email) => ({ type: "store/loginUser", payload: email })),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      store: { user: { isLoggedIn: false, userEmail: "" } },
    });

    store.dispatch = vi.fn(); // Mock dispatch function
    localStorage.clear(); // Clear localStorage before each test
  });

  it("renders the login form", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    // Instead of getByText, use getByRole to select the button explicitly
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates email and password fields", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("shows an alert if no account is found", () => {
    window.alert = vi.fn(); // Mock alert function

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    // Fill email and password fields
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    // Click the login button (fixing the ambiguous query)
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check for alert message
    expect(window.alert).toHaveBeenCalledWith(
      "No account found. Please sign up first."
    );
  });

  it("logs in successfully with correct credentials", () => {
    window.alert = vi.fn(); // Mock alert function
    localStorage.setItem(
      "signupFormData",
      JSON.stringify({ email: "test@example.com", password: "password123" })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    // Select only the login button to avoid multiple matches
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(window.alert).toHaveBeenCalledWith("Login successful!");
    expect(store.dispatch).toHaveBeenCalledWith(loginUser("test@example.com"));
  });

  it("shows an error for incorrect credentials", () => {
    window.alert = vi.fn(); // Mock alert
    localStorage.setItem(
      "signupFormData",
      JSON.stringify({ email: "test@example.com", password: "password123" })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpass" },
    });

    // Select the correct login button
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "Invalid credentials. Please try again."
    );
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
