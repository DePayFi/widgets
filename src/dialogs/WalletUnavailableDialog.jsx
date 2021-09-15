import ChevronRight from '../components/ChevronRight'
import React, { useState } from 'react'
import { ReactDialog } from 'depay-react-dialog'
import { supported } from 'depay-web3-wallets'

export default (props)=>{

  const [open, setOpen] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)

  let close = ()=>{
    setOpen(false)
    setTimeout(props.unmount, 300)
  }

  let walletCards = supported.map((wallet, index)=>{
    return(
      <a
        key={index}
        className="Card small"
        title={`Install ${wallet.name}`}
        href={wallet.install}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="CardImage PaddingLeftM">
          <img src={wallet.logo}/>
        </div>
        <div className="CardBody">
          <div className="CardBodyWrapper PaddingLeftXS">
            <h2 className="CardText FontWeightBold">
              { wallet.name }
            </h2>
          </div>
        </div>
      </a>
    )
  })

  return(
    <ReactDialog container={ props.container } close={ close } open={ open }>
      <div className="Dialog ReactDialogAnimation">
        
        <div className="DialogHeader">
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
            <h1 className="FontSizeL TextLeft">Select a wallet</h1>
          </div>
        </div>

        <div className="DialogBody">
          <div className="PaddingTopS PaddingBottomXS PaddingLeftS PaddingRightS">
            
            { walletCards }
            
          </div>
        </div>

        <div className="DialogFooter">
          <div className="PaddingBottomS">
            <button className="FontSizeS FontWeightBold TextGrey TextButton" onClick={()=>setShowExplanation(!showExplanation)}>
              <strong>What is a wallet?</strong>
            </button>
            {showExplanation &&
              <p className="PaddingLeftM PaddingRightM">
                Wallets are used to send, receive, and store digital assets. Wallets come in many forms. They are either built into your browser, an extension added to your browser, a piece of hardware plugged into your computer or even an app on your phone.
              </p>
            }
          </div>
        </div>
      </div>
    </ReactDialog>
  )
}
