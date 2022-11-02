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

export async function createOpenseaOrder(
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

  const startTime = Math.round((new Date()).getTime() / 1000);
  const endTime = startTime + 86400 * 30;
  const { executeAllActions } = await seaport.createOrder(
    {
      offer: offerItems,
      consideration: [
        {
          amount: ethers.utils.parseEther(priceInEth.toString()).toString(),
          recipient: account,
        },
      ],
      conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
      zone: "0x0000000000000000000000000000000000000000",
      salt: "0x360c6ebe000000000000000000000000000000000000000050ff3605b7a7af94",
      fees: [
        {
          recipient: "0x0000a26b00c1F0DF003000390027140000fAa719",
          basisPoints: 250
        }
      ],
      startTime: startTime.toString(),
      endTime: endTime.toString()
    },
    account
  );

  const order = await executeAllActions();
  return order;
}
