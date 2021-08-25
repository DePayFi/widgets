import ChevronLeft from './ChevronLeft'
import ClosableContext from '../contexts/ClosableContext'
import CloseIcon from './CloseIcon'
import React, { useContext } from 'react'
import { NavigateStackContext } from 'depay-react-dialog-stack'

export default (props)=>{

  const { navigate } = useContext(NavigateStackContext)
  const { close, closable } = useContext(ClosableContext)

  return(
    <div className="Dialog">
      
      <div className={["DialogHeader", props.stacked ? 'TextCenter' : ''].join(' ')}>
        { props.stacked &&
          <div className="DialogHeaderAction PaddingTopS PaddingLeftS PaddingRightS">
            <button onClick={ ()=>navigate('back') } className="ButtonCircular" title="Go back">
              <ChevronLeft/>
            </button>
          </div>
        }
        <div className="DialogHeaderTitle">{ props.header }</div>
        <div className="DialogHeaderAction PaddingTopS PaddingLeftS PaddingRightS">
          { closable &&
            <button onClick={ close } className="ButtonCircular" title="Close dialog">
              <CloseIcon/>
            </button>
          }
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
