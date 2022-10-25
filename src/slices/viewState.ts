import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ViewState {
  loading: boolean;
}

const initialState: ViewState = {
  loading: false,
};

export const viewState = createSlice({
  name: "viewState",
  initialState,
  reducers: {
    setLoading: (state: ViewState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder: any) => {},
});

export const { setLoading } = viewState.actions;

export default viewState.reducer;
