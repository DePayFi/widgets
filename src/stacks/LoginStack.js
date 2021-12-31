import ClosableContext from '../contexts/ClosableContext'
import React, { useState, useContext, useEffect } from 'react'
import SignLoginDialog from '../dialogs/SignLoginDialog'
import { getWallet } from '@depay/web3-wallets'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const [ signing, setSigning ] = useState(true)

  return(
    <ReactDialogStack
      open={ open }
      close={ close }
      start='SignLogin'
      container={ props.container }
      document={ props.document }
      dialogs={{
        SignLogin: <SignLoginDialog resolve={ props.resolve } userClosedDialog={ props.userClosedDialog }/>,
      }}
    />
  )
}
