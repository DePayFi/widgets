import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import Connect from './Connect'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import LoginStack from './stacks/LoginStack'
import mount from './helpers/mount'
import PoweredBy from './components/PoweredBy'
import React from 'react'
import requireReactVersion from './helpers/requireReactVersion'
import UpdatableProvider from './providers/UpdatableProvider'

let Login = (options) => {
  requireReactVersion()
  let style, error, document, message, endpoint, recover
  if(typeof options == 'object') ({ style, error, document, message, endpoint, recover } = options)

  return new Promise(async (resolve, reject)=>{

    Connect().then(()=>{
      let unmount = mount({ style, document: ensureDocument(document) }, (unmount)=> {
        const userClosedDialog = ()=>{
          reject('USER_CLOSED_DIALOG')
          unmount()
        }
        return (container)=>
          <ErrorProvider errorCallback={ error } container={ container } unmount={ unmount }>
            <ConfigurationProvider configuration={{ message, endpoint: (endpoint || '/login'), recover }}>
              <UpdatableProvider>
                <ClosableProvider unmount={ userClosedDialog }>
                  <LoginStack
                    document={ document }
                    container={ container }
                    resolve={ (account)=>{
                      unmount()
                      resolve(account)
                    }}
                  />
                  <PoweredBy/>
                </ClosableProvider>
              </UpdatableProvider>
            </ConfigurationProvider>
          </ErrorProvider>
      })
    }).catch(reject)
  })
}

export default Login
