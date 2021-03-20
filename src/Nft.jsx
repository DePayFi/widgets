import React from 'react'
import ReactDOM from 'react-dom'
import ShadowContainer from './utils/ShadowContainer'
import NftSelectorDialogue from './dialogs/NftSelectorDialogue'

export function Selector(options, callback) {
  const [shadowContainer, closeContainer] = ShadowContainer()
  ReactDOM.render(
    <NftSelectorDialogue
      closeContainer={closeContainer}
      sender={options.sender}
      callback={callback}
    />,
    shadowContainer,
  )
}

export default {
  Selector,
}
