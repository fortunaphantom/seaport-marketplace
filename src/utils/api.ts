import { Order, OrderWithCounter } from "@opensea/seaport-js/lib/types";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

export async function apiPostOrder(order: OrderWithCounter) {
  const { data } = await api.post("/", { order });
  return data;
}

export async function apiGetAllOrders() {
  const { data } = await api.get("/");
  return data as OrderWithCounter[];
}

export async function apiDeleteOrder(signature: string) {
  const { data } = await api.delete(`/${signature}`);
  return data;
}

export default api;
