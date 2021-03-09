import _ from 'lodash';
import CallbackContext from '../contexts/CallbackContext';
import CheckMarkComponent from '../components/CheckMarkComponent';
import CloseDialogComponent from '../components/CloseDialogComponent';
import DePayRouterV1Contract from '../contracts/DePayRouterV1Contract';
import DialogContext from '../contexts/DialogContext';
import DisplayTokenAmount from '../utils/DisplayTokenAmount';
import Erc20Abi from '../abi/Erc20Abi';
import EthersProvider from '../utils/EthersProvider';
import Exchanges from '../utils/Exchanges';
import NavigateStackContext from '../contexts/NavigateStackContext';
import NotEnoughFundsDialog from '../dialogs/NotEnoughFundsDialog';
import QuestionMarkCircleComponent from '../components/QuestionMarkCircleComponent';
import React from 'react';
import DonationDialogSkeleton from '../dialogs/DonationDialogSkeleton';
import TokenIconComponent from '../components/TokenIconComponent';
import { ETH, MAXINT } from '../utils/Constants';
import { ethers } from 'ethers';

class DonationDialog extends React.Component {
  state={
    approving: null,
    paying: null,
    payed: false
  }

  componentWillUnmount() {
    clearInterval(this.approvalCheckInterval);
  }

  paymentType() {
    if(this.props.selected.token.address === this.props.receiverToken.address) {
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
        return 'https://etherscan.io/token/'+this.props.receiverToken.address;
      break;
      case 'swap':
        return Exchanges.findByName(this.props.selected.exchange).linkRoute(this.props.selected);
      break;
    }
  }

  approve(dialogContext) {
    new ethers.Contract(this.props.selected.token.address, Erc20Abi, EthersProvider)
      .connect(this.props.wallet.provider().getSigner(0))
      .approve(DePayRouterV1Contract.address, MAXINT)
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
    new ethers.Contract(this.props.selected.token.address, Erc20Abi, EthersProvider).allowance(this.props.wallet.address(), DePayRouterV1Contract.address).then(function(amount){
      if(amount.gt(ethers.BigNumber.from(this.props.selected.amounts[0]))) {
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

    route = this.props.selected.route;
    
    // Reduce routes with the same token to direct transfers,
    // as for the smart contract it's not a swap, but a transfer
    if(this.paymentType() === 'transfer') {
      route = [route[0]];
    }

    let amountIn = this.props.selected.amounts[0];
    let amountOut = this.props.selected.amounts[this.props.selected.amounts.length-1];

    let transactionConfiguration = {};
      
    if(route[0] === ETH) {
      transactionConfiguration.value = amountIn;
    }

    let deadline = Math.round(new Date().getTime() / 1000) + (24 * 3600); // 24 hours from now

    let value = 0;
    if(route[0] === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') { value = amountIn }

    let plugins = ['0x99F3F4685a7178F26EB4F4Ca8B75a1724F1577B9'];
    let exchange = Exchanges.findByName(this.props.selected.exchange);
    if(exchange && this.paymentType() != 'transfer') {
      plugins.unshift(exchange.pluginAddress()); // only add exchange plugin if swap is nessary
    }

    DePayRouterV1Contract.connect(this.props.wallet.provider().getSigner(0)).route(
      route,
      [amountIn, amountOut, deadline],
      [this.props.receiver],
      plugins,
      ([]),
      { value: value }
    )
    .catch(function(){
      console.log("pay catch", arguments);
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
              payed: { transactionHash: transaction.transactionHash }
            });
            setTimeout(function(){
              if(typeof callbackContext.callback === 'function') {
                callbackContext.callback({tx: transaction.transactionHash});
              }
            }, 1600)
          }
        }.bind(this));
      } else {
        console.log("pay then", arguments);
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
        <DonationDialogSkeleton/>
      ) 
    }

    if(!this.props.selected) {
      return(
        <NotEnoughFundsDialog/>
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
                  <div className='Payment' key={ this.props.receiverToken.address }>
                    <div className='PaymentRow ChangeTokenAmount' onClick={ ()=> this.navigateIfActionable(navigate, 'ChangeTokenAmount', dialogContext) }>
                      <div className='PaymentColumn PaymentColumn1'>
                        <TokenIconComponent
                          title={ this.props.receiverToken.name }
                          src={ this.props.receiverToken.logoURI }
                        />
                      </div>
                      <div className='PaymentColumn PaymentColumn2'>
                        <div className='PaymentDescription'>
                          { this.props.action || 'Donation' }
                        </div>
                        <div className='PaymentAmountRow1 TextEllipsis' title={DisplayTokenAmount(this.props.receiverAmount, this.props.receiverToken.decimals, this.props.receiverToken.symbol)}>
                          { DisplayTokenAmount(this.props.receiverAmount, this.props.receiverToken.decimals, this.props.receiverToken.symbol) }
                        </div>
                        <div className='PaymentAmountRow2 TextEllipsis'>
                          { this.props.receiverToken.name }
                        </div>
                      </div>
                      <div className='PaymentColumn PaymentColumn3'>
                        <span className='PaymentAction' title='Change amount'>
                          Change
                        </span>
                      </div>
                    </div>

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
                          { this.props.paymentContext.token }
                        </div>
                        <div className='PaymentAmountRow2 TextEllipsis'>
                          { this.props.paymentContext.local }
                        </div>
                      </div>
                      <div className='PaymentColumn PaymentColumn3'>
                        <span className='PaymentAction' title='Change payment'>
                          Change
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
                <div className='DialogFooter'>
                  { this.renderCallToAction.bind(this)() }
                  <div className='PoweredBy'>
                    { this.renderTransaction.bind(this)() }
                    {this.paymentType() &&
                      <span>
                        <a target='_blank' rel='noopener noreferrer' href={ this.paymentTypeLink() } className='PoweredByLink' title={ this.paymentTypeTitle() }>
                          { this.paymentTypeText() }
                        </a>
                        <span className='PoweredByLink'>&nbsp;•&nbsp;</span>
                      </span>
                    }
                    <a target='_blank' rel='noopener noreferrer' href={'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=DePayPayment'} className='PoweredByLink' title='Powered by DePay: Decentralized Payments'>
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

  renderTransaction() {
    if((this.state.paying && this.state.paying.transactionHash) || (this.state.payed && this.state.payed.transactionHash)) {
      let transactionHash = (this.state.paying && this.state.paying.transactionHash) || (this.state.payed && this.state.payed.transactionHash);
      return(
        <span>
          <a target='_blank' rel='noopener noreferrer' href={ 'https://etherscan.io/tx/'+transactionHash } className='PoweredByLink' title='Your transaction'>
            tx
          </a>
          <span className='PoweredByLink'>&nbsp;•&nbsp;</span>
        </span>
      )
    } else {
      return
    }
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
              <button className='CallToAction MainAction disabled'>
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
        <a target='_blank' rel='noopener noreferrer' href={ 'https://etherscan.io/tx/'+this.state.approving.transactionHash } key='approving' className='CallToAction MainAction loading' title='Please wait for the approval transaction to be confirmed by the network. Click to open transaction on etherscan.'>
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
            <button key='approve' className='CallToAction MainAction' onClick={()=>this.approve.bind(this)(dialogContext)} title='Click to approve that the selected token is allowed to be swapped for performing this payment. This approval is only required the first time you pay with the selected token.'>
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
            <span className='CallToAction MainAction circular' onClick={ dialogContext.closeContainer }>
              <CheckMarkComponent className="large"/>
            </span>
          )}
        </DialogContext.Consumer>
      )
    } else if(this.state.paying) {
      return(
        <a target='_blank' rel='noopener noreferrer' href={ 'https://etherscan.io/tx/'+this.state.paying.transactionHash } key='approving' className='CallToAction MainAction loading' title='Please wait payment transaction to be confirmed by the network. Click to open transaction on etherscan.'>
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
                <button className='CallToAction MainAction' onClick={()=>this.pay.bind(this)(dialogContext, callbackContext)}>
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

export default DonationDialog;
