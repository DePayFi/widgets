import ChangeNetworkFeeDialog from '../dialogs/ChangeNetworkFeeDialog';
import ChangePaymentTokenDialog from '../dialogs/ChangePaymentTokenDialog';
import GasContext from '../contexts/GasContext';
import GasProvider from '../providers/GasProvider';
import PaymentContext from '../contexts/PaymentContext';
import PaymentDialog from '../dialogs/PaymentDialog';
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
                  <PaymentContext.Provider value={{
                    amount: this.state.amount,
                    token: this.state.token,
                    receiver: this.state.receiver
                  }}>
                    <WalletContext.Consumer>
                      {walletContext => (
                        <RoutesProvider
                          token={ this.state.token }
                          amount={ this.state.amount }
                          address={ walletContext.address }
                        >
                          <RoutesContext.Consumer>
                            {routesContext => (
                              <Stack
                                dialogs={{
                                  Payment: <PaymentDialog
                                    initializing={ priceContext.initializing || routesContext.initializing || gasContext.initializing }
                                    routes={ routesContext.routes }
                                    selected={ routesContext.selected }
                                    price={ priceContext.price }
                                  />,
                                  ChangePaymentToken: <ChangePaymentTokenDialog
                                    routes={ routesContext.routes }
                                    change={ routesContext.change }
                                    price={ priceContext.price }
                                  />,
                                  ChangeNetworkFee: <ChangeNetworkFeeDialog
                                    price={ priceContext.price }
                                  />
                                }}
                                start={'Payment'}
                              />
                            )}
                          </RoutesContext.Consumer>
                        </RoutesProvider>
                      )}
                    </WalletContext.Consumer>
                  </PaymentContext.Provider>
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
