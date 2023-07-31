import ClosableContext from '../contexts/ClosableContext'
import NavigateContext from '../contexts/NavigateContext'
import React, { useContext } from 'react'
import SolanaPayDialog from '../dialogs/SolanaPayDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const { setNavigator } = useContext(NavigateContext)

  return(
    <ReactDialogStack
      setNavigator={ setNavigator }
      open={ open }
      close={ close }
      start='SolanaPay'
      container={ props.container }
      document={ props.document }
      stacked={true}
      dialogs={{
        SolanaPay: <SolanaPayDialog unmount={ props.unmount } />
      }}
    />
  )
}

