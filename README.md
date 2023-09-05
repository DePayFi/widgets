## Installation

You can either load the `@depay/widgets` package via CDN:

```
<script defer async src="https://integrate.depay.com/widgets/v11.js"></script>
```

or you install `@depay/widgets` via the package manager of your choice and ship it as part of your application bundle:

```
yarn add @depay/widgets
```

or

```
npm install @depay/widgets --save
```

and load the DePayWidgets package wherever you need it:

```
import DePayWidgets from '@depay/widgets'
```

Make sure you install DePay widgets peer dependencies, too, in case your project does not have them installed already:

```
yarn add ethers react react-dom
```

or

```
npm install ethers react react-dom --save
```

## Platform specific packaging

In case you want to use and package only specific platforms, use the platform-specific package:

### EVM platform specific packaging

```
yarn add @depay/widgets-evm
```

```javascript
import DePayWidgets from '@depay/widgets-evm'
```

### Solana platform specific packaging

```
yarn add @depay/widgets-solana
```

```javascript
import DePayWidgets from '@depay/widgets-solana'
```

## Server-side rendering

Make sure you load this library as a client-side script for client-side rendering (CSR), in case you are using a server-side rendering (SSR) framework like next.js.

Next.js: https://dev.to/elisabethleonhardt/how-to-use-client-side-only-packages-with-ssr-in-gatsby-and-nextjs-3pfa

## Demo

To easily integrate the DePay Payment Widgets please use our configurator here:

https://app.depay.com/integrations/new

For a more low-key technical example/demo page have a look at:

https://depayfi.github.io/widgets/demo.bundle.html

## Support

### Blockchains

- [Ethereum](https://ethereum.org)
- [BNB Smart Chain](https://www.binance.org/smartChain)
- [Polygon](https://polygon.technology)
- [Solana](https://solana.com)
- [Optimism](https://www.optimism.io)
- [Arbitrum](https://arbitrum.io)
- [Fantom](https://fantom.foundation)
- [Avalanche](https://www.avax.network)
- [Gnosis](https://gnosis.io)
- [Base](https://base.org)

### Wallets

DePay supports [most crypto wallets](https://depay.com/wallets).

## DePayWidgets: Payments

DePay Payments allows you to accept and perform crypto payments.

### Integration

`integration`

Connects the widget to a DePay integration managed via https://app.depay.com:

```javascript
DePayWidgets.Payment({
  integration: 'fe690fbc-1740-4894-b12c-23a72abec54d'
})
```

The configuration of the integration managed via https://app.depay.com will be fetched and applied before applying any additional local configurations.

You can fully manage an integration via https://app.depay.com. Passing any additional configuration is not necessary.

Locally applied configurations overwrite remotely stored configurations.

If your integration relies on processing dynamic from your backend (e.g. pricing), and you are not managing a fixed configuration via https://app.depay.com,
you need to pass the data that is supposed to be forwarded to your backend for dynamic configurations to the widget:

```javascript
DePayWidgets.Payment({
  integration: 'fe690fbc-1740-4894-b12c-23a72abec54d',
  payload: {
    whatever: 'you want to forward to your backend for dynamic configurations'
  }
})
```

This will forward:

```
{
  whatever: 'you want to forward to your backend for dynamic configurations'
}
```

to your backend in order to receive a payment configuration for the widget.

### Configuration

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

#### accept

`blockchain`

The blockchain you want to receive the payment on.

`token`

The address of the token you want to receive.

Use our [payment configurator](https://depay.com/documentation/payments#payment-configurator) in order to simplify configuring this.

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

#### fromToken, fromAmount + toToken

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

#### preload

To optimize initialization speed of the Payment Widget you can preload payment routes as soon as you become aware of the users wallet address. 

Typically right after the users connects his wallet, or in cases the user has his wallet already connected you can preload immediately:

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

#### title

`title`

Allows you to change the title of the widget:

```javascript
DePayWidgets.Payment({

  title: 'Donation'

  //...
})
```

#### track

`track`

Allows to track payment confirmation/validation via DePay API to trigger callbacks into your existing systems:

```javascript
DePayWidgets.Payment({

  track: {
    endpoint: '/track/payments' // your endpoint to forward the payment tracking to the payments api
  }
})
```

Once a user clicks "Pay" in the widget, and before the transaction is handed over to the wallet, the widget will send a payment trace (without transaction_id) to the configured endpoint.

This is where the payment tracing starts:

```
POST /track/payments
BODY:
  {
    "blockchain": "ethereum",
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

Once the payment has been submitted by the widget, it will call the configured endpoint again.

This is where the payment tracking starts:

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
    method: async (payment)=>{
      let response = await fetch('/track/payments', {
        method: 'POST',
        body: JSON.stringify(payment),
        headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": document.querySelector('[name=csrf-token]').content }
      })
      if(response.status != 200) {
        throw 'TRACKING FAILED'
      }
    }
  }
})
```

```javascript
DePayWidgets.Payment({

  track: {
    method: (payment)=>axios('/track/payments', payment)
  }
})
```

In case you pass a tracking method it needs to return a promise. 

If that promise resolves, the widget assumes the tracking initialization was successful. If the promise rejects it will retry the tracking initialization over and over again.

Make sure to evaluate within your tracking method if the response succeeded or not and throw an error accordingly.

Your endpoint also needs to make sure to forward this to the [payment tracking api](https://depay.com/documentation/api#payments).

Also make sure to add `token`, `amount` and `confirmations` when forwarding the request to the payments api.
Those values are supposed to be set by your backend not the widget nor the fronted because any user could set these values to their liking otherwise, having you confirm payment amounts and tokens that you didn't intend to receive!

Make sure you read the [Payment Tracking API](https://depay.com/documentation/api#payments) for further details on how to integrate payment tracking.

Payment tracking requests will be attempted indefinitely. After 2 minutes a warning dialog will be presented to users asking them to ensure an internet connection so that the payment tracking can be performed.

##### Asynchronous Validation

For user flows where you can release the user immediately, we recommend performing payment validation asynchronously as in certain situations it can take up to multiple minutes to validate a payment:

You can configure the widget to track/validate the payment asynchronously:

```javascript
DePayWidgets.Payment({

  track: {
    endpoint: '/track',
    async: true
  }
})
```

Which will release the user right after the payment transaction has been confirmed on the user's machine.

It still tracks and validates the payment asynchronously (in the background) and calls back your endpoints as soon as it has been validated.

This allows you to release the user immediately, showing him some confirmation and reconfirming his payment in an asynchronous step (like a notification or email).

##### Polling

In order to ensure a 100% coverage that users are released and forwarded within your payment flow, you will need to implement polling in addition to tracking.

The `track.poll` configuration either takes an `enpoint` or a `method` (similar to track itself).

It will use the endpoint or the method to request a release every 5 seconds.

You need to make sure to respond to this request with a status `404` in case the user is not to be released just yet (payment and processing on your side are not complete yet)
or `200` if the payment has been completed and the processing on your side is done and the user can be released and forwarded within your payment flow.

In case you want to redirect the user to the next step in your system, the poll endpoint needs to respond with a body containing json like: `{ forward_to: 'https://example.com/next_step_url' }`.

It is not enough to rely on setting `forward_to` initially with the tracking request, you will also need to respond with `forward_to` when implementing polling
as the entire reason for polling is to cover cases where websockets fail and the initial `forward_to` can not be communicated to the client.

If you use a method for additional polling, make sure you return a promise. Polling will continue as long as you resolve this promise with anything that resolves to true:

```javascript
DePayWidgets.Payment({

  track: {
    poll: {
      method: async (payment)=>{
        let response = await fetch('/payments/123/release', {
          method: 'POST',
          body: JSON.stringify(payment),
          headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": document.querySelector('[name=csrf-token]').content }
        })
        if(response.status == 200) {
          let json = await response.json()
          return json // { "forward_to": "https://mywebsite.com/payments/123/confirmation" }
        }
      }
    }
  }
})
```

```javascript
DePayWidgets.Payment({

  track: {
    poll: {
      method: async (payment)=>{
        let response = await axios('/payments/123/release', payment)
        return response // { "forward_to": "https://mywebsite.com/payments/123/confirmation" }
      }
    }
  }
})
```

#### connected

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

#### closed

`closed`

A function that will be called once the user closes the widget (no matter if before or after the payment).

```javascript
DePayWidgets.Payment({

  closed: ()=> {
    // do something if user closed the widget
  }
})

```

#### before

`before`

A function that will be called before the payment is handed over to the wallet.

Allows you to stop the payment if this method returns false.

```javascript
DePayWidgets.Payment({

  before: async (payment)=> {
    alert('Something went wrong')
    return false // stops payment
  }
})
```

#### sent

`sent`

A function that will be called once the payment has been sent to the network (but still needs to be mined/confirmed).

The widget will call this function with a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details about the structure)

```javascript
DePayWidgets.Payment({

  sent: (transaction)=> {
    // called when payment transaction has been sent to the network
  }
})
```

#### succeeded

`succeeded`

A function that will be called once the payment has succeeded on the network (checked client-side).

The widget will call this function passing a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details)

```javascript
DePayWidgets.Payment({

  succeeded: (transaction)=> {
    // called when payment transaction has been confirmed once by the network
  }
})
```

#### validated

`validated`

A function that will be called once the payment has been validated by DePay Apis (server-side).

```javascript
DePayWidgets.Payment({

  validated: (successful, transaction)=> {
    // successful (true or false)
  }
})
```

#### failed

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

#### critical

`critical`

A function that will be called if the widget throws a critical internal error that it can't handle and display on its own:

```javascript
DePayWidgets.Payment({
  
  critical: (error)=> {
    // render and display the error with error.toString()
  }
})
```

#### error

`error`

A function that will be called if the widget throws a non-critical internal error that it can and will handle and display on its own:

```javascript
DePayWidgets.Payment({

  error: (error)=> {
    // maybe do some internal tracking with error.toString()
    // no need to display anything as widget takes care of displaying the error
  }
})
```

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

#### whitelist

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

#### blacklist

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

#### unmount

`unmount`

Allows you to unmount (the React safe way) the entire widget from the outside:

```javascript
let { unmount } = await DePayWidgets.Payment({})

unmount()
```

#### recover

`recover`

Allows you to recover a previously made payment. E.g. useful if you need to continue to show a pending payment progress if user rearrives or reloads a payment page:

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

#### closable

`closable`

Makes the widget unclosable:

```javascript
DePayWidgets.Payment({
  closable: false
})

```

## DePayWidgets: Sale

DePay Sales allows you to sell tokens directly from your website or dApp with automatic any-to-any payment conversion (so people can use any token when buying your token directly off your website or dApp).

### Quick start

```javascript
DePayWidgets.Sale({
  sell: {
    'ethereum': '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb'
  }
});
```

### Configuration

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

#### sell

`"blockchain": "token"`

The address of the token you want to sell for the given blockchain.

#### amount

When you want to control how the amount selection behaves, pass the `amount` configuration object,
alongside values for `start`, `min` and `step`.

`start`: The amount that is initially selected.

`min`: The minimum amount selectable.

`step`: The number by which to increment/decrement changes to the amount.

`token`: Set to `true` if you want amount selection to be denominated in the token you're selling, e.g.:

```javascript
DePayWidgets.Sale({
  sell: {...},
  amount: {
    token: true
  }
});
```

#### connected

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

#### closed

`closed`

A function that will be called once the user closes the widget (no matter if before or after the payment).

```javascript
DePayWidgets.Sale({

  closed: ()=> {
    // do something if user closed the widget
  }
});
```

#### sent

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

#### succeeded

`succeeded`

A function that will be called once the payment has succeeded on the network (checked client-side).

The widget will call this function passing a transaction as single argument (see: [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets#transaction) for more details)

```javascript
DePayWidgets.Sale({

  succeeded: (transaction)=> {
    // called when payment transaction has been confirmed once by the network
  }
});
```

#### failed

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

#### critical

`critical`

A function that will be called if the widget throws a critical internal error that it can't handle and display on its own:

```javascript
DePayWidgets.Sale({
  
  critical: (error)=> {
    // render and display the error with error.toString()
  }
});
```

#### error

`error`

A function that will be called if the widget throws a non-critical internal error that it can and will handle and display on its own:

```javascript
DePayWidgets.Sale({
  
  error: (error)=> {
    // maybe do some internal tracking with error.toString()
    // no need to display anything as widget takes care of displaying the error
  }
});
```

#### providers

Allows to set providers to be used for making RPC calls to the individual blockchains:

```javascript
DePayWidgets.Sale({

  providers: {
    ethereum: ['http://localhost:8545'],
    bsc: ['http://localhost:8545']
  }
});
```

#### currency

Allows you to enforce displayed local currency (instead of automatically detecting it):

```javascript
DePayWidgets.Sale({

  currency: 'USD'

});
```

#### blacklist

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

#### tokenImage

`tokenImage`

Allows to set the token image used in the widget to represent the purchased token:

```javascript
DePayWidgets.Sale({
  
  tokenImage: 'https://depay.com/favicon.png'

});
```

#### style

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

##### colors

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

##### fontFamily

`fontFamily`

Allows you to set the font-family:

```javascript
DePayWidgets.Sale({
  
  style: {
    fontFamily: '"Cardo", serif !important'
  }
});
```

##### css

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

#### unmount

`unmount`

Allows you to unmount (the React safe way) the entire widget from the outside:

```javascript
let { unmount } = await DePayWidgets.Sale({})

unmount()
```

#### closable

`closable`

Makes the widget unclosable:

```javascript
DePayWidgets.Sale({
  closable: false
})

```

## DePay Connect

DePay Connect allows you to have your users connect their crypto wallet to your dApp or website.

Returns connected `account` and `wallet` in return. 

```javascript
let { account, wallet }  = await DePayWidgets.Connect()
```

See [depay-web3-wallets](https://github.com/depayfi/depay-web3-wallets) for more details about the returned `wallet`.

### Rejections

1. Rejects if user just closes the dialog without connecting any wallet:

```javascript

DePayWidgets.Connect().then(()=>{}).catch((error)=>{
  error // "USER_CLOSED_DIALOG"
})

```

## DePay Login

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

## DePay Select

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

#### DePay Payments

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
yarn test:cypress:debug --spec "cypress/e2e/Payment/payment-value-loss-safeguard.js"
```
