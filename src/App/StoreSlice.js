import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch data asynchronously
export const fetchProducts = createAsyncThunk(
  "store/fetchProducts",
  async () => {
    const response = await fetch("/products/index.get.json");
    return response.json();
  }
);

export const fetchCategories = createAsyncThunk(
  "store/fetchCategories",
  async () => {
    const response = await fetch("/categories/index.get.json");
    return response.json();
  }
);

export const fetchBanners = createAsyncThunk("store/fetchBanners", async () => {
  const response = await fetch("/banners/index.get.json");
  return response.json();
});

export const fetchOrders = createAsyncThunk(
  "store/fetchOrders",
  async (userEmail) => {
    const orders =
      JSON.parse(localStorage.getItem(`orders_${userEmail}`)) || [];
    return orders;
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState: {
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
  },
  reducers: {
    setShowProduct: (state, action) => {
      state.showProduct = action.payload;
    },
    addToCart: (state, action) => {
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart
        .map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    registerUser: (state, action) => {
      state.user.userData = action.payload;
      state.user.isLoggedIn = true;
      state.user.userEmail = action.payload.email;

      localStorage.setItem("signupFormData", JSON.stringify(action.payload));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", action.payload.email);
    },
    loginUser: (state, action) => {
      state.user.isLoggedIn = true;
      state.user.userEmail = action.payload;
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", action.payload);
    },
    logoutUser: (state) => {
      state.user.isLoggedIn = false;
      state.user.userEmail = "";
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.banners = action.payload;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export const {
  setShowProduct,
  addToCart,
  removeFromCart,
  clearCart,
  setOrders,
  registerUser,
  loginUser,
  logoutUser,
} = storeSlice.actions;
export default storeSlice.reducer;
