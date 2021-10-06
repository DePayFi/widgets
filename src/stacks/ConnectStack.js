import ClosableContext from '../contexts/ClosableContext'
import React, { useState, useContext } from 'react'
import SelectWalletDialog from '../dialogs/SelectWalletDialog'
import { ReactDialogStack } from 'depay-react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const setWallet = async (wallet)=> {
    let accounts = await wallet.connect()
    if(accounts == undefined || accounts.length == 0) {
      // install wallet
    } else {
      props.connected({ accounts, wallet })
      if(props.autoClose) { close() }
    }
  }

  return(
    <ReactDialogStack
      open={ open }
      close={ close }
      start='SelectWallet'
      container={ props.container }
      document={ props.document }
      dialogs={{
        SelectWallet: <SelectWalletDialog setWallet={ setWallet }/>
      }}
    />
  )
}
