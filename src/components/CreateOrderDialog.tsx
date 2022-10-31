import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { approveToken, createOrder } from "libs/seaport";
import { AppDispatch, RootState } from "slices/store";
import { useSelector, useDispatch } from "react-redux";
import { apiPostOrder } from "utils/api";
import { setLoading } from "slices/viewState";
import { useState } from "react";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { getAllOrders } from "slices/orders";
import { toast } from "react-toastify";

export interface ICreateOrderDialogProps {
  open: boolean;
  selectedAssets: IAssetInfo[];
  onClose: () => void;
}

function CreateOrderDialog(props: ICreateOrderDialogProps) {
  const { onClose, selectedAssets, open } = props;
  const provider = useSelector<RootState, any>((state) => state.web3.provider);
  const dispatch = useDispatch<AppDispatch>();
  const [price, setPrice] = useState<string>("");

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async () => {
    try {
      dispatch(setLoading(true));
      toast.info("Checking approved ...");
      for (let i = 0; i < selectedAssets.length; i++) {
        const collectionInfo = selectedAssets[i]
          .collectionInfo as ICollectionInfo;
        const asset = selectedAssets[i].asset as IAsset;

        await approveToken(
          provider,
          collectionInfo.address,
          asset.tokenId,
          collectionInfo.collectionType ? ItemType.ERC1155 : ItemType.ERC721
        );
      }

      toast.info("Creating order ...");
      const order = await createOrder(provider, selectedAssets, Number(price));

      toast.info("Created order");
      await apiPostOrder(order);
      dispatch(getAllOrders());
      dispatch(setLoading(false));
    } catch (ex) {
      console.error(ex);
      dispatch(setLoading(false));
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box padding={2}>
        <Typography variant="h5">Assets</Typography>
        <ul style={{ listStyle: "none", padding: "0", margin: "6px 0 10px 0" }}>
          {selectedAssets.map((asset) => (
            <li key={asset.collectionInfo.address + "_" + asset.asset.tokenId}>
              {asset.collectionInfo.name} - {asset.asset.name}
            </li>
          ))}
        </ul>
        <Stack sx={{ margin: "10px 0 0 0" }} spacing={1}>
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={onSubmit}>
            Create Order
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}

export default CreateOrderDialog;
