import ClosableProvider from './providers/ClosableProvider'
import ConnectStack from './stacks/ConnectStack'
import ensureDocument from './helpers/ensureDocument'
import mount from './helpers/mount'
import React from 'react'

let Connect = (options) => {

  let style, document
  if(typeof options == 'object') ({ style, document } = options)

  return new Promise((resolve, reject)=>{

    let connected = ({ accounts, wallet })=>{
      resolve({ account: accounts[0], accounts, wallet })
    }
    
    let unmount = mount({ style, document: ensureDocument(document) }, (unmount)=> {
      return (container)=>
        <ClosableProvider unmount={ unmount }>
          <ConnectStack
            document={ document }
            container={ container }
            connected={ connected }
            autoClose={ true }
          />
        </ClosableProvider>
    })
  })
}

export default Connect
