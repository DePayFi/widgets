import PaymentStack from './stacks/PaymentStack'
import React from 'react'
import { ReactShadowDOM } from 'depay-react-shadow-dom'
import style from './style'

let preflight = async({ amount, token, receiver }) => {
  if(typeof amount === 'undefined') { throw('DePayWidgets.Payment: You need to set the amount you want to receive as payment!') }
  if(typeof token === 'undefined') { throw('DePayWidgets.Payment: You need to set the token you want to receive as payment!') }
  if(typeof receiver === 'undefined') { throw('DePayWidgets.Payment: You need to set the receiver address that you want to receive the payment!') }
}

let Payment = async ({ amount, token, receiver, document }) => {

  if(typeof document === 'undefined') { document = window.document }

  await preflight({ amount, token, receiver })

  let content = (container)=> {
    return(
      <PaymentStack
        configuration={{ amount, token, receiver }}
        unmount={ ()=>unmount() }
        document={ document }
        container={ container }
      />
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
