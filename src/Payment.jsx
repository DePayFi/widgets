import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import mount from './helpers/mount'
import PaymentProvider from './providers/PaymentProvider'
import PaymentStack from './stacks/PaymentStack'
import React from 'react'
import RoutingProvider from './providers/RoutingProvider'
import ToTokenProvider from './providers/ToTokenProvider'
import UpdateProvider from './providers/UpdateProvider'
import WalletProvider from './providers/WalletProvider'

let preflight = async({ accept }) => {
  accept.forEach((configuration)=>{
    if(typeof configuration.blockchain === 'undefined') { throw('DePayWidgets.Payment: You need to set the blockchain your want to receive the payment on!') }
    if(!['ethereum', 'bsc'].includes(configuration.blockchain)) { throw('DePayWidgets.Payment: You need to set a supported blockchain!') }
    if(typeof configuration.amount === 'undefined') { throw('DePayWidgets.Payment: You need to set the amount you want to receive as payment!') }
    if(typeof configuration.token === 'undefined') { throw('DePayWidgets.Payment: You need to set the token you want to receive as payment!') }
    if(typeof configuration.receiver === 'undefined') { throw('DePayWidgets.Payment: You need to set the receiver address that you want to receive the payment!') }
  })
}

let Payment = async ({
  accept,
  event,
  sent,
  confirmed,
  ensured,
  failed,
  error,
  critical,
  style,
  whitelist,
  providers,
  currency,
  document
}) => {

  try {
    await preflight({ accept })
    mount({ style, document: ensureDocument(document) }, (unmount)=> {
      return (container)=>
        <ErrorProvider error={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider configuration={ { accept, currency, event, sent, confirmed, ensured, failed, whitelist, providers } }>
            <ClosableProvider unmount={ unmount }>
              <UpdateProvider>
                <WalletProvider>
                  <RoutingProvider>
                    <PaymentProvider>
                      <ToTokenProvider>
                        <PaymentStack
                          document={ document }
                          container={ container }
                        />
                      </ToTokenProvider>
                    </PaymentProvider>
                  </RoutingProvider>
                </WalletProvider>
              </UpdateProvider>
            </ClosableProvider>
          </ConfigurationProvider>
        </ErrorProvider>
    })
  } catch (error) {
    console.log('critical error', error)
    if(critical != undefined) {
      critical(error)
    }
  }
}

export default Payment
