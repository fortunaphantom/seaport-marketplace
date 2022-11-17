# Project configuration

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run dev:server`

Runs the local express server in the development mode. [http://localhost:4000](http://localhost:4000)

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Database file

Local json file was used as a database. (/server/storage/orders.json)

## Directory structure

server: express server source\
src: react frontend source

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Seaport Workflow
## Structures
### Sub structures

```
export declare enum ItemType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC1155 = 3,
  ERC721_WITH_CRITERIA = 4,
  ERC1155_WITH_CRITERIA = 5
}
```

```
export declare enum OrderType {
  FULL_OPEN = 0,
  PARTIAL_OPEN = 1,
  FULL_RESTRICTED = 2,
  PARTIAL_RESTRICTED = 3
}
```

```
export type BigNumberish = BigNumber | Bytes | bigint | string | number;
```

### Main structure

```
export declare type OrderWithCounter = {
  parameters: {
    offerer: string;
    zone: string;
    orderType: OrderType;
    startTime: BigNumberish;
    endTime: BigNumberish;
    zoneHash: string;
    salt: string;
 
    offer: {
      itemType: ItemType;
      token: string; // contract address
      identifierOrCriteria: string; // tokenId
      startAmount: string;
      endAmount: string;
    }[];
 
    consideration: {
      itemType: ItemType;
      token: string; // contract address
      identifierOrCriteria: string; // tokenId
      startAmount: string;
      endAmount: string;
      recipient: string;
    }[];
 
    totalOriginalConsiderationItems: BigNumberish;
    conduitKey: string;
 
    counter?: number;
  };
 
  signature: string;
}
```


>Offer means seller, and consideration means buyer.

## Workflow

- User selects one or multiple nfts from one or multiple collections.
- I think these collections and assets data come from the backend.
- The front-end passes the selected tokens to the seaport sdk’s createOrder() function.
- Seaport sdk popups metamask’s sign dialog.
- User signs, and OrderWithCounter object is returned from seaport sdk.
- The front-end sends this object to the backend.
- The back-end stores the order data.
- The front-end fetches the order list from the backend, and fulfills the order using seaport sdk.

## Security
Security issues are occurred when a buyer is going to change a seller’s offer price.  
The signature is generated when a seller creates an offer using the seller’s wallet private key.  
The order data comes from the back-end, and a malicious buyer is able to change the order data before fulfilling the order.  
But it is impossible for the buyer to create the signature from the changed order data, since he doesn't know the seller's private key.
The seaport smart contract checks the signature when fulfilling & cancelling orders, and the malicious orders can not be fulfilled.
This is how Seaport works for security.
