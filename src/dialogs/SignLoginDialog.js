import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import WalletContext from '../contexts/WalletContext'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=> {

  const { setError } = useContext(ErrorContext)
  const { message, endpoint } = useContext(ConfigurationContext)
  let { recoverSignature } = useContext(ConfigurationContext)
  const { wallet, account } = useContext(WalletContext)
  const [ loggingIn, setLoggingIn ] = useState(false)
  if(!wallet) { return null }
  const walletName = wallet?.name ? wallet.name : 'wallet'
  const walletLogo = wallet?.logo ? wallet.logo : undefined
  if(typeof recoverSignature != 'function') {
    recoverSignature = ({ message, signature, wallet })=> {
      return new Promise((resolve, reject)=>{
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, signature, wallet: { name: wallet.name } })
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
    setLoggingIn(true)
    let messageToSign
    if(typeof message == 'function'){
      messageToSign = message(account)
    } else {
      messageToSign = message
    }
    wallet.sign(messageToSign).then((signature)=>{
      recoverSignature({ message: messageToSign, signature, wallet }).then((account)=>{
        props.resolve({ account, wallet })
        setLoggingIn(false)
      }).catch((error)=>{
        setLoggingIn(false)
        setError(error)
      })
    }).catch((error)=>{
      setLoggingIn(false)
      if(error && error.code && (error.code == 4001 || error.code == 'ACTION_REJECTED')) {
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
          {
            loggingIn &&
            <div className="PaddingTopXS PaddingBottomXS" style={{ height: '58px' }}>
              <div className="PaddingTopS PaddingBottomS TextCenter">
                <div className="Loading Icon medium" style={{ position: 'relative' }}></div>
              </div>
            </div>
          }
          { !loggingIn &&
            <button className='ButtonPrimary' onClick={ login }>
              Log in
            </button>
          }
        </div>
      }
    />
  )
}
