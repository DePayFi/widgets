import AmountContext from '../contexts/AmountContext';
import AmountProvider from '../providers/AmountProvider';
import ChangeNetworkFeeDialog from '../dialogs/ChangeNetworkFeeDialog';
import ChangePaymentTokenDialog from '../dialogs/ChangePaymentTokenDialog';
import ChangeTokenAmountDialog from '../dialogs/ChangeTokenAmountDialog';
import GasContext from '../contexts/GasContext';
import GasProvider from '../providers/GasProvider';
import PaymentContext from '../contexts/PaymentContext';
import PaymentProvider from '../providers/PaymentProvider';
import PriceContext from '../contexts/PriceContext';
import PriceProvider from '../providers/PriceProvider';
import React from 'react';
import RoutesContext from '../contexts/RoutesContext';
import RoutesProvider from '../providers/RoutesProvider';
import SaleDialog from '../dialogs/SaleDialog';
import Stack from '../utils/Stack';
import TokenContext from '../contexts/TokenContext';
import TokenProvider from '../providers/TokenProvider';
import WalletContext from '../contexts/WalletContext';

class SaleStack extends React.Component {
  state = {
    token: null,
    receiver: null
  };

  constructor(props) {
    super(props);
    Object.assign(this.state, {
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
                          amount={ this.props.amount }
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
                                    addMaxAmounts={ true }
                                  >
                                    <RoutesContext.Consumer>
                                      {routesContext => (
                                        <PaymentProvider
                                          selected={ routesContext.selected }
                                          gas={ gasContext.selected }
                                          price={ priceContext.price }
                                          amount={ amountContext.amount }
                                        >
                                          <PaymentContext.Consumer>
                                            {paymentContext => (
                                                  <Stack
                                                    dialogs={{
                                                      Sale: <SaleDialog
                                                        initializing={ priceContext.initializing || routesContext.initializing || gasContext.initializing || tokenContext.initializing }
                                                        selected={ routesContext.selected }
                                                        token={ tokenContext.token.address }
                                                        paymentContext={ paymentContext }
                                                        receiver={ this.state.receiver }
                                                        wallet={ walletContext.wallet }
                                                        tokenContext={ tokenContext }
                                                        amount={ amountContext.amount }
                                                      />,
                                                      ChangeTokenAmount: <ChangeTokenAmountDialog
                                                        token={ tokenContext.token }
                                                        amount={ amountContext.amount }
                                                        change={ amountContext.change }
                                                        routes={ routesContext.routes }
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
                                                    start={'Sale'}
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

export default SaleStack;
