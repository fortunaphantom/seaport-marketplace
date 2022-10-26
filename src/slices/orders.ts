import { Order, OrderWithCounter } from "@opensea/seaport-js/lib/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiGetAllOrders } from "utils/api";

const initialState = {
  orders: [] as OrderWithCounter[],
};

export const getAllOrders = createAsyncThunk("getAllOrders", async () => {
  const orders = await apiGetAllOrders();
  return orders;
});

export const ordersSlice = createSlice({
  name: "orders",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getAllOrders.fulfilled,
      (state: any, action: PayloadAction<OrderWithCounter[]>) => {
        state.orders = action.payload;
      }
    );
  },
});

export default ordersSlice.reducer;
