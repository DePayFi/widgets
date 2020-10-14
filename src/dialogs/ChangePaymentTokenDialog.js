import CloseDialogComponent from '../components/CloseDialogComponent';
import DisplayTokenAmount from '../utils/DisplayTokenAmount';
import GoBackDialogComponent from '../components/GoBackDialogComponent';
import LocalCurrency from '../utils/LocalCurrency';
import NavigateStackContext from '../contexts/NavigateStackContext';
import React from 'react';
import TokenIconComponent from '../components/TokenIconComponent';

class ChangePaymentTokenDialog extends React.Component {

  selectNewRoute(index, navigate) {
    this.props.change(index);
    navigate('back');
  }
  
  render() {

    return (
      <NavigateStackContext.Consumer>
        {navigate => (
          <div className='Dialog ChangePaymentDialog'>
            <div className='DialogHeader'>
              <GoBackDialogComponent/>
              <CloseDialogComponent/>
              <h1 className='FontSizeMedium TextAlignCenter'>Change payment</h1>
              <div className='FontSizeMedium FontWeightBold TextAlignCenter'>
                { this.props.paymentContext.local }
              </div>
            </div>
            <div className='DialogBody'>
              {this.props.routes.map((route, index) => {
                
                const totalDisplayed = DisplayTokenAmount(route.balance, route.token.decimals, route.token.symbol)
                const displayedTokenAmount = DisplayTokenAmount(route.amounts[0], route.token.decimals, route.token.symbol)

                return(
                  <div className='Payment' key={index}>

                    <div className='PaymentRow ChangePaymentRow' onClick={ ()=> this.selectNewRoute(index, navigate) }>
                      <div className='PaymentColumn PaymentColumn1'>
                        <TokenIconComponent
                          title={ route.token.name }
                          src={ route.token.logoURI }
                        />
                      </div>
                      <div className='PaymentColumn PaymentColumn2'>
                        <div className='PaymentDescription TextEllipsis'>
                          { route.token.name }
                        </div>
                        <div className='PaymentAmountRow1 TextEllipsis'>
                          { displayedTokenAmount }
                        </div>
                        <div className='PaymentAmountRow2 TextEllipsis'>
                          { totalDisplayed }
                        </div>
                      </div>
                      <div className='PaymentColumn PaymentColumn3'>
                        <span className='PaymentAction' title='Select for payment'>
                          Select
                        </span>
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
            <div className='DialogFooter'>
              <div className='PoweredBy'>
                <a target='_blank' rel='noopener noreferrer' href='https://depay.app' className='PoweredByLink' title='Powered by DePay: Decentralized Payments'>
                  by DePay
                </a>
              </div>
            </div>
          </div>
        )}
      </NavigateStackContext.Consumer>
    )
  }
}

export default ChangePaymentTokenDialog;
