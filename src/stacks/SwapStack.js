import _ from 'lodash';
import ChangeNetworkFeeDialog from '../dialogs/ChangeNetworkFeeDialog';
import ChangePaymentTokenDialog from '../dialogs/ChangePaymentTokenDialog';
import DialogContext from '../contexts/DialogContext';
import GasContext from '../contexts/GasContext';
import GasProvider from '../providers/GasProvider';
import NavigateStackContext from '../contexts/NavigateStackContext';
import PaymentContext from '../contexts/PaymentContext';
import PaymentProvider from '../providers/PaymentProvider';
import PriceContext from '../contexts/PriceContext';
import PriceProvider from '../providers/PriceProvider';
import React from 'react';
import RouteContext from '../contexts/RouteContext';
import RouteProvider from '../providers/RouteProvider';
import RoutesContext from '../contexts/RoutesContext';
import RoutesProvider from '../providers/RoutesProvider';
import Stack from '../utils/Stack';
import SwapDialog from '../dialogs/SwapDialog';
import TokenSelectorDialog from '../dialogs/TokenSelectorDialog';
import WalletContext from '../contexts/WalletContext';
import WalletTokensContext from '../contexts/WalletTokensContext';
import WalletTokensProvider from '../providers/WalletTokensProvider';
import { ETH, WETH } from '../utils/Constants';

class SwapStack extends React.Component {
  state = {
    from: null,
    fromAmount: null,
    to: null,
    toAmount: null
  };

  constructor(props) {
    super(props);
  }

  changeFromAmount(amount) {
    this.setState({
      fromAmount: amount,
      toAmount: null
    })
  }


  changeToAmount(amount) {
    this.setState({
      toAmount: amount,
      fromAmount: null
    })
  }

  changeToTokenCallback(token, navigate) {
    this.setState({ 
      to: token,
      toAmount: null
    });
    navigate('back');
  }

  changeFromTokenCallback(token, navigate) {
    this.setState({ 
      from: token,
      fromAmount: null
    });
    navigate('back');
  }

  setFirstFromToken(tokens) {
    this.setState({ 
      from: tokens[0]
    });
  }

  swapFromTo() {
    this.setState({
      from: this.state.to,
      to: this.state.from,
      fromAmount: null,
      toAmount: this.state.fromAmount
    })
  }

  swapToFrom() {
    this.setState({
      from: this.state.to,
      to: this.state.from,
      fromAmount: this.state.toAmount,
      toAmount: null
    })
  }

  render() {
    return (
      <DialogContext.Consumer>
        {dialogContext => (
          <WalletContext.Consumer>
            {walletContext => (
              <WalletTokensProvider
                address={ walletContext.address }
                wallet={ walletContext.wallet }
                afterInitialization={ this.setFirstFromToken.bind(this) }
              >
                <WalletTokensContext.Consumer>
                  {walletTokensContext => (
                    <RouteProvider
                      from={ this.state.from ? this.state.from.address : null }
                      fromAmount={ this.state.fromAmount }
                      to={ this.state.to ? this.state.to.address : null }
                      toAmount={ this.state.toAmount }
                      wallet={ walletContext.wallet }
                    >
                      <RouteContext.Consumer>
                        {routeContext => (
                          <Stack
                            dialogs={{
                              Swap: <SwapDialog
                                initializing={ walletTokensContext.initializing }
                                loadingRoute={ routeContext.loading }
                                changeFromAmount={ this.changeFromAmount.bind(this) }
                                changeToAmount={ this.changeToAmount.bind(this) }
                                swapFromTo={ this.swapFromTo.bind(this) }
                                swapToFrom={ this.swapToFrom.bind(this) }
                                from={ this.state.from }
                                fromAmount={ routeContext.fromAmount || this.state.fromAmount }
                                to={ this.state.to }
                                toAmount={ routeContext.toAmount || this.state.toAmount }
                                route = { routeContext.route }
                                receiver={ walletContext.address }
                                wallet={ walletContext.wallet }
                              />,
                              ChangeFromToken: <NavigateStackContext.Consumer>
                                {navigate => (
                                  <TokenSelectorDialog
                                    tokenList={ walletTokensContext.tokens }
                                    disableImportTokens={ true }
                                    dialogContext= { dialogContext }
                                    callback={ (token)=> this.changeFromTokenCallback.bind(this)(token, navigate)}
                                  />
                                )}
                              </NavigateStackContext.Consumer>,
                              ChangeToToken: <NavigateStackContext.Consumer>
                                {navigate => (
                                  <TokenSelectorDialog
                                    dialogContext={ dialogContext }
                                    callback={ (token)=> this.changeToTokenCallback.bind(this)(token, navigate)}
                                  />
                                )}
                              </NavigateStackContext.Consumer>
                            }}
                            start={'Swap'}
                          />
                        )}
                      </RouteContext.Consumer>
                    </RouteProvider>
                  )}
                </WalletTokensContext.Consumer>
              </WalletTokensProvider>
            )}
          </WalletContext.Consumer>
        )}
      </DialogContext.Consumer>
    );
  }
}

export default SwapStack;
