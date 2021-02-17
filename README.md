# Overview

[DePay Payments](#depay-payments)

[Development](#development)


## DePay Payments

DePay Payments allows you to accept and perform crypto payments.

[Product Video](https://www.youtube.com/watch?v=gP1Q-M7blWw)

### Quick start

```
<script src="https://unpkg.com/depay-widgets@1.0.0/dist/umd/index.js"/>
```

```
DePayWidgets.Payment({
  amount: '20',
  token: '0xa0bEd124a09ac2Bd941b10349d8d224fe3c955eb',
  receiver: '0x4e260bB2b25EC6F3A59B478fCDe5eD5B8D783B02'
});
```

### Preparation

In order to receive decentralized payments on any blockchain you need to have your own wallet on that particular blockchain first:

- [Create an Ethereum wallet](https://ethereum.org/en/wallets/)

### Installation

You can either load the depay-widgets package via unpkg's CDN:

```
<script src="https://unpkg.com/depay-widgets@1.0.0/dist/umd/index.js"/>
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

## Development

### Quick start

```
yarn install
yarn start
```
