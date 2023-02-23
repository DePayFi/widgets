import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ConfirmNFTSelectionDialog from '../dialogs/ConfirmNFTSelectionDialog'
import EnterNFTDataForOpenSeaDialog from '../dialogs/EnterNFTDataForOpenSeaDialog'
import React, { useState, useContext, useEffect } from 'react'
import SelectBlockchainDialog from '../dialogs/SelectBlockchainDialog'
import SelectionContext from '../contexts/SelectionContext'
import SelectNFTContractOnOpenSeaDialog from '../dialogs/SelectNFTContractOnOpenSeaDialog'
import SelectNFTIdOnOpenSeaDialog from '../dialogs/SelectNFTIdOnOpenSeaDialog'
import SelectNFTPlatformDialog from '../dialogs/SelectNFTPlatformDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { what } = useContext(ConfigurationContext)
  const { open, close } = useContext(ClosableContext)
  const { selection, setSelection } = useContext(SelectionContext)
  const [ navigator, setNavigator ] = useState()

  let start
  switch(what) {
    default:
      start = 'SelectMarketplace'
  }

  return(
    <ReactDialogStack
      open={ open }
      close={ close }
      start={ start }
      container={ props.container }
      document={ props.document }
      setNavigator={ (navigator)=>{ setNavigator(navigator) }}
      dialogs={{
        SelectMarketplace: <SelectNFTPlatformDialog selection={ selection } resolve={ props.resolve } unmount={ props.unmount } />,
        SelectNFTContractOnOpenSea: <SelectNFTContractOnOpenSeaDialog selection={ selection } resolve={ props.resolve } unmount={ props.unmount } />,
        SelectNFTIdOnOpenSea: <SelectNFTIdOnOpenSeaDialog selection={ selection } resolve={ props.resolve } unmount={ props.unmount } />,
        EnterNFTDataForOpenSea: <EnterNFTDataForOpenSeaDialog selection={ selection } resolve={ props.resolve } unmount={ props.unmount } />,
        SelectBlockchain: <SelectBlockchainDialog selection={ selection } stacked={ true } resolve={ props.resolve } unmount={ props.unmount } />,
        ConfirmNFTSelection: <ConfirmNFTSelectionDialog selection={ selection } resolve={ props.resolve } unmount={ props.unmount } />,
      }}
    />
  )
}
