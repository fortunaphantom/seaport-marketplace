interface ICollectionInfo {
  name: string;
  symbol: string;
  address: string;
  collectionType: number;
  chainId: number;
  image: string;
}

interface IAsset {
  tokenId: string;
  image: string;
  metadata: string;
  name: string;
}

interface ICollection {
  collectionInfo: ICollectionInfo;
  assets: IAsset[];
}

interface IAssetInfo {
  asset: IAsset;
  collectionInfo: ICollectionInfo;
}
