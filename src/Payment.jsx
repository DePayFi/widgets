import CallbackProvider from './providers/CallbackProvider'
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
import SUPPORTED_CURRENCIES from './helpers/supportedCurrencies'
import UpdatableProvider from './providers/UpdatableProvider'
import WalletProvider from './providers/WalletProvider'
import { supported } from './blockchains'

let preflight = async({ accept, integration }) => {
  if(typeof integration !== 'undefined' && typeof accept !== 'undefined') { throw('You can either use `integration` or `accept`, but not both!') }
  if(integration){ return }
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
  allow,
  deny,
  whitelist,
  blacklist,
  providers,
  currency,
  connected,
  closed,
  track,
  closable,
  integration,
  payload,
  link,
  container,
  before,
  wallet,
  title,
  action,
  document,
  wallets,
  protocolFee,
}) => {
  requireReactVersion()
  if(currency && !SUPPORTED_CURRENCIES.includes(currency.toLowerCase())) { currency = false }
  try {
    await preflight({ accept, integration })
    if(typeof window._depayUnmountLoading == 'function') { window._depayUnmountLoading() }
    let unmount = mount({ style, container, document: ensureDocument(document), closed }, (unmount)=> {
      return (container)=>
        <ErrorProvider errorCallback={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider unmount={ unmount } document={ document } container={ container } configuration={ { type: 'payment', payload, before, amount, accept, currency, event, sent, succeeded, validated, failed, allow, deny, whitelist, blacklist, providers, track, integration, link, wallet, title, action, wallets, protocolFee } }>
            <CallbackProvider>
              <UpdatableProvider>
                <ClosableProvider unmount={ unmount } closable={ closable }>
                  <NavigateProvider>
                    <WalletProvider document={ document } container={ container } connected={ connected } unmount={ unmount }>
                      <ConversionRateProvider>
                        <ChangableAmountProvider>
                          <PaymentAmountRoutingProvider container={ container } document={ document }>
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
                          </PaymentAmountRoutingProvider>
                        </ChangableAmountProvider>
                      </ConversionRateProvider>
                    </WalletProvider>
                  </NavigateProvider>
                </ClosableProvider>
              </UpdatableProvider>
            </CallbackProvider>
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

export default Payment
