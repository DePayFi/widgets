import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import DonationRoutingProvider from './providers/DonationRoutingProvider'
import DonationStack from './stacks/DonationStack'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import mount from './helpers/mount'
import React from 'react'
import UpdateProvider from './providers/UpdateProvider'
import WalletProvider from './providers/WalletProvider'

let preflight = async({ amount, token, blockchains, receiver }) => {
  if(typeof amount === 'undefined') { throw('You need to set the amount!') }
  if(typeof amount.min === 'undefined') { throw('You need to set amount.min!') }
  if(typeof amount.step === 'undefined') { throw('You need to set amount.step!') }
  if(typeof amount.start === 'undefined') { throw('You need to set amount.start!') }
  if(typeof token == 'undefined') { throw('You need to set a token!') }
  if((typeof blockchains == 'undefined') || blockchains.length == 0) { throw('You need to set blockchains!') }
  blockchains.forEach((blockchain)=>{
    if(!['ethereum', 'bsc'].includes(blockchain)) { throw('You need to set only supported blockchains!') }  
  })
  if((typeof receiver == 'undefined') || receiver.length == 0) { throw('You need to set a receiver!') }
}

let Donation = async ({
  amount,
  token,
  receiver,
  blockchains,
  event,
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
  document
}) => {

  try {
    await preflight({ amount, token, blockchains, receiver })
    let unmount = mount({ style, document: ensureDocument(document), closed }, (unmount)=> {
      return (container)=>
        <ErrorProvider error={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider configuration={{ amount, token, receiver, blockchains, currency, event, sent, confirmed, ensured, failed, blacklist, providers }}>
            <ClosableProvider unmount={ unmount }>
              <UpdateProvider>
                <WalletProvider container={ container } connected={ connected } unmount={ unmount }>
                  <DonationRoutingProvider container={ container } document={ document }>
                    <DonationStack
                      document={ document }
                      container={ container }
                    />
                  </DonationRoutingProvider>
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

export default Donation
