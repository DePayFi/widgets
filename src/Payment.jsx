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
import SolanaPayProvider from './providers/SolanaPayProvider'
import SUPPORTED_CURRENCIES from './helpers/supportedCurrencies'
import TransactionTrackingProvider from './providers/TransactionTrackingProvider'
import UpdatableProvider from './providers/UpdatableProvider'
import WalletProvider from './providers/WalletProvider'
import { supported } from './blockchains'

let preflight = async({ accept, recover, integration }) => {
  if(integration || recover){ return }
  accept.forEach((configuration)=>{
    if(typeof configuration.blockchain === 'undefined') { throw('You need to set the blockchain you want to receive the payment on!') }
    if(!supported.includes(configuration.blockchain)) { throw('You need to set a supported blockchain!') }
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
  recover,
  closable,
  integration,
  payload,
  link,
  container,
  before,
  wallet,
  title,
  action,
  document
}) => {
  requireReactVersion()
  if(currency && !SUPPORTED_CURRENCIES.includes(currency.toLowerCase())) { currency = false }
  try {
    await preflight({ accept, integration, recover })
    if(typeof window._depayUnmountLoading == 'function') { window._depayUnmountLoading() }
    let unmount = mount({ style, container, document: ensureDocument(document), closed }, (unmount)=> {
      return (container)=>
        <ErrorProvider errorCallback={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider unmount={ unmount } document={ document } container={ container } configuration={ { type: 'payment', payload, before, amount, accept, currency, event, sent, succeeded, validated, failed, whitelist, blacklist, providers, track, recover, integration, link, wallet, title, action } }>
            <UpdatableProvider>
              <ClosableProvider unmount={ unmount } closable={ closable }>
                <NavigateProvider>
                  <PoweredBy/>
                  <SolanaPayProvider unmount={ unmount } document={ document } container={ container }>
                    <WalletProvider document={ document } container={ container } connected={ connected } unmount={ unmount }>
                      <ConversionRateProvider>
                        <ChangableAmountProvider>
                          <PaymentAmountRoutingProvider container={ container } document={ document }>
                            <TransactionTrackingProvider>
                              <PaymentTrackingProvider document={ ensureDocument(document) }>
                                <PaymentProvider container={ container } document={ document }>
                                  <PaymentValueProvider>
                                      <PaymentStack
                                        document={ document }
                                        container={ container }
                                      />
                                  </PaymentValueProvider>
                                </PaymentProvider>
                              </PaymentTrackingProvider>
                            </TransactionTrackingProvider>
                          </PaymentAmountRoutingProvider>
                        </ChangableAmountProvider>
                      </ConversionRateProvider>
                    </WalletProvider>
                  </SolanaPayProvider>
                </NavigateProvider>
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

Payment.preload = ({ account, accept, whitelist, blacklist, event }) => { routePayments({ account, accept, whitelist, blacklist }) }

export default Payment
