import { configureStore } from "@reduxjs/toolkit";
import web3Reducer from "./web3Slice";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import viewState from "./viewState";
import orders from "./orders";
import collections from "./collections";

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const store = configureStore({
  reducer: {
    web3: web3Reducer,
    viewState: viewState,
    orders: orders,
    collections,
  },
  middleware: customizedMiddleware,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
