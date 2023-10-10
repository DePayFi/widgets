import ClosableProvider from './providers/ClosableProvider'
import ConnectStack from './stacks/ConnectStack'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import mount from './helpers/mount'
import PoweredBy from './components/PoweredBy'
import React from 'react'
import requireReactVersion from './helpers/requireReactVersion'
import SelectionProvider from './providers/SelectionProvider'
import UpdatableProvider from './providers/UpdatableProvider'

let Connect = (options) => {
  requireReactVersion()
  let style, error, document
  if(typeof options == 'object') ({ style, error, document } = options)

  return new Promise(async (resolve, reject)=>{

    let unmount = mount({ style, document: ensureDocument(document) }, (unmount)=> {
      const rejectBeforeUnmount = ()=>{
        reject('USER_CLOSED_DIALOG')
        unmount()
      }
      return (container)=>
        <ErrorProvider errorCallback={ error } container={ container } unmount={ unmount }>
          <UpdatableProvider>
            <ClosableProvider unmount={ rejectBeforeUnmount }>
              <SelectionProvider>
                <ConnectStack
                  document={ document }
                  container={ container }
                  resolve={ resolve }
                  reject={ reject }
                  autoClose={ true }
                />
                <PoweredBy/>
              </SelectionProvider>
            </ClosableProvider>
          </UpdatableProvider>
        </ErrorProvider>
    })
  })
}

export default Connect
