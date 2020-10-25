import CallbackContext from '../contexts/CallbackContext';
import CheckMarkComponent from '../components/CheckMarkComponent';
import CloseDialogComponent from '../components/CloseDialogComponent';
import DePayV1ProcessorBetaContract from '../contracts/DePayV1ProcessorBetaContract';
import DialogContext from '../contexts/DialogContext';
import Erc20Abi from '../abi/Erc20Abi';
import ExchangeComponent from '../components/ExchangeComponent';
import Exchanges from '../utils/Exchanges';
import NavigateStackContext from '../contexts/NavigateStackContext';
import QuestionMarkCircleComponent from '../components/QuestionMarkCircleComponent';
import React from 'react';
import SwapDialogSkeleton from '../dialogs/SwapDialogSkeleton';
import TokenIconComponent from '../components/TokenIconComponent';
import { ETH, MAXINT } from '../utils/Constants';
import { ethers } from 'ethers';

class SwapDialog extends React.Component {
  state={
    approving: null,
    paying: null,
    payed: false
  }

  constructor(props) {
    super(props);
    this.toTokenAmount = React.createRef();
  }

  componentWillUnmount() {
    clearInterval(this.approvalCheckInterval);
  }

  paymentType() {
    return 'swap';
  }

  paymentTypeTitle() {
    return 'Token swap via ' + this.props.selected.exchange;
  }

  paymentTypeLink() {
    return Exchanges.findByName(this.props.selected.exchange).linkRoute(this.props.selected);
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

  componentDidUpdate(prevProps) {
    if(
      (this.props.to && prevProps.to === null) ||
      (this.props.to && prevProps.to.address !== this.props.to.address)
    ) {
      setTimeout(function(){
        this.toTokenAmount.current.focus();
      }.bind(this), 250);
    }
  }

  render() {
    if(this.props.initializing) { 
      return(
        <SwapDialogSkeleton/>
      ) 
    }

    return (
      <DialogContext.Consumer>
        {dialogContext => (
          <NavigateStackContext.Consumer>
            {navigate => (
              <div className={'Dialog SwapDialog ' + (this.isActionable(dialogContext) ? '' : 'unactionable')}>
                <div className='DialogHeader'>
                  <CloseDialogComponent/>
                </div>
                <div className='DialogBody HeightAuto'>
                  <div className='Payment'>
                    <div className='PaymentRow FromRow'>
                      <div className='PaymentColumn PaymentColumn1'>
                        <label htmlFor='TokenSwapFrom'>
                          <TokenIconComponent
                            title={ this.props.from.name }
                            src={ this.props.from.logoURI }
                          />
                        </label>
                      </div>
                      <div className='PaymentColumn PaymentColumn2'>
                        <div className='PaymentDescription'>
                          <label htmlFor='TokenSwapFrom'>
                            From
                          </label>
                        </div>
                        <div className='PaymentAmountRow1 TextEllipsis'>
                          <input name='TokenSwapFrom' id='TokenSwapFrom' className='Input FontSizeMedium' placeholder='0.0' maxLength='79' minLength='1' inputMode='decimal' pattern="^[0-9]*[.,]?[0-9]*$" autocorret='off' />
                        </div>
                        <div className='PaymentAmountRow2 TextEllipsis'>
                          <label htmlFor='TokenSwapFrom'>
                            { this.props.from.symbol }
                          </label>
                        </div>
                      </div>
                      <div className='PaymentColumn PaymentColumn3'>
                        <span className='PaymentAction' title='Set max. amount'>
                          Max
                        </span>
                        <span className='PaymentAction' title='Change token' onClick={ ()=>this.navigateIfActionable(navigate, 'ChangeFromToken', dialogContext) }>
                          Change
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='TextAlignCenter ExchangeRow'>
                    <button className='SwapInputs'>
                      <ExchangeComponent/>
                    </button>
                  </div>

                  <div className='Payment'>

                    <div className='PaymentRow ToRow'>
                      <div className='PaymentColumn PaymentColumn1'>
                        <label htmlFor='TokenSwapTo'>
                          <TokenIconComponent
                            title={ this.props.to ? this.props.to.name : 'Please select a token' }
                            src={ this.props.to ? this.props.to.logoURI : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAGFBMVEVHcEz///////////////////////////8dS1W+AAAAB3RSTlMAHklzmMLqCsLrGwAAAQ9JREFUeNrtlrsOgkAQRRdFbDcae4IFrZEYazXRVitqQ2Hrk/19BVdX7XYuiQX3VDZzMsxrVYQQQkibGIyzLNHi8OHaVJRLWXgwMy8KLYnfGEchEFTxjp2/wHxRalBg9v4CNAXzwxYVXCSC2ypJstx+g6/ATaAdqImvoHxHzEVFcPGqWwtOnoLFx++6DGdgq9NnG+T0K8EVEPTqnrZbEKGCFO1CDs2BG2UZbpnABEwMJIA1IRSeZfdCgV8wsjdVnEBuLyKyBu51Fb+xpfhPRgdsgYqeM6DlQwQmoA62AvISgIsc2j0EaxgDL0ojx/CCCs4KPGYnVHCk4CEg7SbIKqbqfyeRAgoaERBCCCGESLgDeRfMNogh3QMAAAAASUVORK5CYII=' }
                            className={ this.props.to ? '' : 'notfound' }
                          />
                        </label>
                      </div>
                      <div className='PaymentColumn PaymentColumn2'>
                        <div className='PaymentDescription'>
                          <label htmlFor='TokenSwapTo'>
                            To
                          </label>
                        </div>
                        <div className='PaymentAmountRow1 TextEllipsis'>
                          <input ref={this.toTokenAmount} name='TokenSwapTo' id='TokenSwapTo' className='Input FontSizeMedium' placeholder='0.0' maxLength='79' minLength='1' inputMode='decimal' pattern="^[0-9]*[.,]?[0-9]*$" autocorret='off' />
                        </div>
                        <div className='PaymentAmountRow2 TextEllipsis'>
                          <label htmlFor='TokenSwapTo'>
                            { this.props.to && this.props.to.symbol }
                            { !this.props.to && 
                              <span>&nbsp;</span>
                            }
                          </label>
                        </div>
                      </div>
                      <div className='PaymentColumn PaymentColumn3'>
                        { this.props.to &&
                          <span className='PaymentAction' onClick={ ()=>this.navigateIfActionable(navigate, 'ChangeToToken', dialogContext) } title='Change token'>
                            Change
                          </span>
                        }
                        {
                          !this.props.to &&
                          <span className='PaymentAction CallToAction' onClick={ ()=>this.navigateIfActionable(navigate, 'ChangeToToken', dialogContext) } title='Select token'>
                            Select
                          </span> 
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className='DialogFooter'>
                  { this.renderCallToAction.bind(this)() }
                  <div className='PoweredBy'>
                    {this.props.selected && this.paymentType() &&
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
    if(!this.props.selected || this.props.selected.approved) {
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
                <span className='CallToActionName'>Swap</span>
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
            <span className='CallToAction circular' onClick={ dialogContext.closeContainer }>
              <CheckMarkComponent className="large"/>
            </span>
          )}
        </DialogContext.Consumer>
      )
    } else if(this.state.paying) {
      return(
        <a target='_blank' rel='noopener noreferrer' href={ 'https://etherscan.io/tx/'+this.state.paying.transactionHash } key='approving' className='CallToAction loading' title='Please wait payment transaction to be confirmed by the network. Click to open transaction on etherscan.'>
          Swapping
          <span className='dot'>.</span>
          <span className='dot'>.</span>
          <span className='dot'>.</span>
        </a>
      )
    } else if(this.props.selected === null) {
      return(
        <button className='CallToAction MainAction disabled'>
          Swap
        </button>
      )
    } else {
      return(
        <DialogContext.Consumer>
          {dialogContext => (
            <CallbackContext.Consumer>
              {callbackContext => (
                <button className='CallToAction MainAction' onClick={()=>this.pay.bind(this)(dialogContext, callbackContext)}>
                  Swap
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
