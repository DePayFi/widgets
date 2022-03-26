import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import mount from './helpers/mount'
import PoweredBy from './components/PoweredBy'
import React from 'react'
import requireReactVersion from './helpers/requireReactVersion'
import SelectionProvider from './providers/SelectionProvider'
import SelectStack from './stacks/SelectStack'
import UpdatableProvider from './providers/UpdatableProvider'

let Select = (options) => {
  requireReactVersion()
  let style, error, document, what
  if(typeof options == 'object') ({ style, error, document, what } = options)
  
  let startupError
  if(what == undefined) {
    startupError = '"what" needs to be configured!'
  } else if (['token'].indexOf(what) < 0) {
    startupError = `Unknown "what" configured: ${what}!`
  }

  return new Promise(async (resolve, reject)=>{

    let unmount = mount({ style, document: ensureDocument(document) }, (unmount)=> {
      const userClosedDialog = ()=>{
        reject('USER_CLOSED_DIALOG')
        unmount()
      }
      return (container)=>
        <ErrorProvider error={ startupError } errorCallback={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider configuration={{ what }}>
            <UpdatableProvider>
              <ClosableProvider unmount={ userClosedDialog }>
                <SelectionProvider>
                  <SelectStack
                    document={ document }
                    container={ container }
                    unmount={ unmount }
                    resolve={ resolve }
                  />
                </SelectionProvider>
                <PoweredBy/>
              </ClosableProvider>
            </UpdatableProvider>
          </ConfigurationProvider>
        </ErrorProvider>
    })
  })
}

export default Select
