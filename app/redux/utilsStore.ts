import { configureStore } from '@reduxjs/toolkit';
import confDialogReducer, { ConfDialogState } from './slices/confDialogSlice'
import toastReducer, { ToastType } from './slices/toastSlice';
import loaderReducer, { LoaderSliceState } from './slices/loaderSlice';

export interface UtilsStoreRootState {
    toast: ToastType[];
    confDialog: ConfDialogState;
    loader: LoaderSliceState;
}

export function createUtilsStore() {
    return configureStore({
        reducer: {
            toast: toastReducer,
            confDialog: confDialogReducer,
            loader: loaderReducer
        },
    });
}
