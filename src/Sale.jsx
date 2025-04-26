import ChangableAmountProvider from './providers/ChangableAmountProvider'
import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import ConversionRateProvider from './providers/ConversionRateProvider'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import mount from './helpers/mount'
import NavigateProvider from './providers/NavigateProvider'
import PaymentTrackingProvider from './providers/PaymentTrackingProvider'
import PoweredBy from './components/PoweredBy'
import React from 'react'
import requireReactVersion from './helpers/requireReactVersion'
import SaleRoutingProvider from './providers/SaleRoutingProvider'
import SaleStack from './stacks/SaleStack'
import UpdatableProvider from './providers/UpdatableProvider'
import WalletProvider from './providers/WalletProvider'

let preflight = async({ sell }) => {
  if(typeof sell != 'object') { throw('You need to configure at least 1 "blockchain": "token"') }
  if(Object.keys(sell).length == 0) { throw('You need to configure at least 1 "blockchain": "token"') }
  if(Object.values(sell).length == 0) { throw('You need to configure at least 1 "blockchain": "token"') }
}

let Sale = async ({
  amount,
  sell,
  sent,
  succeeded,
  failed,
  error,
  critical,
  style,
  blacklist,
  before,
  providers,
  currency,
  connected,
  closed,
  tokenImage,
  closable,
  integration,
  wallet,
  document
}) => {
  requireReactVersion()
  try {
    await preflight({ sell })
    const accept = Object.keys(sell).map((key)=>({ blockchain: key, token: sell[key] }))
    blacklist = Object.assign(blacklist || {})
    Object.keys(sell).forEach((key)=>{
      if(!blacklist[key]) { blacklist[key] = [] }
      blacklist[key].push(sell[key])
    })
    let unmount = mount({ style, document: ensureDocument(document), closed }, (unmount)=> {
      return (container)=>
        <ErrorProvider errorCallback={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider configuration={{ type: 'sale', accept, before, tokenImage, amount, sell, currency, sent, succeeded, failed, blacklist, providers, integration, wallet }}>
            <UpdatableProvider>
              <ClosableProvider unmount={ unmount } closable={ closable }>
                <WalletProvider container={ container } connected={ connected } unmount={ unmount }>
                  <NavigateProvider>
                    <ConversionRateProvider>
                      <ChangableAmountProvider>
                        <PaymentTrackingProvider document={ ensureDocument(document) }>
                          <SaleRoutingProvider container={ container } document={ document }>
                            <SaleStack
                              document={ document }
                              container={ container }
                            />
                            <PoweredBy/>
                          </SaleRoutingProvider>
                        </PaymentTrackingProvider>
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

export default Sale
