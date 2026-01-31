import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import postReducer from "./slices/postSlice";
import userReducer from "./slices/userSlice";
import sellerReducer from "./slices/sellerSlice";
import chatReducer from "./slices/chatSlice";
import currentUserReducer from "./slices/currentUserSlice";
import notificationReducer from "./slices/notificationSlice";

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
    post: postReducer,
    user: userReducer,
    seller: persistedSellerReducer, // ✅ persisted
    currentUser: currentUserReducer,
    notifications: notificationReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// ✅ TYPES (NOW THIS WORKS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;