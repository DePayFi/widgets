/*#if _EVM

const SolanaPayDialog = (props)=>{ return null }

/*#elif _SOLANA

import SolanaPayDialog from '../dialogs/SolanaPayDialog.solana'

//#else */

import SolanaPayDialog from '../dialogs/SolanaPayDialog.solana'

//#endif

import ClosableContext from '../contexts/ClosableContext'
import NavigateContext from '../contexts/NavigateContext'
import React, { useContext, useState } from 'react'
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
        SolanaPay: <SolanaPayDialog unmount={ props.unmount } document={ props.document } />,
      }}
    />
  )
}

