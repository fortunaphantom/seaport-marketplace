import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Order } from "@opensea/seaport-js/lib/types";

interface IOrderListProps {
  orderList: Order[];
}

const OrderList = (props: IOrderListProps) => {
  const { orderList } = props;

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
              key={order.signature}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{index}</TableCell>
              <TableCell align="right">{order.parameters.offerer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderList;
