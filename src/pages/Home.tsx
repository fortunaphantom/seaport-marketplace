import { useState } from "react";
import OrderList from "../components/OrderList";
import { Order } from "@opensea/seaport-js/lib/types";
import { Button, Stack } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreateOrder from "../components/CreateOrder";
import { approveToken, createOrderFor721 } from "libs/orders";
import { useSelector } from 'react-redux';
import { RootState } from "slices/store";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { toast } from "react-toastify";

const Home = () => {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const provider = useSelector<RootState, any>(state => state.web3.provider);
  
  const onCreateOrder = async (data: any) => {
    if (!provider) {
      toast.error("Please connect wallet");
      return;
    }
    
    console.log(provider);
    toast.info("Checking approved ...");
    await approveToken(provider, data.tokenAddress, data.tokenId.toString(), ItemType.ERC721);
    toast.info("Creating order ...");
    await createOrderFor721(provider, data.tokenAddress, data.tokenId.toString(), data.price.toString());
    toast.info("Created order");
  }

  return (
    <Container>
      <Grid container spacing={6}>
        <Grid item xs={4}>
          <h2>Order List</h2>
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained">
              <RefreshIcon />
            </Button>
          </Stack>
          <div>
            <OrderList orderList={orderList} />
          </div>
        </Grid>
        <Grid item xs={4}>
          <h2>Order Info</h2>
        </Grid>
        <Grid item xs={4}>
          <h2>Create Order</h2>
          <CreateOrder onCreateOrder={onCreateOrder} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
