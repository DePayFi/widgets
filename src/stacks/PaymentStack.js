import ChangeNetworkFeeDialog from '../dialogs/ChangeNetworkFeeDialog';
import ChangePaymentTokenDialog from '../dialogs/ChangePaymentTokenDialog';
import PaymentDialog from '../dialogs/PaymentDialog';
import React from 'react';
import Stack from '../utils/Stack';

class PaymentStack extends React.Component {
  state = {
    loading: true,

    paymentAmount: null,
    paymentToken: null,
    paymentReceiver: null,

    priceGas: null,
    priceETHinUSD: null,

    payerAddress: '0x317D875cA3B9f8d14f960486C0d1D1913be74e90',
    payerAvailableRoutes: null,
    payerAvailableTokens: null,
    payerAvailableAmounts: null,
    payerRequiredAmountsForRoutes: null,

    payerBalanceETH: null,
    payerSelectedToken: null,
    payerSelectedAmount: null,
    payerSelectedAmountInUsd: null
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      paymentAmount: props.amount,
      paymentToken: props.token,
      paymentReceiver: props.receiver
    })
  }

  render() {
    return (
      <Stack
        dialogs={{
          Payment: <PaymentDialog/>,
          ChangePaymentToken: <ChangePaymentTokenDialog/>,
          ChangeNetworkFee: <ChangeNetworkFeeDialog/>
        }}
        start={'Payment'}
      />
    );
  }
}

export default PaymentStack;
