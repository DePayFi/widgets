import ChevronLeft from './ChevronLeft'
import ClosableContext from '../contexts/ClosableContext'
import CloseIcon from './CloseIcon'
import React, { useContext } from 'react'
import { NavigateStackContext } from '@depay/react-dialog-stack'

export default (props)=>{

  const { navigate } = useContext(NavigateStackContext)
  const { close, closable } = useContext(ClosableContext)

  return(
    <div className={["Dialog", props.className].join(' ')}>
      
      <div className={["DialogHeader", props.stacked ? 'TextCenter' : ''].join(' ')}>
        { props.stacked &&
          <div className="DialogHeaderActionLeft PaddingTopS PaddingLeftS PaddingRightS">
            <button onClick={ ()=>navigate('back') } className="ButtonCircular" title="Go back">
              <ChevronLeft/>
            </button>
          </div>
        }
        { props.header }
        <div className="DialogHeaderActionRight PaddingTopS PaddingLeftS PaddingRightS">
          { props.alternativeHeaderAction }
          { closable && props.closable !== false &&
            <button onClick={ close } className="ButtonCircular" title="Close dialog">
              <CloseIcon/>
            </button>
          }
        </div>
      </div>

      <div className={["DialogBody", props.bodyClassName].join(' ')}>
        { props.body }
      </div>

      { props.hideFooter !== true &&
        <div className="DialogFooter">
          { props.footer }
        </div>
      }
    </div>
  )
}
