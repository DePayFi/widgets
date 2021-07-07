import PaymentStack from './stacks/PaymentStack'
import React from 'react'
import ReactShadowDOM from 'depay-react-shadow-dom'
import style from './style'

let preflight = async ({
  amount,
  token,
  receiver
})=> {
  if(typeof amount === 'undefined') { throw('DePayWidgets.Payment: You need to set the amount you want to receive as payment!') }
  if(typeof token === 'undefined') { throw('DePayWidgets.Payment: You need to set the token you want to receive as payment!') }
  if(typeof receiver === 'undefined') { throw('DePayWidgets.Payment: You need to set the receiver address that you want to receive the payment!') }
}

export default async ({
  amount,
  token,
  receiver,
  document
})=> {

  if(typeof document === 'undefined') { document = window.document }

  await preflight({ amount, token, receiver })
  
  ReactShadowDOM({
    document,
    element: document.body,
    content: (container)=> {
      return(
        <PaymentStack
          document={ document }
          container={ container }
        />
      )
    },
    insideStyle: style()
  })
}
