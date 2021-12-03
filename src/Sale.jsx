import ChangableAmountProvider from './providers/ChangableAmountProvider'
import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import ConversionRateProvider from './providers/ConversionRateProvider'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import mount from './helpers/mount'
import PoweredBy from './components/PoweredBy'
import React from 'react'
import SaleRoutingProvider from './providers/SaleRoutingProvider'
import SaleStack from './stacks/SaleStack'
import TrackingProvider from './providers/TrackingProvider'
import UpdateProvider from './providers/UpdateProvider'
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
  confirmed,
  ensured,
  failed,
  error,
  critical,
  style,
  blacklist,
  providers,
  currency,
  connected,
  closed,
  tokenImage,
  document
}) => {
  try {
    await preflight({ sell })
    const accept = Object.keys(sell).map((key)=>({ blockchain: key, token: sell[key] }))
    let unmount = mount({ style, document: ensureDocument(document), closed }, (unmount)=> {
      return (container)=>
        <ErrorProvider error={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider configuration={{ tokenImage, amount, sell, currency, sent, confirmed, ensured, failed, blacklist, providers }}>
            <ClosableProvider unmount={ unmount }>
              <UpdateProvider>
                <WalletProvider container={ container } connected={ connected } unmount={ unmount }>
                  <ConversionRateProvider>
                    <ChangableAmountProvider accept={ accept }>
                      <TrackingProvider>
                        <SaleRoutingProvider container={ container } document={ document }>
                          <SaleStack
                            document={ document }
                            container={ container }
                          />
                          <PoweredBy/>
                        </SaleRoutingProvider>
                      </TrackingProvider>
                    </ChangableAmountProvider>
                  </ConversionRateProvider>
                </WalletProvider>
              </UpdateProvider>
            </ClosableProvider>
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
