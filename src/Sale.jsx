import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import mount from './helpers/mount'
import React from 'react'
import SaleRoutingProvider from './providers/SaleRoutingProvider'
import SaleStack from './stacks/SaleStack'
import UpdateProvider from './providers/UpdateProvider'
import WalletProvider from './providers/WalletProvider'

let preflight = async({ amount, token, blockchains }) => {
  if(typeof amount === 'undefined') { throw('You need to set the amount!') }
  if(typeof amount.min === 'undefined') { throw('You need to set amount.min!') }
  if(typeof amount.step === 'undefined') { throw('You need to set amount.step!') }
  if(typeof amount.start === 'undefined') { throw('You need to set amount.start!') }
  if(typeof token == 'undefined') { throw('You need to set a token!') }
  if((typeof blockchains == 'undefined') || blockchains.length == 0) { throw('You need to set blockchains!') }
  blockchains.forEach((blockchain)=>{
    if(!['ethereum', 'bsc'].includes(blockchain)) { throw('You need to set only supported blockchains!') }  
  })
}

let Sale = async ({
  amount,
  token,
  blockchains,
  event,
  sent,
  confirmed,
  ensured,
  failed,
  error,
  critical,
  style,
  providers,
  currency,
  document
}) => {

  try {
    await preflight({ amount, token, blockchains })
    mount({ style, document: ensureDocument(document) }, (unmount)=> {
      return (container)=>
        <ErrorProvider error={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider configuration={{ amount, token, blockchains, currency, event, sent, confirmed, ensured, failed, providers }}>
            <ClosableProvider unmount={ unmount }>
              <UpdateProvider>
                <WalletProvider>
                  <SaleRoutingProvider>
                    <SaleStack
                      document={ document }
                      container={ container }
                    />
                  </SaleRoutingProvider>
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

export default Sale
