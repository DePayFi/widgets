import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import WalletContext from '../contexts/WalletContext'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=> {

  const { setError } = useContext(ErrorContext)
  const { message, endpoint } = useContext(ConfigurationContext)
  let { recover } = useContext(ConfigurationContext)
  const { wallet } = useContext(WalletContext)
  if(!wallet) { return null }
  const walletName = wallet?.name ? wallet.name : 'wallet'
  const walletLogo = wallet?.logo ? wallet.logo : undefined
  if(typeof recover != 'function') {
    recover = ({ message, signature })=> {
      return new Promise((resolve, reject)=>{
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, signature })
        })
          .then((response)=>{
            if(response.status == 200) {
              response.text().then((account)=>{
                resolve(account)
              }).catch(setError)
            } else {
              response.text().then((text)=>{
                setError(text || 'Recovering login signature failed!')
              })
            }
          })
      })
    }
  }

  const login = ()=> {
    wallet.sign(message).then((signature)=>{
      recover({ message, signature }).then(props.resolve).catch(setError)
    }).catch((error)=>{
      if(error && error.code && error.code == 4001) {
        // nothing happens
      } else {
        setError(error)
      }
    })
  }

  return(
    <Dialog
      body={
        <div className="TextCenter">
          { walletLogo &&
            <div className="GraphicWrapper PaddingTopS PaddingBottomS">
              <img className="Graphic" src={walletLogo}/>
            </div>
          }
          <h1 className="LineHeightL Text FontSizeL FontWeightBold PaddingTopS">
            Wallet Login
          </h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
            <p className="FontSizeM PaddingLeftM PaddingRightM PaddingBottomS">
              Please click "Log in" and sign the message with your connected wallet.
            </p>
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          <button className='ButtonPrimary' onClick={ login }>
            Log in
          </button>
        </div>
      }
    />
  )
}
