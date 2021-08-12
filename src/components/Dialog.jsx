import ChevronLeft from './ChevronLeft'
import ClosableContext from '../contexts/ClosableContext'
import CloseIcon from './CloseIcon'
import React, { useContext } from 'react'
import { NavigateStackContext } from 'depay-react-dialog-stack'

export default (props)=>{

  const navigate = useContext(NavigateStackContext)
  const { close } = useContext(ClosableContext)

  return(
    <div className="ReactDialogAnimation Dialog">
      
      <div className="DialogHeader">
        <div className={["DialogHeaderInner", props.stacked ? 'TextCenter' : ''].join(' ')}>
          { props.stacked &&
            <button onClick={ ()=>navigate('back') } className="DialogBackButton ButtonCircular">
              <ChevronLeft/>
            </button>
          }
          { props.header }
          <button onClick={ close } className="DialogCloseButton ButtonCircular">
            <CloseIcon/>
          </button>
        </div>
      </div>

      <div className="DialogBody">
        { props.body }
      </div>

      <div className="DialogFooter">
        { props.footer }
        <a href={'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=WidgetV2'} rel="noopener noreferrer" target="_blank" className="FooterLink">by DePay</a>
      </div>
    </div>
  )
}
