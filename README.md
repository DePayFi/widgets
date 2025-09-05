# [Crypto Web3 Payment Widget by DePay](https://depay.com/)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/DePayFi/widgets/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/@depay/widgets.svg?style=flat)](https://www.npmjs.com/package/@depay/widgets) [![Tests](https://github.com/depayfi/widgets/actions/workflows/cypress.yml/badge.svg)](https://github.com/DePayFi/widgets/actions)

![example](https://github.com/user-attachments/assets/afc14f09-3b53-4b22-b8e6-c3eebeb5407f)

## 📦 Installation

### via CDN

```html
<script defer async src="https://integrate.depay.com/widgets/v13.js"></script>
```

### via Package Manager (recommended)

```sh
yarn add @depay/widgets ethers react react-dom
```

or

```sh
npm install @depay/widgets ethers react react-dom --save
```

> [!IMPORTANT]
> Ensure the peer dependencies (ethers, react, and react-dom) are installed if not already present.

## Import in your JavaScript files

```javascript
import DePayWidgets from '@depay/widgets'
```

## Server-Side Rendering (SSR)

If you're using SSR frameworks like Next.js, make sure to only load DePay Widgets on the client side.

Guide: https://dev.to/elisabethleonhardt/how-to-use-client-side-only-packages-with-ssr-in-gatsby-and-nextjs-3pfa

## Demos

Configurator UI: https://app.depay.com/integrations/new

Technical Demo: https://depayfi.github.io/widgets/demo.bundle.html

## Support

### Platforms

- Ethereum Virtual Machine (EVM)
- Solana Virtual Machine (SVM)

#### Platform specific packaging

If only specific platform packaging is needed:

##### EVM (Ethereum Virtual Machine)

```sh
yarn add @depay/widgets-evm
```

or

```sh
npm install @depay/widgets-evm --save
```

```javascript
import DePayWidgets from '@depay/widgets-evm'
```

##### SVM (Solana Virtual Machine)

```sh
yarn add @depay/widgets-svm
```

or

```sh
npm install @depay/widgets-svm --save
```

```javascript
import DePayWidgets from '@depay/widgets-svm'
```

### Blockchains

- [Ethereum](https://ethereum.org)
- [BNB Smart Chain](https://www.binance.org/smartChain)
- [Polygon](https://polygon.technology)
- [Solana](https://solana.com)
- [Optimism](https://www.optimism.io)
- [Arbitrum](https://arbitrum.io)
- [Avalanche](https://www.avax.network)
- [Gnosis](https://gnosis.io)
- [Base](https://base.org)
- [Worldchain](https://world.org/world-chain)

### Wallets

DePay supports [most crypto wallets](https://depay.com/wallets).

## Payment Widget

Enable seamless wallet-to-wallet crypto payments.

### Managed Integration using Integration ID

```javascript
DePayWidgets.Payment({
  integration: 'YOUR_INTEGRATION_ID'
})
```

Managed integration configurations fetched from app.depay.com.

> [!IMPORTANT]
> Local configurations override remote settings.

> [!CAUTION]
> Use either `integration` (managed) or `accept` (unmanaged), never both.

#### Payload for Dynamic Backend Configurations

```javascript
DePayWidgets.Payment({
  integration: 'YOUR_INTEGRATION_ID',
  payload: { dynamicKey: 'dynamicValue' }
})
```

Forwards the payload to your backend for dynamic payment setup, like:

```json
{
  "dynamicKey": "dynamicValue"
}
```

### Unmanaged Configuration

> [!IMPORTANT]
> Unmanaged configurations do not provide any callbacks for server-side actions or integrations. They are limited to initiating and executing payments only. If you need callbacks for your integrations, use [managed integrations](https://depay.com/docs/payments/integrate/widget).

> [!CAUTION]
> Client-side callbacks and client-side flow management are not recommended. Payment flows can involve device handovers (e.g., desktop to mobile) or app-to-app transitions on mobile, which break client-side control. For this reason, the widget does not provide client-side callbacks for flow handling. Instead, you can manage and control the user flow through [managed integrations](https://depay.com/docs/payments/integrate/widget).

```javascript
DePayWidgets.Payment({
  accept: [{
    blockchain: 'ethereum',
    amount: 1,
    token: 'TOKEN_ADDRESS',
    receiver: 'RECEIVER_ADDRESS'
  }]
})
```

Multi-blockchain payments:

```javascript
DePayWidgets.Payment({
  accept: [
    { // 20 USDT on ethereum
      blockchain: 'ethereum',
      amount: 20,
      token: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
    },{ // 20 BUSD on bsc
      blockchain: 'bsc',
      amount: 20,
      token: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      receiver: '0x552C2a5a774CcaEeC036d41c983808E3c76477e6'
    },{ // 20 USDC on polygon
      blockchain: 'polygon',
      amount: 20,
      token: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      receiver: '0x552C2a5a774CcaEeC036d41c983808E3c76477e6'
    }
  ]
});
```

### Configuration Options

#### accept

> [!CAUTION]
> Use either `integration` (managed) or `accept` (unmanaged), never both.

```javascript
DePayWidgets.Payment({
  accept: [{
    blockchain: 'ethereum',
    amount: 1,
    token: 'TOKEN_ADDRESS',
    receiver: 'RECEIVER_ADDRESS'
  }]
})
```

`blockchain`

The blockchain you want to receive the payment on.

`token`

The address of the token you want to receive.

`amount` (Optional)

The amount of tokens you want to receive. Needs to be passed as a human readable number e.g. `20`.

The `BigNumber` of that amount will be calculated internally including finding the right amount of decimals for the given token.
So please just pass the amount in a human readable form as Number/Decimal: e.g. `20` for 20 USDT or `20.25` etc.

If you do not pass an amount, the user will be able to select an amount within the widget.

`receiver`

The address receiving the payment. Always double check that you've set the right address.


#### amount

##### fixed currency amounts

If you want the widget to fix a payment amount in a currency, use `currency` and `fix`:

`currency`: 

Example (charge US$5.20):

```
{
  amount: {
    currency: 'USD',
    fix: 5.20
  }
}
```

Make sure to not pass any amounts to `accept` if you use fix currency amounts.

The widget will still display local currency conversions to users. If you want to change this see `currency` configuration.

##### amount selection (changeable amounts)

When you want to control how the amount selection behaves, pass the `amount` configuration object,
alongside values for `start`, `min` and `step`.

`start`: The amount that is initially selected.

`min`: The minimum amount selectable.

`step`: The number by which to increment/decrement changes to the amount.

#### fee

You can configure a fee which will be applied to every payment with its own dedicated fee receiver address.

The fee will be taken from the target token and target amount (after swap, depending on your `accept` configuration).

`amount`: Either percentage (e.g. `5%`, or absolute amount as BigNumber string ('100000000000000000') or pure number (2.5)

`receiver`: The address that is supposed to receive the fee.

```javascript
DePayWidgets.Payment({
  accept: [
    {...

      fee: {
        amount: '3%',
        receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
      }
    }
  ],
});
```

##### fee2

You can configure up to 2 fees that will be paid out as part of the payment:

```javascript
DePayWidgets.Payment({
  accept: [
    {...

      fee: {...},
      fee2: {,
        amount: '5%',
        receiver: '0x08B277154218CCF3380CAE48d630DA13462E3950'
      }
    }
  ],
});
```

##### protocolFee

The fee paid to the protocol:

```javascript
DePayWidgets.Payment({
  
  protocolFee: '1.5%',
  
});
```

#### title

`title`

Allows you to change the title of the widget:

```javascript
DePayWidgets.Payment({

  title: 'Donation'

  //...
})
```

#### wallets

You can sort and allow (list) wallets displayed during the initial wallet selection step as follows:

##### wallets.sort

```
{
  wallets: {
    sort: [
      'Uniswap',
      'Coinbase'
    ]
  }
}
```

This configuration would display Uniswap and Coinbase first, then would list all the others.

##### wallets.allow

```
{
  wallets: {
    allow: [
      'Uniswap',
      'Coinbase',
      'Rainbow'
    ]
  }
}
```

This configuration would only display Uniswap, Coinbase and Rainbow. No other options/wallets are displayed.

#### wallet

`wallet`

Allows to pass an already connected wallet instance (to skip the "Connect Wallet" flow):

```javascript
let { wallet } = DePayWidgets.Connect({})

DePayWidgets.Payment({
  
  wallet: wallet

})
```

#### providers

Allows to set providers to be used for making RPC calls to the individual blockchains:

```javascript
DePayWidgets.Payment({

  providers: {
    ethereum: ['http://localhost:8545'],
    bsc: ['http://localhost:8545'],
    polygon: ['http://localhost:8545']
  }
})
```

#### currency

Allows you to enforce displayed local currency (instead of automatically detecting it):

```javascript

DePayWidgets.Payment({

  currency: 'USD'

})

```

#### allow (list)

Allows only the configured tokens to be eligible as means of payment:

```javacript
DePayWidgets.Payment({
  
  allow: {
    ethereum: [
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
      '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
      '0x6b175474e89094c44da98b954eedeac495271d0f'  // DAI
    ],
    bsc: [
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // BNB
      '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD
      '0x55d398326f99059ff775485246999027b3197955'  // BSC-USD
    ],
    polygon: [
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // MATIC
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
    ]
  }

})

```

#### deny

Allows to deny tokens so that they will not be suggested as means of payment:

```javacript
DePayWidgets.Payment({
  
  deny: {
    ethereum: [
      '0x82dfDB2ec1aa6003Ed4aCBa663403D7c2127Ff67',  // akSwap
      '0x1368452Bfb5Cd127971C8DE22C58fBE89D35A6BF',  // JNTR/e
      '0xC12D1c73eE7DC3615BA4e37E4ABFdbDDFA38907E',  // KICK
    ],
    bsc: [
      '0x119e2ad8f0c85c6f61afdf0df69693028cdc10be', // Zepe
      '0xb0557906c617f0048a700758606f64b33d0c41a6', // Zepe
      '0x5190b01965b6e3d786706fd4a999978626c19880', // TheEver
      '0x68d1569d1a6968f194b4d93f8d0b416c123a599f', // AABek
      '0xa2295477a3433f1d06ba349cde9f89a8b24e7f8d', // AAX
      '0xbc6675de91e3da8eac51293ecb87c359019621cf', // AIR
      '0x5558447b06867ffebd87dd63426d61c868c45904', // BNBW
      '0x569b2cf0b745ef7fad04e8ae226251814b3395f9', // BSCTOKEN
      '0x373233a38ae21cf0c4f9de11570e7d5aa6824a1e', // ALPACA
      '0x7269163f2b060fb90101f58cf724737a2759f0bb', // PUPDOGE
      '0xb16600c510b0f323dee2cb212924d90e58864421', // FLUX
      '0x2df0b14ee90671021b016dab59f2300fb08681fa', // SAFEMOON.is
      '0xd22202d23fe7de9e3dbe11a2a88f42f4cb9507cf', // MNEB
      '0xfc646d0b564bf191b3d3adf2b620a792e485e6da', // PIZA
      '0xa58950f05fea2277d2608748412bf9f802ea4901', // WSG
      '0x12e34cdf6a031a10fe241864c32fb03a4fdad739' // FREE
    ]
  }
})
```

#### container

`container`

Allows you to pass a container element that is supposed to contain the widget:

```javascript
DePayWidgets.Payment({
  container: document.getElementById('my-container')
})
```

Make sure to set the css value `position: relative;` for the container element. Otherwise it can not contain the widget.

React example:

```javascript
let CustomComponentWithWidget = (props)=>{
    let container = useRef()

    useEffect(()=>{
      if(container.current) {
        DePayWidgets.Payment({ ...defaultArguments, document,
          container: container.current
        })
      }
    }, [container])

    return(
      <div ref={container} style={{ position: 'relative', border: '1px solid black', width: "600px", height: "600px" }}></div>
    )
  }
```

#### style

`style`

Allows you to change the style of the widget.

```javascript
DePayWidgets.Payment({
  style: {
    colors: {
      primary: '#ffd265',
      text: '#e1b64a',
      buttonText: '#000000',
    },
    fontFamily: '"Cardo", serif !important',
    css: `
      @import url("https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&display=swap");

      .ReactDialogBackground {
        background: rgba(0,0,0,0.8);
      }
    `
  }
})
```

##### colors

`colors`

Allows you to set color values:

```javascript
DePayWidgets.Payment({
  
  style: {
    colors: {
      primary: '#ffd265',
      text: '#ffd265',
      buttonText: '#000000',
      icons: '#ffd265'
    }
  }
})
```

##### colorsDarkMode

You can pass colors applicable to dark mode:

```javascript
DePayWidgets.Payment({
  
  style: {
    colorsDarkMode: {
      primary: '#000265',
      text: '#000265',
      buttonText: '#FFFFFF',
      icons: '#000265'
    }
  }
})
```

##### fontFamily

`fontFamily`

Allows you to set the font-family:

```javascript
DePayWidgets.Payment({
  
  style: {
    fontFamily: '"Cardo", serif !important'
  }
})
```

##### css

`css`

Allows you to inject CSS:

```javascript
DePayWidgets.Payment({
  
  style: {
    css: `
      @import url("https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&display=swap");

      .ReactDialogBackground {
        background: rgba(0,0,0,0.8);
      }
    `
  }
})
```

###### cssDarkMode

Allows you to inject css to adjust darkMode:

```javascript
DePayWidgets.Payment({
  
  style: {
    cssDarkMode: `
      @import url("https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&display=swap");

      .ReactDialogBackground {
        background: rgba(0,0,0,0.8);
      }
    `
  }
})
```

#### unmount

`unmount`

Allows you to unmount (the React safe way) the entire widget from the outside:

```javascript
let { unmount } = await DePayWidgets.Payment({})

unmount()
```

## Connect Widget

DePay Connect allows you to have your users connect their crypto wallet to your dApp or website.

Returns connected `account` and `wallet` in return. 

```javascript
let { account, wallet }  = await DePayWidgets.Connect()
```

See [web3-wallets](https://github.com/depayfi/web3-wallets) for more details about the returned `wallet`.

### Rejections

1. Rejects if user just closes the dialog without connecting any wallet:

```javascript

DePayWidgets.Connect().then(()=>{}).catch((error)=>{
  error // "USER_CLOSED_DIALOG"
})

```

## Login Widget

DePay Login allows you to perform web3 wallet logins with ease.

Returns `account` if successfully signed and recovered log in message.

```javascript
let message = "Sign to login"
let { account, wallet } = await DePayWidgets.Login({ message })
```

Connects wallet and instructs connected wallet to sign `message`, afterwards sends `signature` and `message` to `POST /login` (or `endpoint` if defined):

```
POST /login
BODY
  {
    "message": "Sign to login",
    "signature": "0x123456" // raw signature
  }
```

The `/login` endpoint needs to recover the address for `message` and `signature`.

e.g. your backend could use node + ethers.js to recover the signature

```javascript
const ethers = require('ethers')
const hashedMessage = ethers.utils.hashMessage(inputs.message)
const address = ethers.utils.recoverAddress(hashedMessage, inputs.signature)
return address
```

make sure you return the recovered address back to the widget:

```
POST /login
RESPONSE
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
```


Which will resolve the `DePayWidgets.Login` request to the resolved account:

```javascript
account // 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

You can also pass a `recover` function that takes care of signature recovery:

```javascript
DePayWidgets.Login({ message, recover: ({ message, signature })=>{
    return new Promise((resolve, reject)=>{
      fetch('https://example.com/login', {
        method: 'POST',
        body: JSON.stringify({ message, signature })
      })
        .then((response)=>{
          if(response.status == 200) {
            response.text().then((account)=>{
              resolve(account)
            }).catch(reject)
          } else {
            response.text().then((text)=>{
              reject(text || 'Recovering login signature failed!')
            }).catch(reject)
          }
        })
    })
  }
})
```

### Sign message containing the account address

In case you want to include the wallet account identifier in the to be signed message, pass a callback function returning a string to `message`:

```javascript
let { account } = await DePayWidgets.Login({
  message: (account)=>`Click to log in to DePay and to accept DePay's Terms of Service: https://depay.com/legal/terms\n${dateTime}\n${account}`
})
console.log("Logged in via signature", account)
```

### Rejections

1. Rejects if user just closes the dialog without connecting any wallet:

```javascript

DePayWidgets.Login().then(()=>{}).catch((error)=>{
  error // "USER_CLOSED_DIALOG"
})

```

## Select Widget

DePay Select widget allows you to open a dialog that allows you to select things like tokens, etc.

### Select Token

Resolves with what has been selected by the user.

```javascript
let token = await DePayWidgets.Select({ what: 'token' })

// {
//   address: "0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"
//   blockchain: "ethereum"
//   decimals: 18
//   logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png"
//   name: "DePay"
//   symbol: "DEPAY",
//   routable: true // information if token is routable through DePay Payment router
// }
```

### Select NFT

Resolves with what has been selected by the user.

This only resolves to a single contract on a single blockchain.

As NFT collections could span over multiple blockchains, users would need to make one selection per contract address & blockchain.

```javascript
let collection = await DePayWidgets.Select({ what: 'nft' })

// {
//    address: "0xba30E5F9Bb24caa003E9f2f0497Ad287FDF95623",
//    blockchain: "ethereum",
//    createdAt: "2021-06-18T21:32:25.355263+00:00",
//    image: "https://i.seadn.io/gae/l1wZXP2hHFUQ3turU5VQ9PpgVVasyQ79-ChvCgjoU5xKkBA50OGoJqKZeMOR-qLrzqwIfd1HpYmiv23JWm0EZ14owiPYaufqzmj1?w=500&auto=format",
//    link: "https://opensea.io/collection/bored-ape-kennel-club",
//    name: "BoredApeKennelClub",
//    type: "721",
// }
```

If the NFT contract is of type 1155 the return will also contain the NFTs id for the given contract address:

```javascript
// {
//    address: "0x495f947276749Ce646f68AC8c248420045cb7b5e",
//    blockchain: "ethereum",
//    id: "35347623114821255323888368639026081793120226253597860997754787918389704654849",
//    image: "https://i.seadn.io/gae/IIFck1wOESXNMfCN6nEhFIXReUaSyI68MXNPjvFapbjQXc42ARIcG8k-nEKJjXs1GdCY75ej4qArfy7LDbgGOFSR6zzBIOG-yEw04Q?w=500&auto=format",
//    link: "https://opensea.io/assets/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/35347623114821255323888368639026081793120226253597860997754787918389704654849",
//    name: "Genesis Block - 100,000 BC",
//    type: "1155"
// }
```

If NFT is a list of mints on solana:

If the NFT contract is of type 1155 the return will also contain the NFTs id for the given contract address:

```javascript
// {
//    addresses: ["4RYP3yX52g3BawgS4ShHwJqbrm8FcUF8PPA4oP1eP6Cv", "5GAse3WFPMCmbrw5x1RVdRaBttReBrgFLkw7yyqbSqtn"],
//    blockchain: "solana",
//    image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https%3A%2F%2Farweave.net%2FevHbhPvYxPn3NgtzeHg3WPS-QFwGdibQwTvY8chccrA%3Fext%3Dpng",
//    link: "https://magiceden.io/marketplace/depay",
//    name: "SOL - AD 2020",
//    type: "metaplex"
// }
```

## Examples

### React

#### Payment Widget

```javascript

import React from 'react'
import DePayWidgets from '@depay/widgets'

export default (props)=>{

  let unmount

  const openPaymentWidget = async ()=>{
    (
      { unmount } = await DePayWidgets.Payment({...})
    )
  }

  useEffect(() => {
    return ()=>{
      // make sure an open widgets gets closed/unmounted as part of this component
      if(unmount) { unmount() }
    }
  }, [])

  return(
    <button onClick={ openPaymentWidget } type="button">
      Pay
    </button>
  )
}

```

## Web3 Payments

The future is [Web3 Payments](https://depay.com/web3-payments).

Blockchains hold the potential to faster, simpler and smarter payments.

Web3 Payments are borderless, peer-to-peer, and support multiple tokens and blockchains.

Accept any asset type that your customers already have in their wallet. [DePay](https://depay.com) is blockchain agnostic and can at any time be extended on any blockchain-specific plugin. Interoperability, scalability & flexibility are the cornerstones of our protocol. Accepting any asset that users already have in their wallets no matter which blockchain these are held on, reduces friction when performing decentralized payments.

### Chain Agnostic (Multichain)

Interoperability is the key principle on which our infrastructure is built. [DePay](https://depay.com) is extensible around any blockchain, ensuring a competitive cross-chain future.

### Permissionless

Interoperability is the key principle on which our infrastructure is built. [DePay](https://depay.com) is extensible around any blockchain, ensuring a competitive cross-chain future.

### Trustless

Most Web3 Payment providers & processors receive payments to wallets that they manage themselves. Only in a further intermediate step are the payments paid out to sellers. [DePay](https://depay.com) does not act as an intermediary. Every intermediate step is replaced by smart contracts which are connected to decentralized liquidity pools. As a result, trust is no longer required.

### Easy to use

Our ambition was to create an even easier user experience than you're used to from shopping in current non-crypto e-commerce stores. We think we've done a good job of that.

### Open Source

Feel free to use & contribute to our codebase at. We're happy to have you look under our hood. The [DePay](https://depay.com) protocol will always remain open source.

### Multichain

[DePay](https://depay.com) calculates payment routes on multiple blockchains simultaneously despite what your wallet is currently connected to. Our software automatically detects & switches the network if required.

## Development

### Quick start

```
yarn install
yarn dev
```

### Testing

#### Debug Cypress

Starts cypress in `--headed` and `--no-exit`

```
test:cypress:debug
```

Test and debug single cypress file:

```
yarn test:cypress:debug --spec "cypress/e2e/bundle.js"
```
