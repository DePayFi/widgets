import ChevronRight from '../components/ChevronRight'
import React, { useState } from 'react'
import { ReactDialog } from 'depay-react-dialog'

export default (props)=>{

  const [open, setOpen] = useState(true)

  let close = ()=>{
    setOpen(false)
    setTimeout(props.unmount, 300)
  }

  return(
    <ReactDialog container={ props.container } close={ close } open={ open }>
      <div className="Dialog ReactDialogAnimation">
        
        <div className="DialogHeader">
          <div className="PaddingTopS PaddingLeftM PaddingRightM">
            <h1 className="FontSizeL TextLeft">Select a wallet</h1>
          </div>
        </div>

        <div className="DialogBody">
          <div className="Text PaddingTopS PaddingBottomXS PaddingLeftS PaddingRightS">
            <div 
              className={'Card small'}
              title={''}
              onClick={ ()=>{} }
            >
              <div className="CardBody">
                <div className="CardBodyWrapper PaddingLeftS">
                  <h2 className="CardText">
                    NAME
                  </h2>
                </div>
              </div>
              <div className="CardImage PaddingRightM">
                IMG
              </div>
            </div>
          </div>
        </div>

        <div className="DialogFooter">
          <div className="FontSizeS FontWeightBold TextGrey PaddingBottomS">
            <strong>What is a wallet?</strong>
          </div>
        </div>
      </div>
    </ReactDialog>
  )
}
