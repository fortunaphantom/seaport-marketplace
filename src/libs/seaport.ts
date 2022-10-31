import { Seaport } from "@opensea/seaport-js";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import {
  CreateInputItem,
  OrderWithCounter,
} from "@opensea/seaport-js/lib/types";
import { ethers } from "ethers";
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
  priceInEth: number
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

  const { executeAllActions } = await seaport.createOrder(
    {
      offer: offerItems,
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

export async function fulfillOrder(provider: any, order: OrderWithCounter) {
  const seaport = new Seaport(new ethers.providers.Web3Provider(provider));
  const web3 = new Web3(provider);
  const account = (await web3.eth.getAccounts())?.[0]?.toLowerCase();

  order = {
    "parameters": {
      "offerer": "0x396823F49AA9f0e3FAC4b939Bc27aD5cD88264Db",
      "zone": "0x0000000000000000000000000000000000000000",
      "offer": [
        {
          "itemType": 2,
          "token": "0x415bdda9c15968edd99022ccf4c8aba821df2970",
          "identifierOrCriteria": "3",
          "startAmount": "1",
          "endAmount": "1"
        }
      ],
      "consideration": [
        {
          "itemType": 0,
          "token": "0x0000000000000000000000000000000000000000",
          "identifierOrCriteria": "0",
          "startAmount": "100000000000000",
          "endAmount": "100000000000000",
          "recipient": "0x396823f49aa9f0e3fac4b939bc27ad5cd88264db"
        }
      ],
      "orderType": 0,
      "startTime": "1667232762",
      "endTime": "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      "zoneHash": "0x3000000000000000000000000000000000000000000000000000000000000000",
      "salt": "0x00000000651d373788766013",
      "conduitKey": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "totalOriginalConsiderationItems": "1",
      counter: 0,
    },
    "signature": "0x985a3c697b952bab11ce839e13f77c522fafac6ea86438d997bc9c80c60e46e7b186310d02c8fe58e17158a8cb80350e408c308b24ecd7e2c13ffb92f85c9836"
  }

  const { executeAllActions: executeAllFulfillActions } =
    await seaport.fulfillOrder({
      order,
      accountAddress: account,
    });
  const transaction = executeAllFulfillActions();
  return transaction;
}
