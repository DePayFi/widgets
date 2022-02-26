import ConfigurationContext from '../contexts/ConfigurationContext'
import Dialog from '../components/Dialog'
import ErrorGraphic from '../graphics/error'
import PaymentContext from '../contexts/PaymentContext'
import React, { useContext } from 'react'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default ()=> {

  const { navigate } = useContext(NavigateStackContext)
  const { transaction } = useContext(PaymentContext)
  const { recover } = useContext(ConfigurationContext)

  return(
    <Dialog
      stacked={ recover ? false : true }
      header={
        <div className="PaddingTopS PaddingLeftM PaddingRightM">
        </div>
      }
      body={
        <div className="TextCenter">
          <div className="GraphicWrapper">
            <img className="Graphic" src={ ErrorGraphic }/>
          </div>
          <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Payment Failed</h1>
          <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
            { recover == undefined &&
              <strong className="FontSizeM">
                Unfortunately executing your payment failed. You can go back and try again.
              </strong>
            }
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
        <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
          { recover == undefined &&
            <button className='ButtonPrimary' onClick={()=>navigate('back')}>
              Try again
            </button>
          }
        </div>
      }
    />
  )
}
