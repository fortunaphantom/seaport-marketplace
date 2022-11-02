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
import Web3 from "web3";
import { createOpenseaOrder, listOpenseaOrder } from "libs/opensea";

export interface ICreateOrderDialogProps {
  open: boolean;
  selectedAssets: IAssetInfo[];
  onClose: () => void;
}

function CreateOrderDialog(props: ICreateOrderDialogProps) {
  const { onClose, selectedAssets, open } = props;
  const provider = useSelector<RootState, any>((state) => state.web3.provider);
  const dispatch = useDispatch<AppDispatch>();
  const [prices, setPrices] = useState<string[]>([]);

  const handleClose = () => {
    onClose();
  };

  const onPrice = (index: number, value: string) => {
    const newPrices = [...prices];
    newPrices[index] = value;
    setPrices(newPrices);
  }

  const onSubmit = async () => {
    try {
      const web3 = new Web3(provider);
      const chainId = await web3.eth.getChainId();
      if (chainId !== 5) {
        toast.error("You should select Goerli chain");
        return;
      }

      dispatch(setLoading(true));
      for (let i = 0; i < selectedAssets.length; i++) {
        const collectionInfo = selectedAssets[i]
          .collectionInfo as ICollectionInfo;
        const asset = selectedAssets[i].asset as IAsset;
        const assetCaption = getAssetCaption(selectedAssets[i]);

        toast.info(`Approving [${assetCaption}] ...`);
        const res = await approveToken(
          provider,
          collectionInfo.address,
          asset.tokenId,
          collectionInfo.collectionType ? ItemType.ERC1155 : ItemType.ERC721
        );

        if (!res) {
          toast.error(`You did not approve the token [${assetCaption}]`);
          continue;
        }

        // Creating Rinzo order
        toast.info(`Creating Rinzo order [${assetCaption}]`);
        const order1 = await createOrder(
          provider,
          [selectedAssets[i]],
          Number(prices[i])
        );
        await apiPostOrder(order1);
        console.log("Rinzo", assetCaption, JSON.stringify(order1));

        // Creating Opensea order
        toast.info(`Creating Opensea order [${assetCaption}]`);
        const order2 = await createOpenseaOrder(
          provider,
          [selectedAssets[i]],
          Number(prices[i])
        );
        await apiPostOrder(order2);
        console.log("Opensea", assetCaption, JSON.stringify(order2));
        console.log(JSON.stringify(order2));

        // Listing order to opensea
        toast.info(`Listing Opensea order [${assetCaption}]`);
        await listOpenseaOrder(order2);

      }

      dispatch(getAllOrders());
      dispatch(setLoading(false));
      
      toast.info("Created order");
      dispatch(getAllOrders());
      dispatch(setLoading(false));
      handleClose();
    } catch (ex) {
      console.error(ex);
      dispatch(setLoading(false));
    }
  };

  const getAssetCaption = (asset: IAssetInfo) => (asset.collectionInfo.address + "_" + asset.asset.tokenId)

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box padding={3}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Assets for sale
        </Typography>
        <ul style={{ listStyle: "none", padding: "0", margin: "6px 0 10px 0" }}>
          {selectedAssets.map((asset, index) => (
            <li
              key={getAssetCaption(asset)}
              style={{
                margin: "0 0 8px 0",
                padding: "0 0 12px 0",
                borderBottom: "1px solid #ccc",
              }}
            >
              <Typography sx={{margin: "0 0 6px 0"}}>
                {getAssetCaption(asset)}
              </Typography>
              <TextField
                label="Price in ETH"
                variant="outlined"
                fullWidth
                value={prices[index] || ""}
                onChange={(e) => onPrice(index, e.target.value)}
                size="small"
              />
            </li>
          ))}
        </ul>
        <Stack sx={{ margin: "10px 0 0 0" }} spacing={1}>
          <Button variant="contained" onClick={onSubmit}>
            Create Order
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}

export default CreateOrderDialog;
