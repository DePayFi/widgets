import ChangableAmountProvider from './providers/ChangableAmountProvider'
import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import ConversionRateProvider from './providers/ConversionRateProvider'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import mount from './helpers/mount'
import PaymentAmountRoutingProvider from './providers/PaymentAmountRoutingProvider'
import PaymentProvider from './providers/PaymentProvider'
import PaymentStack from './stacks/PaymentStack'
import PaymentValueProvider from './providers/PaymentValueProvider'
import PoweredBy from './components/PoweredBy'
import React from 'react'
import TrackingProvider from './providers/TrackingProvider'
import UpdatableProvider from './providers/UpdatableProvider'
import WalletProvider from './providers/WalletProvider'

let preflight = async({ accept }) => {
  accept.forEach((configuration)=>{
    if(typeof configuration.blockchain === 'undefined') { throw('You need to set the blockchain your want to receive the payment on!') }
    if(!['ethereum', 'bsc'].includes(configuration.blockchain)) { throw('You need to set a supported blockchain!') }
    if(typeof configuration.token === 'undefined') { throw('You need to set the token you want to receive as payment!') }
    if(typeof configuration.receiver === 'undefined') { throw('You need to set the receiver address that you want to receive the payment!') }
  })
}

let Payment = async ({
  accept,
  amount,
  event,
  sent,
  confirmed,
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
  document
}) => {

  try {
    await preflight({ accept })
    let unmount = mount({ style, document: ensureDocument(document), closed }, (unmount)=> {
      return (container)=>
        <ErrorProvider error={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider configuration={ { amount, accept, currency, event, sent, confirmed, failed, whitelist, blacklist, providers, track } }>
            <UpdatableProvider>
              <ClosableProvider unmount={ unmount }>
                <WalletProvider document={ document } container={ container } connected={ connected } unmount={ unmount }>
                  <ConversionRateProvider>
                    <ChangableAmountProvider accept={ accept }>
                      <PaymentAmountRoutingProvider accept={ accept } whitelist={ whitelist } blacklist={ blacklist } event={ event }>
                        <TrackingProvider>
                          <PaymentProvider container={ container } document={ document }>
                            <PaymentValueProvider>
                                <PaymentStack
                                  document={ document }
                                  container={ container }
                                />
                                <PoweredBy/>
                            </PaymentValueProvider>
                          </PaymentProvider>
                        </TrackingProvider>
                      </PaymentAmountRoutingProvider>
                    </ChangableAmountProvider>
                  </ConversionRateProvider>
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

export default Payment
