import type { NextPage } from "next";
import { useState } from "react";
import OrderList from "../componenets/OrderList";
import { Order } from "@opensea/seaport-js/lib/types";

const Home: NextPage = () => {
  const [orderList, setOrderList] = useState<Order[]>([]);

  return (
    <div className="container flex flex-row p-3">
      <div>
        <div>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Reload
          </button>
        </div>
        <div>
          <OrderList orderList={orderList} />
        </div>
      </div>
    </div>
  );
};

export default Home;
