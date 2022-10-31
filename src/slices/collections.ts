import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiGetAllCollections } from "utils/api";

const initialState = {
  collections: [] as ICollection[],
};

export const getAllCollections = createAsyncThunk("getAllCollections", async () => {
  const collections = await apiGetAllCollections();
  return collections;
});

export const collectionSlice = createSlice({
  name: "collections",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getAllCollections.fulfilled,
      (state: any, action: PayloadAction<ICollection[]>) => {
        state.collections = action.payload;
      }
    );
  },
});

export default collectionSlice.reducer;
