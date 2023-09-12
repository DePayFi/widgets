import ClosableContext from '../contexts/ClosableContext'
import NavigateContext from '../contexts/NavigateContext'
import React, { useContext } from 'react'
import LoadingDialog from '../dialogs/LoadingDialog'
import { ReactDialogStack } from '@depay/react-dialog-stack'

export default (props)=>{

  const { open, close } = useContext(ClosableContext)
  const { setNavigator } = useContext(NavigateContext)

  return(
    <ReactDialogStack
      setNavigator={ setNavigator }
      open={ open }
      close={ close }
      start='Loading'
      container={ props.container }
      document={ props.document }
      dialogs={{
        Loading: <LoadingDialog text={ props.text }/>,
      }}
    />
  )
}

