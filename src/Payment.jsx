import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import PaymentProvider from './providers/PaymentProvider'
import PaymentStack from './stacks/PaymentStack'
import React from 'react'
import RoutingProvider from './providers/RoutingProvider'
import styleRenderer from './style'
import ToTokenProvider from './providers/ToTokenProvider'
import UpdateProvider from './providers/UpdateProvider'
import WalletProvider from './providers/WalletProvider'
import { ReactShadowDOM } from 'depay-react-shadow-dom'

let preflight = async({ accept }) => {
  accept.forEach((configuration)=>{
    if(typeof configuration.blockchain === 'undefined') { throw('DePayWidgets.Payment: You need to set the blockchain your want to receive the payment on!') }
    if(!['ethereum', 'bsc'].includes(configuration.blockchain)) { throw('DePayWidgets.Payment: You need to set a supported blockchain!') }
    if(typeof configuration.amount === 'undefined') { throw('DePayWidgets.Payment: You need to set the amount you want to receive as payment!') }
    if(typeof configuration.token === 'undefined') { throw('DePayWidgets.Payment: You need to set the token you want to receive as payment!') }
    if(typeof configuration.receiver === 'undefined') { throw('DePayWidgets.Payment: You need to set the receiver address that you want to receive the payment!') }
  })
}

let Payment = async ({ accept, event, sent, confirmed, ensured, failed, style, document }) => {

  if(typeof document === 'undefined') { document = window.document }

  await preflight({ accept })

  let unmountShadowDOM = ()=> {
    // setTimeout to allow dialog to animate out first
    setTimeout(unmount, 300)
  }

  let content = (container)=> {
    return(
      <ConfigurationProvider configuration={ { accept, event, sent, confirmed, ensured, failed } }>
        <ClosableProvider unmount={ unmountShadowDOM }>
          <UpdateProvider>
            <WalletProvider>
              <RoutingProvider>
                <PaymentProvider>
                  <ToTokenProvider>
                    <PaymentStack
                      document={ document }
                      container={ container }
                    />
                  </ToTokenProvider>
                </PaymentProvider>
              </RoutingProvider>
            </WalletProvider>
          </UpdateProvider>
        </ClosableProvider>
      </ConfigurationProvider>
    )
  }
  let insideStyle = styleRenderer(style)
  if(style && style.css) { insideStyle = [insideStyle, style.css].join(' ') }
  let { unmount } = ReactShadowDOM({
    document,
    element: document.body,
    content: content,
    insideStyle,
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
