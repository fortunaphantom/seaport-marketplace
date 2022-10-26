import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Order, OrderWithCounter } from "@opensea/seaport-js/lib/types";
import { useState } from "react";
import OrderDetailDialog from "./OrderDetailDialog";

interface IOrderListProps {
  orderList: OrderWithCounter[];
}

const OrderList = (props: IOrderListProps) => {
  const { orderList } = props;
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<
    OrderWithCounter | undefined
  >();

  const handleClose = () => {
    setOpen(false);
  };

  const onClickRow = (order: OrderWithCounter) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Offer</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderList.map((order, index) => (
            <TableRow
              hover
              key={order.signature}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() => onClickRow(order)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{order.parameters.offerer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <OrderDetailDialog
        selectedOrder={selectedOrder}
        open={open}
        onClose={handleClose}
      />
    </TableContainer>
  );
};

export default OrderList;
