import ErrorContext from '../contexts/ErrorContext'
import ErrorGraphic from '../graphics/error'
import React, { useState } from 'react'
import { ReactDialog } from 'depay-react-dialog'

class ErrorBoundary extends React.Component {
  
  constructor(props) {
    super(props);
  }

  componentDidCatch(error, errorInfo) {
    this.props.setError(error);
  }

  render() {
    return this.props.children;
  }
}

export default (props)=>{

  const [error, setError] = useState()
  const [open, setOpen] = useState(true)

  let setErrorFromChildren = (error)=>{
    setError(error)
    if(props.error) { props.error(error) }
  }

  let close = ()=>{
    setOpen(false)
    setTimeout(props.unmount, 300)
  }

  if(error) {
    return(
      <ReactDialog container={ props.container } close={ close } open={ open }>
        <div className="Dialog ReactDialogAnimation">
          
          <div className="DialogHeader">
            <div className="PaddingTopS PaddingLeftS PaddingRightS">
            </div>
          </div>

          <div className="DialogBody">
            <div className="GraphicWrapper">
              <img className="Graphic" src={ ErrorGraphic }/>
            </div>
            <h1 className="Text FontSizeL PaddingTopS FontWeightBold">Oops, Something Went Wrong</h1>
            <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
              <div>
                <strong className="FontSizeM FontItalic">
                  { error.toString() }
                </strong>
              </div>
              <div className="PaddingTopS PaddingBottomS">
                <strong className="FontSizeM PaddingTopS">
                  If this keeps happening, please report it.
                </strong>
              </div>
            </div>
          </div>

          <div className="DialogFooter">
            <div>
              <button 
                className={"ButtonPrimary"}
                onClick={ close }
              >
                Try again
              </button>
            </div>
            <a href={'https://depay.fi?utm_source='+window.location.hostname+'&utm_medium=widget&utm_campaign=WidgetV2'} rel="noopener noreferrer" target="_blank" className="FooterLink">by DePay</a>
          </div>
        </div>
      </ReactDialog>
    )
  } else {
    return(
      <ErrorContext.Provider value={{
        setError: setErrorFromChildren
      }}>
        <ErrorBoundary setError={ setErrorFromChildren }>
          { props.children }
        </ErrorBoundary>
      </ErrorContext.Provider>
    )
  }
}
