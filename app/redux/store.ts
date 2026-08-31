import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import sellerReducer from "./slices/sellerSlice";

const sellerPersistConfig = {
  key: "seller",
  storage,
};

const persistedSellerReducer = persistReducer(
  sellerPersistConfig,
  sellerReducer
);

export const store = configureStore({
  reducer: {
    seller: persistedSellerReducer, // ✅ persisted
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// ✅ TYPES
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
