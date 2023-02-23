import allWallets from '../helpers/allWallets'
import ClosableContext from '../contexts/ClosableContext'
import ConnectWalletDialog from '../dialogs/ConnectWalletDialog'
import PoweredBy from '../components/PoweredBy'
import React, { useState, useContext, useEffect } from 'react'
import SelectBlockchainDialog from '../dialogs/SelectBlockchainDialog'
import SelectWalletDialog from '../dialogs/SelectWalletDialog'
import WhatIsAWalletDialog from '../dialogs/WhatIsAWalletDialog'
import { getWallets } from '@depay/web3-wallets'
import { ReactDialogStack } from '@depay/react-dialog-stack'
import { set as setPreviouslyConnectedWallet } from '../helpers/previouslyConnectedWallet'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const [ wallet, setWallet ] = useState()
  const [ selection, setSelection ] = useState({ blockchain: undefined })
  const resolve = (account, wallet)=> {
    if(account && wallet) {
      let walletMeta = allWallets.find((walletMeta)=>walletMeta.extension == wallet.name) || allWallets.find((walletMeta)=>walletMeta.name == wallet.name)
      setPreviouslyConnectedWallet(walletMeta.name)
      if(props.autoClose) close()
      if(props.resolve) props.resolve({ account, wallet })
    }
  }

  return(
    <div>
      <ReactDialogStack
        open={ open }
        close={ close }
        start='SelectWallet'
        container={ props.container }
        document={ props.document }
        dialogs={{
          SelectWallet: <SelectWalletDialog setWallet={ setWallet } resolve={ resolve } />,
          WhatIsAWallet: <WhatIsAWalletDialog />,
          ConnectWallet: <ConnectWalletDialog selection={ selection } wallet={ wallet } resolve={ resolve } />
        }}
      />
      <PoweredBy/>
    </div>
  )
}
