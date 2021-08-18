import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import PaymentProvider from './providers/PaymentProvider'
import PaymentStack from './stacks/PaymentStack'
import React from 'react'
import RoutingProvider from './providers/RoutingProvider'
import style from './style'
import ToTokenProvider from './providers/ToTokenProvider'
import UpdateProvider from './providers/UpdateProvider'
import WalletProvider from './providers/WalletProvider'
import { ReactShadowDOM } from 'depay-react-shadow-dom'

let preflight = async({ blockchain, amount, token, receiver }) => {
  if(typeof blockchain === 'undefined') { throw('DePayWidgets.Payment: You need to set the blockchain your want to receive the payment on!') }
  if(!['ethereum', 'bsc'].includes(blockchain)) { throw('DePayWidgets.Payment: You need to set a supported blockchain!') }
  if(typeof amount === 'undefined') { throw('DePayWidgets.Payment: You need to set the amount you want to receive as payment!') }
  if(typeof token === 'undefined') { throw('DePayWidgets.Payment: You need to set the token you want to receive as payment!') }
  if(typeof receiver === 'undefined') { throw('DePayWidgets.Payment: You need to set the receiver address that you want to receive the payment!') }
}

let Payment = async ({ blockchain, amount, token, receiver, sent, confirmed, safe, document }) => {

  if(typeof document === 'undefined') { document = window.document }

  await preflight({ blockchain, amount, token, receiver })

  let unmountShadowDOM = ()=> {
    // setTimeout to allow dialog to animate out first
    setTimeout(unmount, 300)
  }

  let content = (container)=> {
    return(
      <ConfigurationProvider configuration={ { blockchain, amount, token, receiver, sent, confirmed, safe } }>
        <ClosableProvider unmount={ unmountShadowDOM }>
          <UpdateProvider>
            <WalletProvider>
              <ToTokenProvider>
                <RoutingProvider>
                  <PaymentProvider>
                    <PaymentStack
                      document={ document }
                      container={ container }
                    />
                  </PaymentProvider>
                </RoutingProvider>
              </ToTokenProvider>
            </WalletProvider>
          </UpdateProvider>
        </ClosableProvider>
      </ConfigurationProvider>
    )
  }

  let { unmount } = ReactShadowDOM({
    document,
    element: document.body,
    content: content,
    insideStyle: style(),
    outsideStyle: `
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    `,
  })
  
}

export default Payment