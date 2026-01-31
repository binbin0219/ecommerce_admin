import { createSlice } from '@reduxjs/toolkit';

export type LoaderSliceState = {
    isLoading: boolean,
}

const initialState: LoaderSliceState = {
    isLoading: false,
};

const loaderSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        showLoader: (state) => {
            state.isLoading = true;
        },
        hideLoader: (state) => {
            state.isLoading = false;
        },
    },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
