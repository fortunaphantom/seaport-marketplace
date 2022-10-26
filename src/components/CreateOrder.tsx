import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Stack } from "@mui/system";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { useState } from "react";
import { toast } from "react-toastify";

interface ICreateOrderProps {
  onCreateOrder?: (data: any) => void;
}

const CreateOrder = (props: ICreateOrderProps) => {
  const { onCreateOrder } = props;
  const [orderData, setOrderData] = useState<any>({});

  const onSubmit = () => {
    // validation
    if (orderData.token?.length !== 42) {
      toast.error("Input correct token address");
      return;
    }

    const tokenId = Number(orderData.token_id);
    if (!(tokenId >= 0)) {
      toast.error("Input correct token id");
      return;
    }

    if (!orderData.token_type) {
      toast.error("select the token type");
      return;
    }

    const tokenAmount = Number(orderData.token_amount);
    if (orderData.token_type === ItemType.ERC1155 && !(tokenAmount >= 0)) {
      toast.error("Input correct token amount");
      return;
    }

    const price = Number(orderData.price);
    if (!(price >= 0)) {
      toast.error("Input correct price");
      return;
    }

    const data = {
      tokenAddress: orderData.token,
      tokenId,
      tokenType: orderData.token_type,
      tokenAmount,
      price,
    };

    onCreateOrder && onCreateOrder(data);
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Token"
        variant="outlined"
        fullWidth
        value={orderData.token || ""}
        onChange={(e) => setOrderData({ ...orderData, token: e.target.value })}
      />
      <TextField
        label="Token Id"
        variant="outlined"
        fullWidth
        value={orderData.token_id || ""}
        onChange={(e) =>
          setOrderData({ ...orderData, token_id: e.target.value })
        }
      />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Token Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          value={orderData.token_type || ""}
          label="Token Type"
          onChange={(e) =>
            setOrderData({ ...orderData, token_type: e.target.value })
          }
        >
          <MenuItem value={ItemType.ERC721}>Non-Fungible</MenuItem>
          <MenuItem value={ItemType.ERC1155}>Semi-Fungible</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Amount"
        variant="outlined"
        fullWidth
        value={orderData.token_amount || ""}
        onChange={(e) =>
          setOrderData({ ...orderData, token_amount: e.target.value })
        }
        disabled={orderData.token_type !== ItemType.ERC1155}
      />
      <TextField
        label="Price"
        variant="outlined"
        fullWidth
        value={orderData.price || ""}
        onChange={(e) => setOrderData({ ...orderData, price: e.target.value })}
      />
      <Button variant="contained" onClick={onSubmit}>
        List for sale
      </Button>
    </Stack>
  );
};

export default CreateOrder;
