import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import LoginStack from './stacks/LoginStack'
import mount from './helpers/mount'
import PoweredBy from './components/PoweredBy'
import React from 'react'
import requireReactVersion from './helpers/requireReactVersion'
import UpdatableProvider from './providers/UpdatableProvider'
import WalletProvider from './providers/WalletProvider'

let Login = (options) => {
  requireReactVersion()
  let style, error, document, message, endpoint, recover
  if(typeof options == 'object') ({ style, error, document, message, endpoint, recover } = options)

  return new Promise(async (resolve, reject)=>{

    let unmount = mount({ style, document: ensureDocument(document) }, (unmount)=> {
      const userClosedDialog = ()=>{
        reject('USER_CLOSED_DIALOG')
        unmount()
      }
      return (container)=>
        <ErrorProvider errorCallback={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider configuration={{ message, endpoint: (endpoint || '/login'), recoverSignature: recover }}>
            <UpdatableProvider>
              <ClosableProvider unmount={ userClosedDialog }>
                <WalletProvider container={ container } unmount={ unmount }>
                  <LoginStack
                    document={ document }
                    container={ container }
                    resolve={ ({ account, wallet })=>{
                      unmount()
                      resolve({ account, wallet })
                    }}
                  />
                  <PoweredBy/>
                </WalletProvider>
              </ClosableProvider>
            </UpdatableProvider>
          </ConfigurationProvider>
        </ErrorProvider>
    })
  })
}

export default Login
