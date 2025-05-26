import link from '../helpers/link'
import React, { useContext, useEffect } from 'react'
import WalletContext from '../contexts/WalletContext'

export default ()=>{
  const walletContext = useContext(WalletContext)
  const wallet = walletContext ? walletContext.wallet : undefined

  return(
    <div className="PoweredByWrapper">
      <a href={ link({ url: 'https://depay.com', target: '_blank', wallet }) } rel="noopener noreferrer" target="_blank" className="PoweredByLink" title="powered by DePay">DePay</a>
    </div>
  )
}
