import React from 'react'
import CloseIcon from './CloseIcon'

export default (props)=>{

  let onClickClose = ()=>{
    console.log('CLICK CLOSE')
  }

  return(
    <div className="ReactDialogAnimation Dialog">
      
      <div className="DialogHeader">
        <div className="DialogHeaderInner">
          { props.header }
          <button onClick={ onClickClose } className="DialogCloseButton ButtonCircular">
            <CloseIcon/>
          </button>
        </div>
      </div>

      <div className="DialogBody">
        { props.body }
      </div>

      <div className="DialogFooter">
        <div>{ props.footer }</div>
        <a href={'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=Widget'} rel="noopener noreferrer" target="_blank" className="FooterLink">by DePay</a>
      </div>

    </div>
  )
}
