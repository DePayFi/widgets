import ChangeNetworkFeeDialog from '../dialogs/ChangeNetworkFeeDialog';
import ChangePaymentTokenDialog from '../dialogs/ChangePaymentTokenDialog';
import GasContext from '../contexts/GasContext';
import GasProvider from '../providers/GasProvider';
import PaymentContext from '../contexts/PaymentContext';
import PaymentDialog from '../dialogs/PaymentDialog';
import PaymentProvider from '../providers/PaymentProvider';
import PriceContext from '../contexts/PriceContext';
import PriceProvider from '../providers/PriceProvider';
import React from 'react';
import RoutesContext from '../contexts/RoutesContext';
import RoutesProvider from '../providers/RoutesProvider';
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

  render() {
    return (
      <GasProvider>
        <GasContext.Consumer>
          {gasContext => (
            <PriceProvider>
              <PriceContext.Consumer>
                {priceContext => (
                  <WalletContext.Consumer>
                    {walletContext => (
                      <RoutesProvider
                        token={ this.state.token }
                        amount={ this.state.amount }
                        address={ walletContext.address }
                        wallet={ walletContext.wallet }
                      >
                        <RoutesContext.Consumer>
                          {routesContext => (
                            <PaymentProvider
                              selected={ routesContext.selected }
                              gas={ gasContext.selected }
                              price={ priceContext.price }
                              amount={ this.state.amount }
                            >
                              <PaymentContext.Consumer>
                                {paymentContext => (
                                  <Stack
                                    dialogs={{
                                      Payment: <PaymentDialog
                                        initializing={ priceContext.initializing || routesContext.initializing || gasContext.initializing }
                                        selected={ routesContext.selected }
                                        token={ this.state.token }
                                        paymentContext={ paymentContext }
                                      />,
                                      ChangePaymentToken: <ChangePaymentTokenDialog
                                        routes={ routesContext.routes }
                                        change={ routesContext.change }
                                        paymentContext={ paymentContext }
                                      />,
                                      ChangeNetworkFee: <ChangeNetworkFeeDialog
                                        selected={ routesContext.selected }
                                        price={ priceContext.price }
                                        gasContext={ gasContext }
                                        paymentContext={ paymentContext }
                                      />
                                    }}
                                    start={'Payment'}
                                  />
                                )}
                              </PaymentContext.Consumer>
                            </PaymentProvider>
                          )}
                        </RoutesContext.Consumer>
                      </RoutesProvider>
                    )}
                  </WalletContext.Consumer>
                )}
              </PriceContext.Consumer>
            </PriceProvider>
          )}
        </GasContext.Consumer>
      </GasProvider>
    );
  }
}

export default PaymentStack;
