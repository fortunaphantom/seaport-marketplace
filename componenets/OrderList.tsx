import { Order } from "@opensea/seaport-js/lib/types";

interface IOrderListProps {
  orderList: Order[];
}

const OrderList = (props: IOrderListProps) => {
  const { orderList } = props;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Offerer</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order, index) => (
            <tr key={order.signature}>
              <th>{index}</th>
              <td>{order.parameters.offerer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
