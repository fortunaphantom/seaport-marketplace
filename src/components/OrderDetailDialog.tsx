import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, Stack } from "@mui/material";
import { Order, OrderWithCounter } from "@opensea/seaport-js/lib/types";
import { fulfillOrder } from "libs/seaport";
import { AppDispatch, RootState } from "slices/store";
import { useSelector, useDispatch } from "react-redux";
import { apiDeleteOrder } from "utils/api";
import { setLoading } from "slices/viewState";
import { getAllOrders } from "slices/orders";

export interface IOrderDetailDialogProps {
  open: boolean;
  selectedOrder?: OrderWithCounter;
  onClose: () => void;
}

function OrderDetailDialog(props: IOrderDetailDialogProps) {
  const { onClose, selectedOrder, open } = props;
  const provider = useSelector<RootState, any>((state) => state.web3.provider);
  const dispatch = useDispatch<AppDispatch>();

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async () => {
    if (selectedOrder) {
      try {
        dispatch(setLoading(true));
        await fulfillOrder(provider, selectedOrder);
        await apiDeleteOrder(selectedOrder.signature);
        await dispatch(getAllOrders());
        dispatch(setLoading(false));
      } catch (e) {
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Order Detail</DialogTitle>
      <Box padding={2} sx={{ paddingTop: "0px" }}>
        <Box>
          <pre>{JSON.stringify(selectedOrder, null, 2)}</pre>
        </Box>
        <Stack>
          <Button variant="contained" onClick={onSubmit}>
            Fulfill Order
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}

export default OrderDetailDialog;
