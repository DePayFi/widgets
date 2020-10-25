import ChangeNetworkFeeDialog from '../dialogs/ChangeNetworkFeeDialog';
import ChangePaymentTokenDialog from '../dialogs/ChangePaymentTokenDialog';
import DialogContext from '../contexts/DialogContext';
import GasContext from '../contexts/GasContext';
import NavigateStackContext from '../contexts/NavigateStackContext';
import GasProvider from '../providers/GasProvider';
import PaymentContext from '../contexts/PaymentContext';
import PaymentProvider from '../providers/PaymentProvider';
import PriceContext from '../contexts/PriceContext';
import PriceProvider from '../providers/PriceProvider';
import React from 'react';
import RoutesContext from '../contexts/RoutesContext';
import RoutesProvider from '../providers/RoutesProvider';
import Stack from '../utils/Stack';
import SwapDialog from '../dialogs/SwapDialog';
import TokenSelectorDialog from '../dialogs/TokenSelectorDialog';
import WalletContext from '../contexts/WalletContext';
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
    Object.assign(this.state, {
      from: {"name": "Ether","symbol": "ETH","address": "0x0000000000000000000000000000000000000000","decimals": 18,"chainId": 1,"logoURI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC"}
    })
  }

  changeToToken(token, navigate) {
    this.setState({ 
      to: token,
      toAmount: null
    });
    navigate('back');
  }

  changeFromToken(token, navigate) {
    this.setState({ 
      from: token,
      fromAmount: null
    });
    navigate('back');
  }

  render() {
    return (
      <DialogContext.Consumer>
        {dialogContext => (
          <WalletContext.Consumer>
            {walletContext => (
              <Stack
                dialogs={{
                  Swap: <SwapDialog
                    initializing={ false }
                    from={ this.state.from }
                    fromAmount={ this.state.fromAmount }
                    to={ this.state.to }
                    toAmount={ this.state.toAmount }
                    selected = { null }
                    receiver={ walletContext.wallet.address() }
                    wallet={ walletContext.wallet }
                  />,
                  ChangeToToken: <NavigateStackContext.Consumer>
                    {navigate => (
                      <TokenSelectorDialog
                        dialogContext= { dialogContext }
                        callback={ (token)=> this.changeToToken.bind(this)(token, navigate)}
                      />
                    )}
                  </NavigateStackContext.Consumer>,
                  ChangeFromToken: <NavigateStackContext.Consumer>
                    {navigate => (
                      <TokenSelectorDialog
                        dialogContext= { dialogContext }
                        callback={ (token)=> this.changeFromToken.bind(this)(token, navigate)}
                      />
                    )}
                  </NavigateStackContext.Consumer>
                }}
                start={'Swap'}
              />
            )}
          </WalletContext.Consumer>
        )}
      </DialogContext.Consumer>
    );
  }
}

export default SwapStack;
