import { configureStore } from "@reduxjs/toolkit";

import StoreReducer from "./StoreSlice";

export const store = configureStore({
  reducer: {
    store: StoreReducer,
  },
});
