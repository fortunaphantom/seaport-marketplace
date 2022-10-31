import { useState, useEffect } from "react";
import OrderList from "../components/OrderList";
import { OrderWithCounter } from "@opensea/seaport-js/lib/types";
import { Button, Stack } from "@mui/material";
import { Box, Grid } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "slices/store";
import { connectWallet } from "slices/web3Slice";
import { getAllOrders } from "slices/orders";
import { setLoading } from "slices/viewState";
import CollectionAccordion from "components/CollectionAccordion";
import { getAllCollections } from "slices/collections";
import CreateOrderDialog from "components/CreateOrderDialog";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orderList = useSelector<RootState, OrderWithCounter[]>(
    (state) => state.orders.orders
  );
  const collections = useSelector<RootState, ICollection[]>(
    (state) => state.collections.collections
  );
  const selectedAssets = useSelector<RootState, { [key: string]: boolean }>(
    (state) => state.viewState.selectedAssets
  );
  const [selectedAssetList, setSelectedAssetList] = useState<IAssetInfo[]>([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(connectWallet());
    dispatch(getAllOrders());
    dispatch(getAllCollections());
  }, []);

  useEffect(() => {
    const _selectedAssetList = [];
    for (let assetAddress in selectedAssets) {
      if (!selectedAssets[assetAddress]) {
        continue;
      }

      const temp = assetAddress.split("_");
      const collection = collections.find(
        (c) => c.collectionInfo.address.toLowerCase() === temp[0].toLowerCase()
      );
      const asset = collection?.assets.find((a) => a.tokenId === temp[1]);
      _selectedAssetList.push({
        collectionInfo: collection?.collectionInfo as ICollectionInfo,
        asset: asset as IAsset,
      });
    }

    setSelectedAssetList(_selectedAssetList);
  }, [selectedAssets, collections]);

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

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box padding={3}>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <h2>Collections</h2>
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              disabled={
                !Object.entries(selectedAssets).filter((e) => e[1]).length
              }
            >
              Create Order (
              {Object.entries(selectedAssets).filter((e) => e[1]).length})
            </Button>
          </Stack>
          <div>
            {collections.map((collection) => (
              <CollectionAccordion collection={collection} />
            ))}
          </div>
        </Grid>
        <Grid item xs={4}>
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
      </Grid>
      <CreateOrderDialog
        open={open}
        onClose={handleClose}
        selectedAssets={selectedAssetList}
      />
    </Box>
  );
};

export default Home;
