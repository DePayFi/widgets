# Overview

[Preparation](#preparation)

[Installation](#installation)

[DePay Payments](#depay-payments)

[DePay Donations](#depay-donations)

[DePay Sales](#depay-sales)

[Development](#development)

## Installation

You can either load the depay-widgets package via unpkg's CDN:

```
<script src="https://unpkg.com/depay-widgets@1/dist/umd/index.js"/>
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
import DePayWidgets from 'depay-widgets';
```

## DePay Payments

DePay Payments allows you to accept and perform crypto payments.

[DePay Payments Product Video](https://www.youtube.com/watch?v=gP1Q-M7blWw)

### Preparation

In order to receive decentralized payments on any blockchain you need to have your own wallet on that particular blockchain first:

- [Create an Ethereum wallet](https://ethereum.org/en/wallets/)

### Quick start

```
<script src="https://unpkg.com/depay-widgets@1/dist/umd/index.js"/>
```

```
DePayWidgets.Payment({
  amount: '20',
  token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
  receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
});
```

### Configuration

You need to pass a configuration object to `DePayWidgets.Payment` which needs to contain the fields:

`amount`

The amount of tokens you want to receive. Needs to be passed as a string e.g. `"20"`.

The `BigNumber` of that amount will be calculated internally including finding the right amount of decimals for the given token.
So please just pass the amount in a human readable form: e.g. `"20"` for 20 USDT and not `"2000000"` (BigNumber).

`token`

The address of the token you want to receive.

Use our [payment configurator](https://depay.fi/documentation/payments#payment-configurator) in order to simplify configuring this.

`receiver`

The address receiving the payment. Always double check that you've set the right address.

`callback`

A function that will be called once the payment has been successfully confirmed by the network.

The widget will call the `callback` function passing a callback object as an argument:

```
{
  tx: '<the transaction hash of the confirmed transaction>'
}
```

## DePay Donations

DePay allows you to accept crypto donation payments.

[DePay Donations Product Video](XXX)

### Preparation

In order to receive decentralized payments on any blockchain you need to have your own wallet on that particular blockchain first:

- [Create an Ethereum wallet](https://ethereum.org/en/wallets/)

### Quick start

```
<script src="https://unpkg.com/depay-widgets@1/dist/umd/index.js"/>
```

```
DePayWidgets.Donation({
  amount: {
    start: "10",
    min: "1",
    step: "1"  
  },
  token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
  receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
});
```

### Configuration

You need to pass a configuration object to `DePayWidgets.Donation` which needs to contain the fields:

`amount`

The amount object contains the amount of preselected tokens when the widget opens (`start`),
the minimum amount of tokens the user can select in the widget (`min`) and
by which number the amount increments/decrements when changed by the user (`step`).

`token`

The address of the token you want to receive.

Use our [payment configurator](https://depay.fi/documentation/payments#payment-configurator) in order to simplify configuring this.

`receiver`

The address receiving the payment. Always double check that you've set the right address.

`callback`

A function that will be called once the payment has been successfully confirmed by the network.

The widget will call the `callback` function passing a callback object as an argument:

```
{
  tx: '<the transaction hash of the confirmed transaction>'
}
```

## DePay Sales

DePay Sales allows you easily sell tokens directly from your website or Dapp while accepting thousands of crypto assets as means of payment.

[DePay Sales Product Video](https://youtu.be/rfdPCoF3tpw)

### Preparation

In order to to sell tokens in a decentralized way on any blockchain you need to have a decentralized liquidity pool (dex pair) on any decentralized exchange:

- [How to list your token on UniSwap](https://hackernoon.com/how-to-list-your-defi-token-on-uniswap-d4s3w7s)

### Quick start

```
<script src="https://unpkg.com/depay-widgets@1/dist/umd/index.js"/>
```

```
DePayWidgets.Sale({
  amount: {
    start: "10",
    min: "1",
    step: "1"
  },
  token: "0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb"
});
```

### Configuration

You need to pass a configuration object to `DePayWidgets.Sale` which needs to contain the fields:

`amount`

The amount object contains the amount of preselected tokens when the widget opens (`start`),
the minimum amount of tokens the user can select in the widget (`min`) and
by which number the amount increments/decrements when changed by the user (`step`).

`token`

The address of the token you want to sell.

Use our [sale configurator](https://depay.fi/documentation/sale#sale-configurator) in order to simplify configuration.

`callback`

A function that will be called once the payment has been successfully confirmed by the network.

The widget will call the `callback` function passing a callback object as an argument:

```
{
  tx: '<the transaction hash of the confirmed transaction>'
}
```

## Development

### Quick start

```
yarn install
yarn start
```

### Release new versions to npm

```
npm login
npm publish
```
