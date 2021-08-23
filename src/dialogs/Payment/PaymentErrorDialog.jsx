import Dialog from '../../components/Dialog'
import ErrorGraphic from '../../graphics/error'
import PaymentContext from '../../contexts/PaymentContext'
import React, { useContext } from 'react'
import { NavigateStackContext } from 'depay-react-dialog-stack'

export default ()=> {

  const { navigate } = useContext(NavigateStackContext)
  const { transaction } = useContext(PaymentContext)

  console.log(transaction)

  return(
    <Dialog
      stacked={ true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
          <h1 className="FontSizeL TextLeft">Payment Failed</h1>
        </div>
      }
      body={
        <div>
          <div className="GraphicWrapper">
            <img className="Graphic" src={ ErrorGraphic }/>
          </div>
          <div className="PaddingTopS PaddingBottomS">
            <strong className="FontSizeL">Unfortunately executing your payment failed. You can go back and try again.</strong>
            { transaction && 
              <div className="PaddingTopS">
                <a className="Link" title="Check your transaction on a block explorer" href={ transaction?.url } target="_blank" rel="noopener noreferrer">
                  View on explorer
                </a>
              </div>
            }
          </div>
        </div>
      }
      footer={
        <div className="PaddingTopXS PaddingRightM PaddingLeftM">
          <button className='ButtonPrimary wide' onClick={()=>navigate('back')}>
            Try again
          </button>
        </div>
      }
    />
  )
}
