import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import ErrorContext from '../contexts/ErrorContext'
import React, { useState, useEffect, useContext } from 'react'
import { getWallet } from '@depay/web3-wallets'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=> {

  const { setError } = useContext(ErrorContext)
  const [ showSignButton, setShowSignButton ] = useState(false)
  const { message, endpoint } = useContext(ConfigurationContext)
  const wallet = getWallet()
  const walletName = wallet?.name ? wallet.name : 'wallet'
  const walletLogo = wallet?.logo ? wallet.logo : undefined
  const login = ()=> {
    wallet.sign(message).then((signature)=>{
      fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ message, signature })
      })
        .then((response)=>{
          if(response.status == 200) {
            response.text().then((account)=>{
              props.resolve(account)
            }).catch(setError)
          } else {
            response.text().then((text)=>{
              setError(text || 'Recovering login signature failed!')
            })
          }
        })
        .catch(setError)
    }).catch(setError)
  }

  useEffect(login, [])
  useEffect(()=> {
    let timeout = setTimeout(()=>setShowSignButton(true), 10000)
    return ()=>clearTimeout(timeout)
  }, [])
  
  return(
    <Dialog
      stacked={ true }
      body={
        <div>
          { walletLogo &&
            <div className="GraphicWrapper PaddingTopS PaddingBottomS">
              <img className="Graphic" src={walletLogo}/>
            </div>
          }
          <h1 className="LineHeightL Text FontSizeL FontWeightBold PaddingTopS">
            Wallet Login
          </h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
            <p className="FontSizeM PaddingLeftM PaddingRightM">
              Please sign the login message with your connected wallet.
            </p>
          </div>
        </div>
      }
      footer={
        showSignButton &&
          <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
            <button className='ButtonPrimary' onClick={ login }>
              Log in
            </button>
          </div>
      }
    />
  )
}
