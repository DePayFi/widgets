import ClosableContext from '../contexts/ClosableContext'
import ConfigurationContext from '../contexts/ConfigurationContext'
import ConfirmNFTSelectionDialog from '../dialogs/ConfirmNFTSelectionDialog'
import EnterNFTDataManuallyDialog from '../dialogs/EnterNFTDataManuallyDialog'
import React, { useState, useContext, useEffect } from 'react'
import SearchNFTDialog from '../dialogs/SearchNFTDialog'
import SelectBlockchainDialog from '../dialogs/SelectBlockchainDialog'
import SelectionContext from '../contexts/SelectionContext'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { what } = useContext(ConfigurationContext)
  const { open, close } = useContext(ClosableContext)
  const { selection, setSelection } = useContext(SelectionContext)
  const [ navigator, setNavigator ] = useState()

  return(
    <ReactDialogStack
      open={ open }
      close={ close }
      start={ 'EnterDataManually' }
      container={ props.container }
      document={ props.document }
      setNavigator={ (navigator)=>{ setNavigator(navigator) }}
      dialogs={{
        // SearchNFT: <SearchNFTDialog navigator={navigator} selection={selection} resolve={props.resolve} unmount={props.unmount} />,
        EnterDataManually: <EnterNFTDataManuallyDialog selection={selection} resolve={props.resolve} unmount={props.unmount} />,
        SelectBlockchain: <SelectBlockchainDialog stacked={true} selection={selection} resolve={props.resolve} unmount={props.unmount}/>,
        ConfirmNFTSelection: <ConfirmNFTSelectionDialog selection={selection} resolve={props.resolve} unmount={props.unmount} />,
      }}
    />
  )
}
