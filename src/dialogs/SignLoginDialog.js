import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import ErrorContext from '../contexts/ErrorContext'
import isMobile from '../helpers/isMobile'
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
    recoverSignature = ({ message, signature })=> {
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

  useEffect(()=>{
    if(!isMobile()){
      login()
    }
  }, [])

  return(
    <Dialog
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          {
            loggingIn &&
            <div className="PaddingBottomS PaddingTopXS">
              <div className="PaddingTopXS PaddingBottomL">
                <div className="ActionIndicator MarginBottomXS">
                  <img src={wallet.logo} />
                  <div className="ActionIndicatorSpinner"></div>
                </div>
                <div className="TextCenter PaddingTopXS">
                  <span className="FontSizeL">
                    Confirm in your wallet
                  </span>
                </div>
              </div>
            </div>
          }
          { !loggingIn &&
            <div className="PaddingTopXS">
              <div className="PaddingTopXS PaddingBottomM">
                <div className="ActionIndicator MarginBottomXS">
                  <img src={wallet.logo} />
                  <div className="ActionIndicatorCircle"></div>
                </div>
                <div className="TextCenter PaddingTopXS">
                  <span className="FontSizeL">
                    Click "Log in" and confirm
                  </span>
                </div>
              </div>
              <button className='ButtonPrimary' onClick={ login }>
                Log in
              </button>
            </div>
          }
        </div>
      }
    />
  )
}
