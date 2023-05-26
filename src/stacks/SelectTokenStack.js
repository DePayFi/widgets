import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ConfirmTokenSelectionDialog from '../dialogs/ConfirmTokenSelectionDialog'
import React, { useState, useContext, useEffect } from 'react'
import SelectBlockchainDialog from '../dialogs/SelectBlockchainDialog'
import SelectionContext from '../contexts/SelectionContext'
import SelectTokenDialog from '../dialogs/SelectTokenDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { what } = useContext(ConfigurationContext)
  const { open, close } = useContext(ClosableContext)
  const { selection } = useContext(SelectionContext)

  let start
  switch(what) {
    default:
      start = 'SelectToken'
  }

  return(
    <ReactDialogStack
      open={ open }
      close={ close }
      start={ start }
      container={ props.container }
      document={ props.document }
      dialogs={{
        SelectToken: <SelectTokenDialog selection={selection} resolve={props.resolve} unmount={props.unmount}/>,
        SelectBlockchain: <SelectBlockchainDialog selection={selection} resolve={props.resolve} unmount={props.unmount}/>,
        ConfirmTokenSelection: <ConfirmTokenSelectionDialog selection={selection} resolve={props.resolve} unmount={props.unmount}/>,
      }}
    />
  )
}
