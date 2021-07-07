import React from 'react'
import ReactDOM from 'react-dom'

export default ({
  amount,
  token,
  receiver,
  document
})=> {

  let _document = document || window.document

  ReactDOM.render(
    <h1>I am a dialog!</h1>,
    _document.body
  )

}
