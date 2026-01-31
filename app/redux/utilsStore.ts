import { configureStore } from '@reduxjs/toolkit';
import confDialogReducer, { ConfDialogState } from './slices/confDialogSlice';
import toastReducer, { ToastType } from './slices/toastSlice';
import loaderReducer, { LoaderSliceState } from './slices/loaderSlice';

export interface UtilsStoreRootState {
  toast: ToastType[];
  confDialog: ConfDialogState;
  loader: LoaderSliceState;
}

// 🔹 singleton store
export const utilsStore = configureStore({
  reducer: {
    toast: toastReducer,
    confDialog: confDialogReducer,
    loader: loaderReducer,
  },
});

// 🔹 typed exports
export type UtilsStoreRootStateType = ReturnType<typeof utilsStore.getState>;
export type UtilsStoreDispatch = typeof utilsStore.dispatch;
