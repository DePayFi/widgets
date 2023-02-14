import ClosableContext from '../contexts/ClosableContext'
import ConnectWalletDialog from '../dialogs/ConnectWalletDialog'
import React, { useState, useContext, useEffect } from 'react'
import SelectWalletDialog from '../dialogs/SelectWalletDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'
import { getWallets } from '@depay/web3-wallets'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const [ wallet, setWallet ] = useState()

  // useEffect(()=>{
  //   (
  //     async ()=>{
  //       if(wallet) {
  //         let account = await wallet.account()
  //         if(account) {
  //           if(props.autoClose) close()
  //           if(props.resolve) props.resolve({ wallet, account })
  //         }
  //       }
  //     }
  //   )()
  // }, [wallet])

  return(
    <ReactDialogStack
      open={ open }
      close={ close }
      start='SelectWallet'
      container={ props.container }
      document={ props.document }
      dialogs={{
        SelectWallet: <SelectWalletDialog selected={ setWallet } />,
        ConnectWallet: <ConnectWalletDialog wallet={ wallet } />
      }}
    />
  )
}
