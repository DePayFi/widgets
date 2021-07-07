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

  await preflight({ amount, token, receiver })

  let _document = document || window.document

  ReactDOM.render(
    <h1>I am a dialog!</h1>,
    _document.body
  )

}
