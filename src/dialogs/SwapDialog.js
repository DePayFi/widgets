import CallbackContext from '../contexts/CallbackContext';
import CheckMarkComponent from '../components/CheckMarkComponent';
import CloseDialogComponent from '../components/CloseDialogComponent';
import DePayV1ProcessorBetaContract from '../contracts/DePayV1ProcessorBetaContract';
import DialogContext from '../contexts/DialogContext';
import Erc20Abi from '../abi/Erc20Abi';
import Exchanges from '../utils/Exchanges';
import NavigateStackContext from '../contexts/NavigateStackContext';
import PaymentDialogSkeleton from '../dialogs/PaymentDialogSkeleton';
import QuestionMarkCircleComponent from '../components/QuestionMarkCircleComponent';
import React from 'react';
import TokenIconComponent from '../components/TokenIconComponent';
import { ETH, MAXINT } from '../utils/Constants';
import { ethers } from 'ethers';

class SwapDialog extends React.Component {
  state={
    approving: null,
    paying: null,
    payed: false
  }

  componentWillUnmount() {
    clearInterval(this.approvalCheckInterval);
  }

  paymentType() {
    if(this.props.selected.token.address === this.props.token) {
      return 'transfer';
    } else {
      return 'swap';
    }
  }

  paymentTypeText() {
    switch (this.paymentType()) {
      case 'transfer':
        return 'via transfer';
      break;
      case 'swap':
        return 'via ' + Exchanges.findByName(this.props.selected.exchange).name();
      break;
    }
  }

  paymentTypeTitle() {
    switch (this.paymentType()) {
      case 'transfer':
        return 'Direct token transfer';
      break;
      case 'swap':
        return 'Token swap via ' + this.props.selected.exchange;
      break;
    }
  }

  paymentTypeLink() {
    switch (this.paymentType()) {
      case 'transfer':
        return 'https://etherscan.io/token/'+this.props.token;
      break;
      case 'swap':
        return Exchanges.findByName(this.props.selected.exchange).linkRoute(this.props.selected);
      break;
    }
  }

  approve(dialogContext) {
    new DePay.ethers.Contract(this.props.selected.token.address, Erc20Abi, DePay.ethers.provider)
      .connect(this.props.wallet.provider().getSigner(0))
      .approve(DePayV1ProcessorBetaContract.address, MAXINT)
      .catch(function(){ 
        clearInterval(this.approvalCheckInterval);
        this.setState({ approving: false });
      }.bind(this))
      .then(function(transaction){
        if(transaction) {
          dialogContext.setClosable(false);
          this.setState({ approving: {
            transactionHash: transaction.hash
          } });
          transaction.wait(1).then(function(){
            this.checkApproved(dialogContext)
          }.bind(this));
        } else {
          dialogContext.setClosable(true);
          this.setState({ approving: false })
        }
      }.bind(this))

    this.approvalCheckInterval = setInterval(function(){
      this.checkApproved(dialogContext);
    }.bind(this), 1000);
  }

  checkApproved(dialogContext) {
    new DePay.ethers.Contract(this.props.selected.token.address, Erc20Abi, DePay.ethers.provider).allowance(this.props.wallet.address(), DePayV1ProcessorBetaContract.address).then(function(amount){
      if(amount.gt(DePay.ethers.BigNumber.from(this.props.selected.amounts[0]))) {
        this.props.selected.approved = true;
        dialogContext.setClosable(true);
        this.setState({ approving: false });
        clearInterval(this.approvalCheckInterval);
      }
    }.bind(this));
  }

  generatePaymentUUID() {
    let now = +(new Date());
    return(ethers.BigNumber.from(this.props.wallet.address()).toString()+''+(now).toString());
  }

  pay(dialogContext, callbackContext) {
    let route;

    // Drop intermediate ETH routes
    // as only start and end ETH is relevant for the smart contract.
    route = this.props.selected.route.filter(function(step, index){
      return index === 0 || 
        index === this.props.selected.route.length-1 || 
        step !== ETH
    }.bind(this));

    // Reduce routes with the same token to direct transfers,
    // as for the smart contract it's not a swap, but a transfer
    if(route.length === 2 && route[0] === route[1]) {
      route = [route[0]];
    }
    
    let amountIn = this.props.selected.amounts[0];
    let amountOut = this.props.selected.amounts[this.props.selected.amounts.length-1];

    let transactionConfiguration = {};
    if(route[0] === ETH) {
      transactionConfiguration.value = amountIn;
    }

    let routerId = 0; // fix on uniswap for now (until mooni bus are fixed)

    let paymentId = this.generatePaymentUUID();

    DePayV1ProcessorBetaContract.connect(this.props.wallet.provider().getSigner(0)).pay(
      route,
      amountIn,
      amountOut,
      this.props.receiver,
      paymentId,
      routerId,
      transactionConfiguration
    )
    .catch(function(){
      Rollbar.error("pay catch", arguments);
      this.setState({ paying: false });
    }.bind(this))
    .then(function(transaction){
      if(transaction) {
        this.setState({ paying: {
          transactionHash: transaction.hash
        } });
        dialogContext.setClosable(false);
        transaction.wait(1).then(function(transaction){
          if(transaction.status === 1) {
            dialogContext.setClosable(true);
            this.setState({
              paying: false,
              payed: true
            });
            setTimeout(function(){
              dialogContext.closeContainer();
              callbackContext.callback();
            }, 1600)
          }
        }.bind(this));
      } else {
        Rollbar.error("pay then", arguments);
        dialogContext.setClosable(true);
        this.setState({ paying: false })
      }
    }.bind(this));

        
  }

  navigateIfActionable(navigate, path, dialogContext) {
    if(this.isActionable(dialogContext) === false){ return }
    navigate(path);
  }

  isActionable(dialogContext) {
    return dialogContext.closable === true && this.state.payed === false
  }

  render() {
    if(this.props.initializing) { 
      return(
        <PaymentDialogSkeleton/>
      ) 
    }

    return (
      <DialogContext.Consumer>
        {dialogContext => (
          <NavigateStackContext.Consumer>
            {navigate => (
              <div className={'Dialog PaymentDialog ' + (this.isActionable(dialogContext) ? '' : 'unactionable')}>
                <div className='DialogHeader'>
                  <CloseDialogComponent/>
                </div>
                <div className='DialogBody HeightAuto'>
                  <div className='Payment' key={ this.props.selected.token.address }>
                    <div className='PaymentRow ChangePaymentRow' onClick={ ()=> this.navigateIfActionable(navigate, 'ChangePaymentToken', dialogContext) }>
                      <div className='PaymentColumn PaymentColumn1'>
                        <TokenIconComponent
                          title={ this.props.selected.token.name }
                          src={ this.props.selected.token.logoURI }
                        />
                      </div>
                      <div className='PaymentColumn PaymentColumn2'>
                        <div className='PaymentDescription'>
                          Payment
                        </div>
                        <div className='PaymentAmountRow1 TextEllipsis'>
                          { this.props.paymentContext.local }
                        </div>
                        <div className='PaymentAmountRow2 TextEllipsis'>
                          { this.props.paymentContext.token }
                        </div>
                      </div>
                      <div className='PaymentColumn PaymentColumn3'>
                        <span className='PaymentAction' title='Change payment'>
                          Change
                        </span>
                      </div>
                    </div>

                    <div className='PaymentRow ChangeNetworkFeeRow' onClick={ ()=> this.navigateIfActionable(navigate, 'ChangeNetworkFee', dialogContext) }>
                      <div className='PaymentColumn PaymentColumn1'>
                        <TokenIconComponent
                          title={ 'Ethereum network fee' }
                          src={ 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAIVBMVEVHcExkgexjf+tifutifurAy/b///+CmO6hsvJxi+zj6PuyVvwSAAAABHRSTlMANYHDscZ74QAAA+NJREFUeNq1ml1y2jAQx+PAATwpB0gmHCANPkAhZgg849g+QDwZnh1o3w29AJNp817aYzayLa8d7YditXqE7i/674fYlXrGrIvrySQMJ5Pbq7Mey7sOW+vW72XeH3ERIuvqw3++7ya8ICTWnd/XHgj97YEg2zsRxqGwZrz9p1Bcnzn789BiXcoO6O2GUWi1pqwAFxFagCwCtx9g//Y+xz69sd/Aas1uQU6Bh4RLBnkDiyw6ylsAD5gKsqhAv7ixDMEhi2I6EPIGllkWRSG5BbkK5wpQ2FSlh/+ZrQKk+He+TRWcFCChKkJ24X2mAFFOuFEuoxcFIDVcygoeFIDWICpYZApAaxAVrDRgTWgQFZQARoOoQAOiI6/BIxQAoOBzaYB/fQBATNQD64LlCQAR74SAKKQKwGi44wsJAHRBcS44tQEJ54QRUUgNgE7GKXOWvGgAp2HG+PChC0hoL3pEGmoAq8EnK2n1HrAm62lIpCEAmGT8QgVhmbUBdEFNqSCsTEBBhSFgFQAgpsJApiEAmIIiojjPAMBr8PEobjFAisdxwCvY7BtAgpfTEC0kvR6jHRByNBGGTCFlv6JoB4Q1ChhhhdTYvwHeCIyGKZZHi8a+Auy+0sk4wwCrtv93LUKBAQLyPNcAIMRYKgZ4IW0iAADhaAWYl/YNQBP2tQYZcFDhfw+oghFbAU61PQCAgFSTqaAMHwA6hMICsG3sAdA4IrUARN216xIsAD84gBlHxInPNOCbGAWTYNrLgOX+HQDsZQAQTEBoB1B+WmCAEm0CxoYHFOHeBKiPl98tzoP5UyeYnQDuCxMwMmvhT7mRLuBn+VmCHGlD5Ej93SLUAah2lfKnMhzqKYSitq/8kiOAAXooFw2hsV+gx/IN9tP2+nYi5cpEA3Rk19hPm4cf6486mMpeb+eINklEd/BYB1MHkOgQmgbD/GGog7nLm5AUeIMxJjqkOphVAOkfJmiyzJ+WtHvGxESTNaQ7FLVnKK2CaPPO6Q5jU7TsE6rR9JgeZ5PD4ZCSA0NA9ShVOujDJSdHljHXrD89cx3SjB44XsVmGwaOgVW7f6RHHq//wOFzV1hdQEEOLFLDzzb77Oh7aANidvT1+k6ufjP+95ud74QLiC0AUuEC4pyZXZmZ71K6hCk1sFMnaKCnX14BaCDTWVYgzM+cAlHDqgIUggJ+AicvgXybC8mDAsRWzwSDD95owpWolM5sGstb2GY6CeTL8QDXwB8l8tX4ib8al7fwkqIb+D/PA84PFO5PJM6PNO7PRM4PVe5PZe6Pde7Phc4Plu5Ppu6Ptu7Pxu4P1//g6dz98d7+vw/8BVHcYRQ1d5GsAAAAAElFTkSuQmCC' }
                        />
                      </div>
                      <div className='PaymentColumn PaymentColumn2'>
                        <div className='PaymentDescription'>
                          Network fee
                        </div>
                        <div className='PaymentAmountRow1 TextEllipsis'>
                          { this.props.paymentContext.feeLocal }
                        </div>
                        <div className='PaymentAmountRow2 TextEllipsis'>
                          { this.props.paymentContext.feeToken }
                        </div>
                      </div>
                      <div className='PaymentColumn PaymentColumn3'>
                        <span className='PaymentAction' title='Change network fee'>
                          Change
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='DialogFooter'>
                  { this.renderCallToAction.bind(this)() }
                  <div className='PoweredBy'>
                    {this.paymentType() &&
                      <span>
                        <a target='_blank' rel='noopener noreferrer' href={ this.paymentTypeLink() } className='PoweredByLink' title={ this.paymentTypeTitle() }>
                          { this.paymentTypeText() }
                        </a>
                        <span className='PoweredByLink'>&nbsp;•&nbsp;</span>
                      </span>
                    }
                    <a target='_blank' rel='noopener noreferrer' href='https://depay.app' className='PoweredByLink' title='Powered by DePay: Decentralized Payments'>
                      by DePay
                    </a>
                  </div>
                </div>
              </div>
            )}
          </NavigateStackContext.Consumer>
        )}
      </DialogContext.Consumer>
    )
  }

  renderCallToAction() {
    if(this.props.selected.approved) {
      return(this.renderPaymentButton())
    } else {
      return(
        <div className='Table'>
          <div className='TableRow'>
            <div className='TableCell'>
              { this.renderApproveButton() }
            </div>
            <div className='TableCell'>
              <button className='CallToAction disabled'>
                <span className='CallToActionName'>Pay</span> <span className='CallToActionPrice TextEllipsis'>{ this.props.paymentContext.total }</span>
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  renderApproveButton() {
    if(this.state.approving) {
      return(
        <a target='_blank' rel='noopener noreferrer' href={ 'https://etherscan.io/tx/'+this.state.approving.transactionHash } key='approving' className='CallToAction loading' title='Please wait for the approval transaction to be confirmed by the network. Click to open transaction on etherscan.'>
          Approving
          <span className='dot'>.</span>
          <span className='dot'>.</span>
          <span className='dot'>.</span>
        </a>
      )
    } else {
      return(
        <DialogContext.Consumer>
          {dialogContext => (
            <button key='approve' className='CallToAction' onClick={()=>this.approve.bind(this)(dialogContext)} title='Click to approve that the selected token is allowed to be swapped for performing this payment. This approval is only required the first time you pay with the selected token.'>
              Approve
            </button>
          )}
        </DialogContext.Consumer>
      )
    }
  }

  renderPaymentButton() {
    if(this.state.payed) {
      return(
        <DialogContext.Consumer>
          {dialogContext => (
            <span className='CallToAction circular' onClick={ dialogContext.closeContainer }>
              <CheckMarkComponent className="large"/>
            </span>
          )}
        </DialogContext.Consumer>
      )
    } else if(this.state.paying) {
      return(
        <a target='_blank' rel='noopener noreferrer' href={ 'https://etherscan.io/tx/'+this.state.paying.transactionHash } key='approving' className='CallToAction loading' title='Please wait payment transaction to be confirmed by the network. Click to open transaction on etherscan.'>
          Paying
          <span className='dot'>.</span>
          <span className='dot'>.</span>
          <span className='dot'>.</span>
        </a>
      )
    } else {
      return(
        <DialogContext.Consumer>
          {dialogContext => (
            <CallbackContext.Consumer>
              {callbackContext => (
                <button className='CallToAction' onClick={()=>this.pay.bind(this)(dialogContext, callbackContext)}>
                  Pay { this.props.paymentContext.total }
                </button>
              )}
            </CallbackContext.Consumer>
          )}
        </DialogContext.Consumer>
      )
    }
  }

}

export default SwapDialog;
