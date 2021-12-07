import ChangableAmountProvider from './providers/ChangableAmountProvider'
import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import ConversionRateProvider from './providers/ConversionRateProvider'
import DonationRoutingProvider from './providers/DonationRoutingProvider'
import DonationStack from './stacks/DonationStack'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import mount from './helpers/mount'
import PoweredBy from './components/PoweredBy'
import React from 'react'
import TrackingProvider from './providers/TrackingProvider'
import UpdatableProvider from './providers/UpdatableProvider'
import WalletProvider from './providers/WalletProvider'

let preflight = async({ accept }) => {
  if(!(accept instanceof Array) || accept.length == 0) { throw('You need to set the tokens you accept as donation!') }
  accept.forEach((configuration)=>{
    if(typeof configuration.blockchain === 'undefined') { throw('You need to set the blockchain you want to receive the donation on!') }
    if(!['ethereum', 'bsc'].includes(configuration.blockchain)) { throw('You need to set a supported blockchain!') }
    if(typeof configuration.token === 'undefined') { throw('You need to set the token you want to receive as donation!') }
    if(typeof configuration.receiver === 'undefined') { throw('You need to set the receiver address that you want to receive the donation!') }
  })
}

let Donation = async ({
  amount,
  accept,
  event,
  sent,
  confirmed,
  failed,
  error,
  critical,
  style,
  blacklist,
  providers,
  currency,
  connected,
  closed,
  document
}) => {

  try {
    await preflight({ accept })
    let unmount = mount({ style, document: ensureDocument(document), closed }, (unmount)=> {
      return (container)=>
        <ErrorProvider error={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider configuration={{ amount, accept, currency, event, sent, confirmed, failed, blacklist, providers }}>
            <UpdatableProvider>
              <ClosableProvider unmount={ unmount }>
                <WalletProvider container={ container } connected={ connected } unmount={ unmount }>
                  <ConversionRateProvider>
                    <ChangableAmountProvider accept={ accept }>
                      <TrackingProvider document={ ensureDocument(document) }>
                        <DonationRoutingProvider container={ container } document={ document }>
                          <DonationStack
                            document={ document }
                            container={ container }
                          />
                          <PoweredBy/>
                        </DonationRoutingProvider>
                      </TrackingProvider>
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

export default Donation
