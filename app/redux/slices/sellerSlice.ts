import { Seller } from '@/lib/models/Seller';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from "../store";

const initialState = null as Seller | null;

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setSeller: (_state, action: PayloadAction<Seller | null>) => {
        console.log('set seller ! ', action.payload)
      return action.payload;
    },
    clearSeller: () => null,
  },
});

export const selectSeller = (state: RootState): Seller | null => {
  if (!state.seller) return null;

  // Destructure _persist to ignore it
  const { _persist, ...data } = state.seller;

  // If the slice was empty/null, return null
  const hasData = Object.keys(data).length > 0;
  return hasData ? (data as Seller) : null;
};

export const { setSeller, clearSeller } = sellerSlice.actions;
export default sellerSlice.reducer;