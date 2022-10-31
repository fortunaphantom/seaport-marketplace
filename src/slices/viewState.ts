import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  selectedAssets: {} as { [key: string]: boolean },
};

export const viewState = createSlice({
  name: "viewState",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAssetSelected: (state, action: PayloadAction<any>) => {
      const { assetAddress, value } = action.payload;
      state.selectedAssets[assetAddress] = value;
    },
  },
  extraReducers: (builder: any) => {},
});

export const { setLoading, setAssetSelected } = viewState.actions;

export default viewState.reducer;
