## Installation

You can either load the `@depay/widgets` package via CDN:

```
<script src="https://integrate.depay.fi/widgets/v7.js"></script>
```

or you install `@depay/widgets` via the package manager of your choice and ship it as part of your application bundle:

```
yarn add @depay/widgets
```

```
npm install @depay/widgets --save
```

and load the DePayWidgets package wherever you need it:

```
import DePayWidgets from '@depay/widgets'
```

## Demo

To easily configure DePay Payment Widgets please use our configurator here: https://app.depay.fi/integrations/new

For a more low-key technical example/demo page have a look at: https://depayfi.github.io/widgets/dev.bundle.html

## Support

### Blockchains

- [Ethereum](https://ethereum.org)
- [BNB Smart Chain](https://www.binance.org/smartChain)
- [Polygon](https://polygon.technology)

### Wallets

DePay supports the most popular crypto wallets:

- [MetaMask](https://metamask.io)
- [Coinbase Wallet](https://wallet.coinbase.com)

100+ different wallets via [WalletConnect](https://walletconnect.org), such as:
- [Trust Wallet](https://trustwallet.com)
- [DeFi Wallet by crypto.com](https://crypto.com/defi-wallet)
- [1inch Wallet](https://1inch.io/wallet/)
- [imToken Wallet](https://www.token.im)
- [TokenPocket](https://www.tokenpocket.pro/en)
- [Pillar](https://www.pillar.fi/)
- [Math Wallet](https://mathwallet.org/)
- [Ledger Live](https://www.ledger.com/ledger-live)
- [Argent Wallet](https://www.argent.xyz)
- [AlphaWallet](https://alphawallet.com/)
- [Unstoppable Wallet](https://unstoppable.money)
- [Atomic Wallet](https://atomicwallet.io)
- [Rainbow](https://rainbow.me/)
- and more...

## DePay Payments

DePay Payments allows you to accept and perform crypto payments.

### Preparation (DePay Payments)

In order to receive decentralized payments on any blockchain you need to have your own wallet on that particular blockchain first:

- [Create an Ethereum wallet](https://ethereum.org/en/wallets/)
- [Create an BSC wallet](https://academy.binance.com/en/articles/how-to-get-started-with-binance-smart-chain-bsc)
- [Create a Polygon wallet](https://wallet.polygon.technology/)

### Quick start (DePay Payments)

```
<script src="https://integrate.depay.fi/widgets/v7.js"/>
```

```
DePayWidgets.Payment({
  accept: [{
    blockchain: 'ethereum',
    amount: 20,
    token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
    receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  }]
});
```

### Configuration (DePay Payments)

You need to pass a configuration object to `DePayWidgets.Payment` which needs to at least contain the `accept` field:

```javascript
DePayWidgets.Payment({
  accept: [{
    blockchain: 'ethereum',
    amount: 20,
    token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
    receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  }]
});
```

You can also accept multiple payments on multiple blockchains:

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

#### accept (DePay Payments)

`blockchain`

The blockchain you want to receive the payment on.

Currently supported:

- `ethereum`
- `bsc` (Binance Smart Chain)
- `polygon`

`token`

The address of the token you want to receive.

Use our [payment configurator](https://depay.fi/documentation/payments#payment-configurator) in order to simplify configuring this.

`amount` (Optional)

The amount of tokens you want to receive. Needs to be passed as a human readable number e.g. `20`.

The `BigNumber` of that amount will be calculated internally including finding the right amount of decimals for the given token.
So please just pass the amount in a human readable form as Number/Decimal: e.g. `20` for 20 USDT or `20.25` etc.

If you do not pass an amount, the user will be able to select an amount within the widget.

`receiver`

The address receiving the payment. Always double check that you've set the right address.

#### amount (DePay Payments)

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

##### amount selection (changable amounts)

When you want to control how the amount selection behaves, pass the `amount` configuration object,
alongside values for `start`, `min` and `step`.

`start`: The amount that is initially selected.

`min`: The minimum amount selectable.

`step`: The number by wich to increment/decremten changes to the amount.

#### receiver (DePay Payments)

Payment receivers can either be wallet addresses, but also smart contracts.

In order to have smart contracts receive the payments you will need to pass an object as receiver containing the following attributes.

```javascript
DePayWidgets.Payment({
  accept: [
    receiver: {
      address: toAddress,
      signature: 'claim(address,uint256,bool)',
      params: ['true']
    }
  ]
});
```

`address`: The address of the smart contract.

`signature`: The signature of the smart contract method you want to call as part of the payment.

`params`: Additional params forwarded to the smart contract method.

Checkout [DePay Web3 Payments](https://github.com/DePayFi/depay-web3-payments#pay-into-smart-contracts) and [DePay Router Smart Contract](https://github.com/DePayFi/depay-evm-router) for more details.

#### fee (DePay Payments)

You can configure a fee which will be applied to every payment with it's own dedicated fee receiver address.

The fee will be taken from the target token and target amount (after swap, depending on your `accept` configuration).

`amount`: Either percentage (e.g. `5%`, or absolute amount as BigNumber string ('100000000000000000') or pure number (2.5)

`receiver`: The address that is supposed to receive the fee.

```javascript
DePayWidgets.Payment({
  accept: [...],
  fee: {
    amount: '3%',
    receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  }
});
```

#### fromToken, fromAmount + toToken (DePay Payments)

In case where you want to configure payments based on the source token + amount, rather than target token and amount, you can pass `fromToken`, `fromAmount` and `toToken` to `accept`.

In those cases make sure to NOT configure `token` nor `amount`!

```javascript
DePayWidgets.Payment({
  accept: [{
    blockchain: 'bsc',
    fromToken: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    fromAmount: 0.1,
    toToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    receiver: '0x08B277154218CCF3380CAE48d630DA13462E3950'
  }]
});

// This will open a payment widget to send 0.1 BUSD to the receiver, converting it to BNB along the way.
```

#### preload (DePay Payments)

To optimize initialization speed of the Payment Widget you can preload payment routes as soon as you become aware of the users wallet address. 

Typically right after the users conncets his wallet, or in cases the user has his wallet already connected you can preload immediatelly:

```javascript
let address = '0x4aD374e0836c26BeC213a19D3e030F8b3A8AcDE4' // e.g. retrieve it right when you perform wallet connect

DePayWidgets.Payment.preload({
  account: address,
  accept: [
    {
      blockchain: 'ethereum',
      amount: 10,
      token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
      receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
    },{
      blockchain: 'bsc',
      amount: 10,
      token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
      receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
    }
  ]
});
```

#### track (DePay Payments)

`track`

Allows to track payment confirmation/validation via DePay API to trigger callbacks into your existing systems:

```javascript
DePayWidgets.Payment({

  track: {
    endpoint: '/track/payments' // your endpoint to forward the payment tracking to the payments api
  }
})
```

Once the payment has been submitted by the widget, it will call the configured endpoint with:

```
POST /track/payments
BODY:
  {
    "blockchain": "ethereum",
    "transaction": "0x4311a9820195c2a5af99c45c72c88848ed403a4020863c913feed81d15855ae4",
    "sender": "0x769794c94e9f113e357023dab73e81dbd6db201c",
    "nonce": 103,
    "after_block": 13230369,
    "from_token": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "from_amount": "1100000000000000000",
    "from_decimals": 18,
    "to_token": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "to_amount": "1000000000000000000",
    "to_decimals": 18,
    "fee_amount": "100000000000000000"
  }
```

Alternatively you can pass a method to track that performs the tracking request to your backend if you need to handle the request yourself (e.g. to add additional headers etc.):

```javascript
DePayWidgets.Payment({

  track: {
    method: (payment)=>{
      return fetch('/track/payments', {
        method: 'POST',
        body: JSON.stringify(payment),
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": document.querySelector('[name=csrf-token]').content }
      })
    }
  }
})
```

In case you pass a tracking method it needs to return a promise.

Your endpoint needs to make sure to forward this to the [payment tracking api](https://depay.fi/documentation/api#payments).

Also make sure to add `token`, `amount` and `confirmations` when forwarding the request to the payments api.
Those values are supposed to be set by your backend not the widget nor the fronted because any user could set these values to their liking otherwise, having you confirm payment amounts and tokens that you didn't intend to receive!

Make sure you read the [Payment Tracking API](https://depay.fi/documentation/api#payments) for further details on how to integrate payment tracking.

Payment tracking requests will be attempted up to 3 times by the widget and will display "Payment tracking failed!" to the user if the widget was not able to start payment tracking via the given endpoint after 3 attempts.

A failed payment tracking will also call the [error callback](#error) with `{code: "TRACKING_FAILED"}`.

##### Asynchronous Validation

For improving user experience, we recommend performing payment validation asynchronously as in certain situation in can take up to multiple minutes.

You can configure the widget to track/validate the payment asynchronously:

```javascript
DePayWidgets.Payment({

  track: {
    endpoint: '/track',
    async: true
  }
})
```

Which will release the user right after the payment has been confirmed on the user's machine.

It still tracks and validates the payment asynchronously and calls back your endpoints as soon as it has been validated.

This allows you to release the user immediately, showing him some confirmation and reconfirming his payment in an asynchronous step (like a notification or email).

##### Additional Polling

In order to ensure a 100% coverage that users are released and forwarded within your payment flow, you will need to implement polling in addition to tracking.

The `track.poll` configuration either takes an `enpoint` or a `method` (similiar to track itself).

It will use the endpoint or the method to request a release every 5 seconds.

You need to make sure to respond to this request with a status `404` in case the user is not to be released just yet (payment and processing on your side are not complete yet)
or `200` if the payment has been completed and the processing on your side is done and the user can be released and forwarded withing your payment flow.

In case you want to redirect the user to the next step in your system the poll endpoint needs to respond with a body containing json like: `{ forward_to: 'https://example.com/next_step_url' }`.

It is not enough to rely on setting `forward_to` initially with the tracking request, you will also need to respond with `forward_to` when implementing polling
as the entire reason for polling is to cover cases where websockets fail and the initial `forward_to` can not be communicated to the client.

#### connected (DePay Payments)

`connected`

A function that will be called once the user connects a wallet.

This function will be called with the connected wallet address as the main argument:

```javascript
DePayWidgets.Payment({

  connected: (address)=> {
    // do something with the address
  }
})

```

#### closed (DePay Payments)

`closed`

A function that will be called once the user closes the widget (no matter if before or after the payment).

```javascript
DePayWidgets.Payment({

  closed: ()=> {
    // do something if user closed the widget
  }
})

```

#### before (DePay Payments)

`before`

A function that will be called before the payment is handed over to the wallet.

Allows you to stop the payment if this methods returns false.

```javascript
DePayWidgets.Payment({

  before: (payment)=> {
    alert('Something went wrong')
    return false // stops payment
  }
})
```

#### sent (DePay Payments)

`sent`

A function that will be called once the payment has been sent to the network (but still needs to be mined/confirmed).

The widget will call this function with a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details)

```javascript
DePayWidgets.Payment({

  sent: (transaction)=> {
    // called when payment transaction has been sent to the network
  }
})
```

#### confirmed (DePay Payments)

`confirmed`

A function that will be called once the payment has been confirmed once by the network (client-side).

The widget will call this function passing a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details)

```javascript
DePayWidgets.Payment({

  confirmed: (transaction)=> {
    // called when payment transaction has been confirmed once by the network
  }
})
```

#### validated (DePay Payments)

`validated`

A function that will be called once the payment has been validated by DePay Apis (server-side).

```javascript
DePayWidgets.Payment({

  validated: (successful)=> {
    // successful (true or false)
  }
})
```

#### failed (DePay Payments)

`failed`

A function that will be called if the payment execution failed on the blockchain (after it has been sent/submitted).

The widget will call this function passing a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details)

```javascript
DePayWidgets.Payment({

  failed: (transaction)=> {
    // called when payment transaction failed on the blockchain
    // handled by the widget, no need to display anything
  }
})
```

#### critical (DePay Payments)

`critical`

A function that will be called if the widget throws an critical internal error that it can't handle and display on it's own:

```javascript
DePayWidgets.Payment({
  
  critical: (error)=> {
    // render and display the error with error.toString()
  }
})
```

#### error (DePay Payments)

`error`

A function that will be called if the widget throws an non-critical internal error that it can and will handle and display on it's own:

```javascript
DePayWidgets.Payment({

  error: (error)=> {
    // maybe do some internal tracking with error.toString()
    // no need to display anything as widget takes care of displaying the error
  }
})
```

#### providers (DePay Payments)

Allows to set providers to be used for making RPC calls to the individiual blockchains:

```javascript
DePayWidgets.Payment({

  providers: {
    ethereum: ['http://localhost:8545'],
    bsc: ['http://localhost:8545'],
    polygon: ['http://localhost:8545']
  }
})
```

#### currency (DePay Payments)

Allows you to enforce displayed local currency (instead of automatically detecting it):

```javascript

DePayWidgets.Payment({

  currency: 'USD'

})

```

#### whitelist (DePay Payments)

Allows only the configured tokens to be eligible as means of payment (from the sender):

```javacript
DePayWidgets.Payment({
  
  whitelist: {
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

#### blacklist (DePay Payments)

Allows to blacklist tokens so that they will not be suggested as means of payment (from the sender):

```javacript
DePayWidgets.Payment({
  
  blacklist: {
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

#### event (DePay Payments)

`event`

If set to `ifSwapped`, emits a [payment event](https://github.com/depayfi/depay-evm-router#depayrouterv1paymentevent02) if payments are routed through [router smart contract](https://github.com/depayfi/depay-evm-router).
Payments are routed through the DePayPaymentRouter if swapping tokens is required in order to perform the payment. If payments are not routed through the router, e.g. direct transfer, no event is emited if `event` is set to `ifSwapped`.


```javascript
DePayWidgets.Payment({
  
  event: 'ifSwapped'

})
```

#### container (DePay Payments)

`container`

Allows you to pass a container element that is supposed to contain the widget:

```javascript
DePayWidgets.Payment({
  container: document.getElementById('my-container')
})
```

#### style (DePay Payments)

`style`

Allows you to change the style of the widget.

```javascript
DePayWidgets.Payment({
  style: {
    colors: {
      primary: '#ffd265',
      text: '#e1b64a',
      buttonText: '#000000',
      icons: '#ffd265'
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

##### colors (DePay Payments)

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

##### fontFamily (DePay Payments)

`fontFamily`

Allows you to set the font-family:

```javascript
DePayWidgets.Payment({
  
  style: {
    fontFamily: '"Cardo", serif !important'
  }
})
```

##### css (DePay Payments)

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

#### unmount (DePay Payments)

`unmount`

Allows you to unmount (the React safe way) the entire widget from the outside:

```javascript
let { unmount } = await DePayWidgets.Payment({})

unmount()
```

#### recover (DePay Payments)

`recover`

Allows you to recover a previous made payment. E.g. useful if you need to continue to show a pending payment progress if user rearrives or reloads a payment page:

```javascript
DePayWidgets.Payment({
  recover: {
    blockchain: 'ethereum',
    transaction: '0x081ae81229b2c7df586835e9e4c16aa89f8a15dc118fac31b7521477c53ed2a9',
    sender: '0x317d875ca3b9f8d14f960486c0d1d1913be74e90',
    nonce: 2865,
    afterBlock: 14088130,
    token: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    amount: 0.0001
  }
})

A recovered payment still results in a confirmed or failed payment, and also calls one of those callbacks also when created with recover.

```

#### closable (DePay Payments)

`closable`

Makes the widget unclosable:

```javascript
DePayWidgets.Payment({
  closable: false
})

```

#### integration (DePay Payments)

`integration`

Labels payments to track them per integration.

```javascript
DePayWidgets.Payment({
  integration: 'fe690fbc-1740-4894-b12c-23a72abec54d'
})
```

## DePay Sales

DePay Sales allows you to sell tokens directly from your website or dApp with automatic any-to-any payment conversion (so people can use any token when buying your token directly off your website or dApp).

### Preparation (DePay Sales)

In order to sell tokens in a decentralized way, that token needs to have a liquidity pool on a decentralized exchange:

- [Create Uniswap v2 Liquidity Pool](https://app.uniswap.org/#/add/v2/ETH)
- [Create Uniswap v2 Liquidity Pool (Polygon)](https://app.uniswap.org/#/add/v2/ETH?chain=polygon)
- [Create Pancakeswap Liquidity Pool](https://pancakeswap.finance/add)

### Quick start (DePay Sales)

```
<script src="https://integrate.depay.fi/widgets/v7.js"/>
```

```javascript
DePayWidgets.Sale({
  sell: {
    'ethereum': '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  }
});
```

### Configuration (DePay Sales)

You need to pass a configuration object to `DePayWidgets.Sale` which needs to at least contain the `sell` field:

```javascript
DePayWidgets.Sale({
  sell: {
    'ethereum': '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  }
});
```

You can also sell on multiple blockchains:

```javascript
DePayWidgets.Sale({
  sell: {
    'ethereum': '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
    'bsc': '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  }
});
```

#### sell (DePay Sales)

`"blockchain": "token"`

`blockchain`

Currently supported blockchains:

- `ethereum`
- `bsc` (Binance Smart Chain)

`token`

The address of the token you want to sell.

Use our [sale configurator](https://depay.fi/documentation/sales#sale-configurator) in order to simplify configuring this.

#### amount (DePay Sales)

When you want to control how the amount selection behaves, pass the `amount` configuration object,
alongside values for `start`, `min` and `step`.

`start`: The amount that is initially selected.

`min`: The minimum amount selectable.

`step`: The number by wich to increment/decremten changes to the amount.

`token`: Set to `true` if you want amount selection to be denominated in the token you're selling, e.g.:

```javascript
DePayWidgets.Sale({
  sell: {...},
  amount: {
    token: true
  }
});
```

#### connected (DePay Sales)

`connected`

A function that will be called once the user connects a wallet.

Will be called with the connected wallet address as the main argument:

```javascript
DePayWidgets.Sale({

  connected: (address)=> {
    // do something with the address
  }
});
```

#### closed (DePay Sales)

`closed`

A function that will be called once the user closes the widget (no matter if before or after the payment).

```javascript
DePayWidgets.Sale({

  closed: ()=> {
    // do something if user closed the widget
  }
});
```

#### sent (DePay Sales)

`sent`

A function that will be called once the payment has been sent to the network (but still needs to be mined/confirmed).

The widget will call this function with a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details)

```javascript
DePayWidgets.Sale({
  
  sent: (transaction)=> {
    // called when payment transaction has been sent to the network
  }
});
```

#### confirmed (DePay Sales)

`confirmed`

A function that will be called once the payment has been confirmed once by the network.

The widget will call this function passing a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details)

```javascript
DePayWidgets.Sale({

  confirmed: (transaction)=> {
    // called when payment transaction has been confirmed once by the network
  }
});
```

#### failed (DePay Sales)

`failed`

A function that will be called if the payment execution failed on the blockchain (after it has been sent/submitted).

The widget will call this function passing a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details)

```javascript
DePayWidgets.Sale({

  failed: (transaction)=> {
    // called when payment transaction failed on the blockchain
    // handled by the widget, no need to display anything
  }
});
```

#### critical (DePay Sales)

`critical`

A function that will be called if the widget throws an critical internal error that it can't handle and display on it's own:

```javascript
DePayWidgets.Sale({
  
  critical: (error)=> {
    // render and display the error with error.toString()
  }
});
```

#### error (DePay Sales)

`error`

A function that will be called if the widget throws an non-critical internal error that it can and will handle and display on it's own:

```javascript
DePayWidgets.Sale({
  
  error: (error)=> {
    // maybe do some internal tracking with error.toString()
    // no need to display anything as widget takes care of displaying the error
  }
});
```

#### providers (DePay Sales)

Allows to set providers to be used for making RPC calls to the individiual blockchains:

```javascript
DePayWidgets.Sale({

  providers: {
    ethereum: ['http://localhost:8545'],
    bsc: ['http://localhost:8545']
  }
});
```

#### currency (DePay Sales)

Allows you to enforce displayed local currency (instead of automatically detecting it):

```javascript
DePayWidgets.Sale({

  currency: 'USD'

});
```

#### blacklist (DePay Sales)

Allows to blacklist tokens so that they will not be suggested as means of payment (from the sender):

```javacript
DePayWidgets.Sale({
  
  blacklist: {
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
});
```

#### tokenImage (DePay Sales)

`tokenImage`

Allows to set the token image used in the widget to represent the purchased token:

```javascript
DePayWidgets.Sale({
  
  tokenImage: 'https://depay.fi/favicon.png'

});
```

#### style (DePay Sales)

`style`

Allows you to change the style of the widget.

```javascript
DePayWidgets.Sale({
  
  style: {
    colors: {
      primary: '#ffd265',
      text: '#e1b64a',
      buttonText: '#000000',
      icons: '#ffd265'
    },
    fontFamily: '"Cardo", serif !important',
    css: `
      @import url("https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&display=swap");

      .ReactDialogBackground {
        background: rgba(0,0,0,0.8);
      }
    `
  }
});
```

##### colors (DePay Sales)

`colors`

Allows you to set color values:

```javascript
DePayWidgets.Sale({
  
  style: {
    colors: {
      primary: '#ffd265',
      text: '#ffd265',
      buttonText: '#000000',
      icons: '#ffd265'
    }
  }
});
```

##### fontFamily (DePay Sales)

`fontFamily`

Allows you to set the font-family:

```javascript
DePayWidgets.Sale({
  
  style: {
    fontFamily: '"Cardo", serif !important'
  }
});
```

##### css (DePay Sales)

`css`

Allows you to inject CSS:

```javascript
DePayWidgets.Sale({
  
  style: {
    css: `
      @import url("https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&display=swap");

      .ReactDialogBackground {
        background: rgba(0,0,0,0.8);
      }
    `
  }
});
```

#### unmount (DePay Sales)

`unmount`

Allows you to unmount (the React safe way) the entire widget from the outside:

```javascript
let { unmount } = await DePayWidgets.Sale({})

unmount()
```

#### closable (DePay Sales)

`closable`

Makes the widget unclosable:

```javascript
DePayWidgets.Sale({
  closable: false
})

```

#### integration (DePay Sales)

`integration`

Labels sales to track them per integration.

```javascript
DePayWidgets.Sale({
  integration: 'fe690fbc-1740-4894-b12c-23a72abec54d'
})
```

## DePay Donations

DePay Donations allows you to accept donation payments made with thousands of different crypto currencies.

### Preparation (DePay Donations)

In order to receive decentralized donation payments on any blockchain you need to have your own wallet on that particular blockchain first:

- [Create an Ethereum wallet](https://ethereum.org/en/wallets/)
- [Create an BSC wallet](https://academy.binance.com/en/articles/how-to-get-started-with-binance-smart-chain-bsc)

### Quick start (DePay Donations)

```
<script src="https://integrate.depay.fi/widgets/v7.js"/>
```

```javascript
DePayWidgets.Donation({
  accept: [{
    blockchain: 'ethereum',
    token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
    receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  }]
});
```

### Configuration (DePay Donations)

You need to pass a configuration object to `DePayWidgets.Donation` which needs to at least contain the `accept` field:

```javascript
DePayWidgets.Donation({
  accept: [{
    blockchain: 'ethereum',
    token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
    receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  }]
});
```

You can also accept donations on multiple blockchains:

```javascript
DePayWidgets.Donation({
  accept: [{
    blockchain: 'ethereum',
    token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
    receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  },{
    blockchain: 'bsc',
    token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
    receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  }]
});
```

#### accept (DePay Donations)

`blockchain`

The blockchain you want to receive the payment on.

Currently supported:

- `ethereum`
- `bsc` (Binance Smart Chain)

`token`

The address of the token you want to receive.

Use our [donation configurator](https://depay.fi/documentation/donations#donation-configurator) in order to simplify configuring this.

`receiver`

The address receiving the donation. Always double check that you've set the right address.

#### amount (DePay Donations)

When you want to control how the amount selection behaves, pass the `amount` configuration object,
alongside values for `start`, `min` and `step`.

`start`: The amount that is initially selected.

`min`: The minimum amount selectable.

`step`: The number by wich to increment/decremten changes to the amount.

#### connected (DePay Donations)

`connected`

A function that will be called once the user connects a wallet.

Will be called with the connected wallet address as the main argument:

```javascript
DePayWidgets.Donation({

  connected: (address)=> {
    // do something with the address
  }
});
```

#### fee (DePay Donations)

You can configure a fee which will be applied to every payment with it's own dedicated fee receiver address.

The fee will be taken from the target token and target amount (after swap, depending on your `accept` configuration).

`amount`: Either percentage (e.g. `5%`, or absolute amount as BigNumber string ('100000000000000000') or pure number (2.5)

`receiver`: The address that is supposed to receive the fee.

```javascript
DePayWidgets.Donation({
  accept: [...],
  fee: {
    amount: '3%',
    receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
  }
});
```

#### closed (DePay Donations)

`closed`

A function that will be called once the user closes the widget (no matter if before or after the payment).

```javascript
DePayWidgets.Donation({

  closed: ()=> {
    // do something if user closed the widget
  }
});
```

#### sent (DePay Donations)

`sent`

A function that will be called once the payment has been sent to the network (but still needs to be mined/confirmed).

The widget will call this function with a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details)

```javascript
DePayWidgets.Donation({
  
  sent: (transaction)=> {
    // called when payment transaction has been sent to the network
  }
});
```

#### confirmed (DePay Donations)

`confirmed`

A function that will be called once the payment has been confirmed once by the network (client-side).

The widget will call this function passing a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details)

```javascript
DePayWidgets.Donation({

  confirmed: (transaction)=> {
    // called when payment transaction has been confirmed once by the network
  }
});
```

#### validated (DePay Donations)

`validated`

A function that will be called once the payment has been validated by DePay Apis (server-side).

```javascript
DePayWidgets.Payment({

  validated: (successful)=> {
    // successful (true or false)
  }
})
```

#### failed (DePay Donations)

`failed`

A function that will be called if the payment execution failed on the blockchain (after it has been sent/submitted).

The widget will call this function passing a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details)

```javascript
DePayWidgets.Donation({

  failed: (transaction)=> {
    // called when payment transaction failed on the blockchain
    // handled by the widget, no need to display anything
  }
});
```

#### critical (DePay Donations)

`critical`

A function that will be called if the widget throws an critical internal error that it can't handle and display on it's own:

```javascript
DePayWidgets.Donation({
  
  critical: (error)=> {
    // render and display the error with error.toString()
  }
});
```

#### error (DePay Donations)

`error`

A function that will be called if the widget throws an non-critical internal error that it can and will handle and display on it's own:

```javascript
DePayWidgets.Donation({
  
  error: (error)=> {
    // maybe do some internal tracking with error.toString()
    // no need to display anything as widget takes care of displaying the error
  }
});
```

#### providers (DePay Donations)

Allows to set providers to be used for making RPC calls to the individiual blockchains:

```javascript
DePayWidgets.Donation({

  providers: {
    ethereum: ['http://localhost:8545'],
    bsc: ['http://localhost:8545']
  }
});
```

#### currency (DePay Donations)

Allows you to enforce displayed local currency (instead of automatically detecting it):

```javascript
DePayWidgets.Donation({

  currency: 'USD'

});
```

#### blacklist (DePay Donations)

Allows to blacklist tokens so that they will not be suggested as means of payment (from the sender):

```javacript
DePayWidgets.Donation({
  
  blacklist: {
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

#### container (DePay Donations)

`container`

Allows you to pass a container element that is supposed to contain the widget:

```javascript
DePayWidgets.Dontaion({
  container: document.getElementById('my-container')
})
```

#### style (DePay Donations)

`style`

Allows you to change the style of the widget.

```javascript
DePayWidgets.Donation({
  
  style: {
    colors: {
      primary: '#ffd265',
      text: '#e1b64a',
      buttonText: '#000000',
      icons: '#ffd265'
    },
    fontFamily: '"Cardo", serif !important',
    css: `
      @import url("https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&display=swap");

      .ReactDialogBackground {
        background: rgba(0,0,0,0.8);
      }
    `
  }
});
```

##### colors (DePay Donations)

`colors`

Allows you to set color values:

```javascript
DePayWidgets.Donation({
  
  style: {
    colors: {
      primary: '#ffd265',
      text: '#ffd265',
      buttonText: '#000000',
      icons: '#ffd265'
    }
  }
});
```

##### fontFamily (DePay Donations)

`fontFamily`

Allows you to set the font-family:

```javascript
DePayWidgets.Donation({
  
  style: {
    fontFamily: '"Cardo", serif !important'
  }
});
```

##### css (DePay Donations)

`css`

Allows you to inject CSS:

```javascript
DePayWidgets.Donation({
  
  style: {
    css: `
      @import url("https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&display=swap");

      .ReactDialogBackground {
        background: rgba(0,0,0,0.8);
      }
    `
  }
});
```

#### unmount (DePay Donations)

`unmount`

Allows you to unmount (the React safe way) the entire widget from the outside:

```javascript
let { unmount } = await DePayWidgets.Donation({})

unmount()
```

#### closable (DePay Donations)

`closable`

Makes the widget unclosable:

```javascript
DePayWidgets.Donation({
  closable: false
})

```

#### integration (DePay Donations)

`integration`

Labels donations to track them per integration.

```javascript
DePayWidgets.Donation({
  integration: 'fe690fbc-1740-4894-b12c-23a72abec54d'
})
```

## DePay Connect (DePay Donations)

DePay Connect allows you to have your users connect their crypto wallet to your dApp or website.

Returns connected `account`, `accounts` and `wallet` in return. 

```
<script src="https://integrate.depay.fi/widgets/v7.js"/>
```

```javascript
let { account, accounts, wallet }  = await DePayWidgets.Connect()
```

See [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets) for more details about the returned `wallet`.

### Rejections (DePay Donations)

1. Rejects if user just closes the dialog without connecting any wallet:

```javascript

DePayWidgets.Connect().then(()=>{}).catch((error)=>{
  error // "USER_CLOSED_DIALOG"
})

```

## DePay Login

DePay Login allows you to perform web3 wallet logins with ease.

Returns `account` if succesfully signed and recovered log in message.

```
<script src="https://integrate.depay.fi/widgets/v7.js"/>
```

```javascript
let message = "Sign to login"
let account = await DePayWidgets.Login({ message })
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

The `/login` endpoint needs to recover the address for `message` and `signature` and needs to return it in the response:

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

### Rejections (DePay Login)

1. Rejects if user just closes the dialog without connecting any wallet:

```javascript

DePayWidgets.Login().then(()=>{}).catch((error)=>{
  error // "USER_CLOSED_DIALOG"
})

```

## DePay Select

DePay Select widget allows you to open a dialog that allows you to select things like tokens, etc.

Resolves with what has been selected by the user:

```
<script src="https://integrate.depay.fi/widgets/v7.js"/>
```

```javascript
let token = await DePayWidgets.Select({ what: 'token' })

// token
// {
//   address: "0xa0bed124a09ac2bd941b10349d8d224fe3c955eb"
//   blockchain: "ethereum"
//   decimals: 18
//   logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb/logo.png"
//   name: "DePay"
//   symbol: "DEPAY"
// }
```

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
yarn test:cypress:debug --spec "cypress/e2e/Payment/amount.js"
```

### Release new versions to npm

```
npm login
npm publish
```

