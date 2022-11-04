import { Seaport } from "@opensea/seaport-js";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import {
  ConsiderationInputItem,
  CreateInputItem,
  Fee,
  OrderWithCounter,
} from "@opensea/seaport-js/lib/types";
import { BigNumber, ethers } from "ethers";
import config from "utils/config";
import Web3 from "web3";
import ERC721ABI from "./erc721_abi.json";
import ERC1155ABI from "./erc1155_abi.json";

export async function approveToken(
  provider: any,
  tokenAddress: string,
  tokenId: string,
  itemType: ItemType
) {
  const web3 = new Web3(provider);
  const account = (await web3.eth.getAccounts())?.[0]?.toLowerCase();

  try {
    if (itemType === ItemType.ERC721) {
      // ERC721

      const contract = new web3.eth.Contract(ERC721ABI as any, tokenAddress);
      const isApprovedForAll = await contract.methods
        .isApprovedForAll(account, config.SeaportAddress)
        .call();
      const approved = await contract.methods.getApproved(tokenId).call();
      if (
        approved.toLowerCase() !== config.SeaportAddress.toLowerCase() &&
        !isApprovedForAll
      ) {
        const tx = {
          from: account,
          to: tokenAddress,
          data: contract.methods
            .approve(config.SeaportAddress, tokenId)
            .encodeABI(),
        };

        await web3.eth.sendTransaction(tx);
      }
    } else {
      // ERC1155

      const contract = new web3.eth.Contract(ERC1155ABI as any, tokenAddress);
      const isApprovedForAll = await contract.methods
        .isApprovedForAll(account, config.SeaportAddress)
        .call();

      if (!isApprovedForAll) {
        const tx = {
          from: account,
          to: tokenAddress,
          data: contract.methods
            .setApprovalForAll(config.SeaportAddress, true)
            .encodeABI(),
        };

        await web3.eth.sendTransaction(tx);
      }
    }

    return true;
  } catch (e) {
    console.log(e);

    return false;
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

export async function createOrder(
  provider: any,
  selectedAssets: IAssetInfo[],
  priceInEth: number,
  fees: Fee[] | undefined = undefined
) {
  const seaport = new Seaport(new ethers.providers.Web3Provider(provider));
  const web3 = new Web3(provider);
  const account = (await web3.eth.getAccounts())?.[0]?.toLowerCase();

  const offerItems: CreateInputItem[] = [];
  for (let i = 0; i < selectedAssets.length; i++) {
    if (selectedAssets[i].collectionInfo.collectionType) {
      offerItems.push({
        itemType: ItemType.ERC1155,
        token: selectedAssets[i].collectionInfo.address,
        identifier: selectedAssets[i].asset.tokenId,
        amount: "1",
      });
    } else {
      offerItems.push({
        itemType: ItemType.ERC721,
        token: selectedAssets[i].collectionInfo.address,
        identifier: selectedAssets[i].asset.tokenId,
      });
    }
  }

  // set fees
  const totalAmount = ethers.utils.parseEther(priceInEth.toString());
  let restAmount = totalAmount;
  const consideration: ConsiderationInputItem[] = fees?.map(fee => {
    const amount = totalAmount.mul(BigNumber.from(fee.basisPoints * 10000)).div(100000000);
    restAmount = restAmount.sub(amount);
    return {
      amount: amount.toString(),
      recipient: fee.recipient
    };
  }) || [];

  const startTime = Math.round((new Date()).getTime() / 1000);
  const endTime = startTime + 86400 * 30;

  const { executeAllActions } = await seaport.createOrder(
    {
      offer: offerItems,
      consideration: [
        {
          amount: restAmount.toString(),
          recipient: account,
        },
        ...consideration
      ],
      startTime: startTime.toString(),
      endTime: endTime.toString()
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
