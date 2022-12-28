import ClosableProvider from './providers/ClosableProvider'
import ConnectStack from './stacks/ConnectStack'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import mount from './helpers/mount'
import PoweredBy from './components/PoweredBy'
import React from 'react'
import requireReactVersion from './helpers/requireReactVersion'
import UpdatableProvider from './providers/UpdatableProvider'
import { getWallets, getConnectedWallets } from '@depay/web3-wallets'

let Connect = (options) => {
  requireReactVersion()
  let style, error, document
  if(typeof options == 'object') ({ style, error, document } = options)

  return new Promise(async (resolve, reject)=>{

    let connectedWallets = await getConnectedWallets()
    if(connectedWallets && connectedWallets.length == 1){
      let wallet = connectedWallets[0]
      let account = await wallet.account()
      return resolve({ wallet, account })
    }

    let unmount = mount({ style, document: ensureDocument(document) }, (unmount)=> {
      const rejectBeforeUnmount = ()=>{
        reject('USER_CLOSED_DIALOG')
        unmount()
      }
      return (container)=>
        <ErrorProvider errorCallback={ error } container={ container } unmount={ unmount }>
          <UpdatableProvider>
            <ClosableProvider unmount={ rejectBeforeUnmount }>
              <ConnectStack
                document={ document }
                container={ container }
                resolve={ resolve }
                reject={ reject }
                autoClose={ true }
              />
              <PoweredBy/>
            </ClosableProvider>
          </UpdatableProvider>
        </ErrorProvider>
    })
  })
}

export default Connect
