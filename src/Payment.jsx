import ChangableAmountProvider from './providers/ChangableAmountProvider'
import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import ConversionRateProvider from './providers/ConversionRateProvider'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import mount from './helpers/mount'
import NavigateProvider from './providers/NavigateProvider'
import PaymentAmountRoutingProvider from './providers/PaymentAmountRoutingProvider'
import PaymentProvider from './providers/PaymentProvider'
import PaymentStack from './stacks/PaymentStack'
import PaymentTrackingProvider from './providers/PaymentTrackingProvider'
import PaymentValueProvider from './providers/PaymentValueProvider'
import PoweredBy from './components/PoweredBy'
import React from 'react'
import requireReactVersion from './helpers/requireReactVersion'
import routePayments from './helpers/routePayments'
import TransactionTrackingProvider from './providers/TransactionTrackingProvider'
import UpdatableProvider from './providers/UpdatableProvider'
import WalletProvider from './providers/WalletProvider'

let preflight = async({ accept, recover }) => {
  if(recover){ return }
  accept.forEach((configuration)=>{
    if(typeof configuration.blockchain === 'undefined') { throw('You need to set the blockchain your want to receive the payment on!') }
    if(!['ethereum', 'bsc', 'polygon'].includes(configuration.blockchain)) { throw('You need to set a supported blockchain!') }
    if(typeof configuration.token === 'undefined' && typeof configuration.fromToken === 'undefined' && typeof configuration.fromAmount === 'undefined' && typeof configuration.toToken === 'undefined') { throw('You need to set the token you want to receive as payment!') }
    if(typeof configuration.token === 'undefined' && typeof configuration.fromToken !== 'undefined' && typeof configuration.fromAmount === 'undefined' && typeof configuration.toToken === 'undefined') { throw('You need to set the fromToken, fromAmount and toToken!') }
    if(typeof configuration.receiver === 'undefined') { throw('You need to set the receiver address that you want to receive the payment!') }
  })
}

let Payment = async ({
  accept,
  amount,
  sent,
  succeeded,
  validated,
  failed,
  error,
  critical,
  style,
  whitelist,
  blacklist,
  providers,
  currency,
  connected,
  closed,
  track,
  fee,
  recover,
  closable,
  integration,
  link,
  container,
  before,
  wallet,
  document
}) => {
  requireReactVersion()
  try {
    await preflight({ accept, recover })
    if(typeof window._depayUnmountLoading == 'function') { window._depayUnmountLoading() }
    let unmount = mount({ style, container, document: ensureDocument(document), closed }, (unmount)=> {
      return (container)=>
        <ErrorProvider errorCallback={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider configuration={ { type: 'payment', before, amount, accept, currency, event, sent, succeeded, validated, failed, whitelist, blacklist, providers, track, fee, recover, integration, link, wallet } }>
            <UpdatableProvider>
              <ClosableProvider unmount={ unmount } closable={ closable }>
                <WalletProvider document={ document } container={ container } connected={ connected } unmount={ unmount }>
                  <NavigateProvider>
                    <ConversionRateProvider>
                      <ChangableAmountProvider accept={ accept }>
                        <PaymentAmountRoutingProvider accept={ accept } whitelist={ whitelist } blacklist={ blacklist } event={ event } fee={ fee }>
                          <TransactionTrackingProvider>
                            <PaymentTrackingProvider document={ ensureDocument(document) }>
                              <PaymentProvider container={ container } document={ document }>
                                <PaymentValueProvider>
                                    <PaymentStack
                                      document={ document }
                                      container={ container }
                                    />
                                    <PoweredBy/>
                                </PaymentValueProvider>
                              </PaymentProvider>
                            </PaymentTrackingProvider>
                          </TransactionTrackingProvider>
                        </PaymentAmountRoutingProvider>
                      </ChangableAmountProvider>
                    </ConversionRateProvider>
                  </NavigateProvider>
                </WalletProvider>
              </ClosableProvider>
            </UpdatableProvider>
          </ConfigurationProvider>
        </ErrorProvider>
    })
    return { unmount }
  } catch (error) {
    console.log('critical error', error)
    if(critical != undefined) {
      critical(error)
    }
  }
}

Payment.preload = ({ account, accept, whitelist, blacklist, event, fee }) => { routePayments({ account, accept, whitelist, blacklist, fee }) }

export default Payment
