import ChangeNetworkFeeDialog from '../dialogs/ChangeNetworkFeeDialog';
import ChangePaymentTokenDialog from '../dialogs/ChangePaymentTokenDialog';
import PaymentContext from '../contexts/PaymentContext';
import PaymentDialog from '../dialogs/PaymentDialog';
import PriceProvider from '../providers/PriceProvider';
import React from 'react';
import RouteProvider from '../providers/RouteProvider';
import Stack from '../utils/Stack';
import WalletContext from '../contexts/WalletContext';

class PaymentStack extends React.Component {
  state = {
    amount: null,
    token: null,
    receiver: null
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      amount: props.amount,
      token: props.token,
      receiver: props.receiver
    })
  }

  isLoading() {
    return true;
  }

  render() {
    return (
      <PriceProvider>
        <PaymentContext.Provider value={{
          amount: this.state.amount,
          token: this.state.token,
          receiver: this.state.receiver
        }}>
          <WalletContext.Consumer>
            {walletContext => (
              <RouteProvider
                token={ this.state.token }
                address={ walletContext.address }
              >
                <Stack
                  dialogs={{
                    Payment: <PaymentDialog
                      loading={ this.isLoading() }
                    />,
                    ChangePaymentToken: <ChangePaymentTokenDialog/>,
                    ChangeNetworkFee: <ChangeNetworkFeeDialog/>
                  }}
                  start={'Payment'}
                />
              </RouteProvider>
            )}
          </WalletContext.Consumer>
        </PaymentContext.Provider>
      </PriceProvider>
    );
  }
}

export default PaymentStack;
