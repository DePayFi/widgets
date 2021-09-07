## Installation

You can either load the depay-widgets package via CDN:

```
<script src="https://depay.fi/integrate/widgets/v2.js"></script>
```

or you install depay-widgets via the package manager of your choice and ship it as part of your application bundle:

```
yarn add depay-widgets
```

```
npm install depay-widgets --save
```

and load the DePayWidgets package wherever you need it:

```
import DePayWidgets from 'depay-widgets'
```

## DePay Payments

DePay Payments allows you to accept and perform crypto payments.

### Preparation

In order to receive decentralized payments on any blockchain you need to have your own wallet on that particular blockchain first:

- [Create an Ethereum wallet](https://ethereum.org/en/wallets/)
- [Create an BSC wallet](https://academy.binance.com/en/articles/how-to-get-started-with-binance-smart-chain-bsc)

### Quick start

```
<script src="https://depay.fi/integrate/widgets/v2.js"/>
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

### Configuration

You need to pass a configuration object to `DePayWidgets.Payment` which needs to contain the `accept` field:

#### accept

`blockchain`

The blockchain you want to receive the payment on.

Currently supported:

- `ethereum`
- `bsc` (Binance Smart Chain)

`amount`

The amount of tokens you want to receive. Needs to be passed as a number e.g. `20`. If passed as string the widget will asume it's a `BigNumber`.

The `BigNumber` of that amount will be calculated internally including finding the right amount of decimals for the given token.
So please just pass the amount in a human readable form as Number/Decimal: e.g. `20` for 20 USDT or `20.25` etc.

`token`

The address of the token you want to receive.

Use our [payment configurator](https://depay.fi/documentation/payments#payment-configurator) in order to simplify configuring this.

`receiver`

The address receiving the payment. Always double check that you've set the right address.

#### sent

`sent`

A function that will be called once the payment has been sent to the network (but still needs to be mined/confirmed).

The widget will call the `sent` callback-function passing a transaction as single argument (see: [depay-web3-transaction](http://github.com/depayfi/depay-web3-transaction) for more details)

```javascript
DePayWidgets.Payment({
  // ...
  sent: (transaction)=> {
    // called when payment transaction has been sent to the network
  }
})
```

#### confirmed

`confirmed`

A function that will be called once the payment has been confirmed once by the network.

The widget will call the `confirmed` callback-function passing a transaction as single argument (see: [depay-web3-transaction](http://github.com/depayfi/depay-web3-transaction) for more details)

```javascript
DePayWidgets.Payment({
  // ...
  confirmed: (transaction)=> {
    // called when payment transaction has been confirmed once by the network
  }
})
```

#### ensured

`ensured`

A function that will be called once the payment has been confirmed enough times to consider it's "ensured" (e.g. 12 confirmations on Ethereum).

The widget will call the `ensured` callback-function passing a transaction as single argument (see: [depay-web3-transaction](http://github.com/depayfi/depay-web3-transaction) for more details)

```javascript
DePayWidgets.Payment({
  // ...
  ensured: (transaction)=> {
    // called when payment transaction has been confirmed X times by the network
  }
})
```

#### failed

`failed`

A function that will be called if the payment execution failed on the blockchain (after it has been sent/submitted).

The widget will call the `failed` callback-function passing a transaction as single argument (see: [depay-web3-transaction](http://github.com/depayfi/depay-web3-transaction) for more details)

```javascript
DePayWidgets.Payment({
  // ...
  failed: (transaction)=> {
    // called when payment transaction failed on the blockchain
  }
})
```

#### event

`event`

If set to `ifSwapped`, emits a [payment event](https://github.com/depayfi/depay-evm-router#depayrouterv1paymentevent02) if payments are routed through [router smart contract](https://github.com/depayfi/depay-evm-router).
Payments are routed through the DePayPaymentRouter if swapping tokens is required in order to perform the payment. If payments are not routed through the router, e.g. direct transfer, no event is emited if `event` is set to `ifSwapped`.


#### style

`style`

Allows you to change the style of the widget:

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
  },
  // ...
})
```

##### fontFamily

`fontFamily`

Allows you to set the font-family:

```javascript
DePayWidgets.Payment({
  style: {
    fontFamily: '"Cardo", serif !important'
  },
  // ...
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
  },
  // ...
})
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
yarn test:cypress:debug --spec "cypress/integration/Payment/execute.js"
```

### Release new versions to npm

```
npm login
npm publish
```
