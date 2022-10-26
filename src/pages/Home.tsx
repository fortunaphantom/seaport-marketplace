import { useEffect, useState } from "react";
import OrderList from "../components/OrderList";
import { OrderWithCounter } from "@opensea/seaport-js/lib/types";
import { Button, Stack } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreateOrder from "../components/CreateOrder";
import { approveToken, createOrderFor721 } from "libs/orders";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "slices/store";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { toast } from "react-toastify";
import { apiPostOrder } from "utils/api";
import { connectWallet } from "slices/web3Slice";
import { getAllOrders } from "slices/orders";
import { setLoading } from "slices/viewState";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const provider = useSelector<RootState, any>((state) => state.web3.provider);
  const orderList = useSelector<RootState, OrderWithCounter[]>(
    (state) => state.orders.orders
  );

  useEffect(() => {
    dispatch(connectWallet());
    dispatch(getAllOrders());
  }, []);

  const onCreateOrder = async (data: any) => {
    if (!provider) {
      toast.error("Please connect wallet");
      return;
    }

    try {
      dispatch(setLoading(true));
      toast.info("Checking approved ...");
      await approveToken(
        provider,
        data.tokenAddress,
        data.tokenId.toString(),
        ItemType.ERC721
      );
      toast.info("Creating order ...");
      const order = await createOrderFor721(
        provider,
        data.tokenAddress,
        data.tokenId.toString(),
        data.price.toString()
      );
      toast.info("Created order");
      await apiPostOrder(order);
      dispatch(getAllOrders());
      dispatch(setLoading(false));
    } catch (e) {
      dispatch(setLoading(false));
    }
  };

  const onRefresh = () => {
    try {
      dispatch(setLoading(true));
      dispatch(getAllOrders()).then(() => {
        dispatch(setLoading(false));
      });
    } catch (e) {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <h2>Order List</h2>
            <Button variant="contained" onClick={() => onRefresh()}>
              <RefreshIcon />
            </Button>
          </Stack>
          <div>
            <OrderList orderList={orderList} />
          </div>
        </Grid>
        <Grid item xs={6}>
          <h2>Create Order</h2>
          <CreateOrder onCreateOrder={onCreateOrder} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
