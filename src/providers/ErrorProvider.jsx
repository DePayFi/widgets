import ErrorContext from '../contexts/ErrorContext'
import ErrorGraphic from '../graphics/wallets/error'
import React, { useState } from 'react'
import { ReactDialog } from '@depay/react-dialog'

class ErrorBoundary extends React.Component {
  
  constructor(props) {
    super(props);
  }

  componentDidCatch(error, errorInfo) {
    if(error.error){ error = error.error }
    this.props.setError(error);
  }

  render() {
    return this.props.children;
  }
}

export default (props)=>{

  const [error, setError] = useState(props.error)
  const [open, setOpen] = useState(true)

  let setErrorFromChildren = (error)=>{
    console.log(error)
    if(error.error){ error = error.error }
    setError(error)
    if(props.errorCallback) { props.errorCallback(error.message || error.toString()) }
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

          <div className="DialogBody TextCenter">
            <div className="GraphicWrapper PaddingTopS">
              <ErrorGraphic/>
            </div>
            <h1 className="LineHeightL Text FontSizeL PaddingTopS FontWeightBold">Oops, Something Went Wrong</h1>
            <div className="Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS">
              <div className="PaddingLeftS PaddingRightS">
                <pre className="ErrorSnippetText">
                  { error.message || error.toString() }
                </pre>
              </div>
              <div className="PaddingTopS PaddingBottomS">
                <strong className="FontSizeM PaddingTopS">
                  If this keeps happening, please report it.
                </strong>
              </div>
            </div>
          </div>

          <div className="DialogFooter">
            <div className="PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM">
              <button 
                className={"ButtonPrimary"}
                onClick={ close }
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </ReactDialog>
    )
  } else {
    return(
      <ErrorContext.Provider value={{
        setError: setErrorFromChildren,
        errorCallback: props.errorCallback
      }}>
        <ErrorBoundary setError={ setErrorFromChildren }>
          { props.children }
        </ErrorBoundary>
      </ErrorContext.Provider>
    )
  }
}
