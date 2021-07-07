import PaymentStack from './stacks/PaymentStack'
import React from 'react'
import ReactDOM from 'react-dom'

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

  ReactDOM.render(
    <PaymentStack
      document={ document }
    />, 
    document.body
  )
}
