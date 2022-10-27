import { Seaport } from "@opensea/seaport-js";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { OrderWithCounter } from "@opensea/seaport-js/lib/types";
import { ethers } from "ethers";
import config from "utils/config";
import Web3 from "web3";
import getApprovedAbi from "./getApproved_abi.json";

export async function approveToken(
  provider: any,
  tokenAddress: string,
  tokenId: string,
  itemType: ItemType
) {
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(getApprovedAbi as any, tokenAddress);
  const account = (await web3.eth.getAccounts())?.[0]?.toLowerCase();

  const isApprovedForAll = await contract.methods
    .isApprovedForAll(account, config.SeaportAddress)
    .call();

  if (itemType === ItemType.ERC721) {
    // ERC721
    const approved = await contract.methods.getApproved(tokenId).call();
    console.log({ approved, isApprovedForAll });
    if (
      approved.toLowerCase() !== config.SeaportAddress.toLowerCase() &&
      !isApprovedForAll
    ) {
      try {
        const tx = {
          from: account,
          to: tokenAddress,
          data: contract.methods
            .approve(config.SeaportAddress, tokenId)
            .encodeABI(),
        };

        await web3.eth.sendTransaction(tx);
      } catch (e) {
        console.log(e);
      }
    }
  } else {
    // ERC1155
    if (!isApprovedForAll) {
      try {
        const tx = {
          from: account,
          to: tokenAddress,
          data: contract.methods
            .setApprovalForAll(config.SeaportAddress, true)
            .encodeABI(),
        };

        await web3.eth.sendTransaction(tx);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

export async function createOrderFor721(
  provider: any,
  tokenAddress: string,
  tokenId: string,
  priceInEth: number
) {
  const seaport = new Seaport(new ethers.providers.Web3Provider(provider));
  const web3 = new Web3(provider);
  const account = (await web3.eth.getAccounts())?.[0]?.toLowerCase();
  const { executeAllActions } = await seaport.createOrder(
    {
      offer: [
        {
          itemType: ItemType.ERC721,
          token: tokenAddress,
          identifier: tokenId,
        },
      ],
      consideration: [
        {
          amount: ethers.utils.parseEther(priceInEth.toString()).toString(),
          recipient: account,
        },
      ],
    },
    account
  );

  const order = await executeAllActions();
  return order;
}

export async function createOrderFor1155(
  provider: any,
  tokenAddress: string,
  tokenId: string,
  amount: number,
  priceInEth: number
) {
  const seaport = new Seaport(new ethers.providers.Web3Provider(provider));
  const web3 = new Web3(provider);
  const account = (await web3.eth.getAccounts())?.[0]?.toLowerCase();
  const { executeAllActions } = await seaport.createOrder(
    {
      offer: [
        {
          itemType: ItemType.ERC1155,
          token: tokenAddress,
          identifier: tokenId,
          amount: amount.toString(),
        },
      ],
      consideration: [
        {
          amount: ethers.utils
            .parseEther((priceInEth * amount).toString())
            .toString(),
          recipient: account,
        },
      ],
    },
    account
  );

  const order = await executeAllActions();
  return order;
}

export async function fulfillOrder(provider: any, order: OrderWithCounter) {
  const seaport = new Seaport(new ethers.providers.Web3Provider(provider));
  const web3 = new Web3(provider);
  const account = (await web3.eth.getAccounts())?.[0]?.toLowerCase();
  const { executeAllActions: executeAllFulfillActions } =
    await seaport.fulfillOrder({
      order,
      accountAddress: account,
    });

  const transaction = executeAllFulfillActions();
  return transaction;
}
