import AmountContext from '../contexts/AmountContext';
import AmountProvider from '../providers/AmountProvider';
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
import TokenContext from '../contexts/TokenContext';
import TokenProvider from '../providers/TokenProvider';
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
                  <TokenProvider
                    token={ this.state.token }
                  >
                    <TokenContext.Consumer>
                      {tokenContext => (
                        <AmountProvider
                          amount={ this.state.amount }
                          token={ tokenContext.token }
                        >
                          <AmountContext.Consumer>
                            {amountContext => (
                              <WalletContext.Consumer>
                                {walletContext => (
                                  <RoutesProvider
                                    token={ tokenContext.token.address }
                                    amount={ amountContext.amount }
                                    address={ walletContext.address }
                                    wallet={ walletContext.wallet }
                                  >
                                    <RoutesContext.Consumer>
                                      {routesContext => (
                                        <PaymentProvider
                                          route={ routesContext.selected }
                                          gas={ gasContext.selected }
                                          price={ priceContext.price }
                                          amount={ amountContext.amount }
                                        >
                                          <PaymentContext.Consumer>
                                            {paymentContext => (
                                              <Stack
                                                dialogs={{
                                                  Payment: <PaymentDialog
                                                    initializing={ priceContext.initializing || routesContext.initializing || gasContext.initializing }
                                                    selected={ routesContext.selected }
                                                    token={ tokenContext.token.address }
                                                    paymentContext={ paymentContext }
                                                    receiver={ this.state.receiver }
                                                    wallet={ walletContext.wallet }
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
                          </AmountContext.Consumer>
                        </AmountProvider>
                      )}
                    </TokenContext.Consumer>
                  </TokenProvider>
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
