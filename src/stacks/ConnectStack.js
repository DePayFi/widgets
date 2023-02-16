import ClosableContext from '../contexts/ClosableContext'
import ConnectWalletDialog from '../dialogs/ConnectWalletDialog'
import React, { useState, useContext, useEffect } from 'react'
import SelectBlockchainDialog from '../dialogs/SelectBlockchainDialog'
import SelectWalletDialog from '../dialogs/SelectWalletDialog'
import WhatIsAWalletDialog from '../dialogs/WhatIsAWalletDialog'
import { getWallets } from '@depay/web3-wallets'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const [ wallet, setWallet ] = useState()
  const [ selection, setSelection ] = useState({ blockchain: undefined })
  const resolve = (account)=> {
    if(props.autoClose) close()
    if(props.resolve) props.resolve({ wallet, account })
  }

  return(
    <ReactDialogStack
      open={ open }
      close={ close }
      start='SelectWallet'
      container={ props.container }
      document={ props.document }
      dialogs={{
        SelectWallet: <SelectWalletDialog setWallet={ setWallet } />,
        WhatIsAWallet: <WhatIsAWalletDialog />,
        ConnectWallet: <ConnectWalletDialog selection={ selection } wallet={ wallet } resolve={ resolve } />,
        SelectBlockchain: <SelectBlockchainDialog selection={ selection } stacked={ true } resolve={ (blockchain)=>{ console.log('SELECTED BLOCKCHAIN', blockchain) } } />,
      }}
    />
  )
}
