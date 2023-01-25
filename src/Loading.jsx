import ClosableProvider from './providers/ClosableProvider'
import ConfigurationProvider from './providers/ConfigurationProvider'
import ensureDocument from './helpers/ensureDocument'
import ErrorProvider from './providers/ErrorProvider'
import LoadingStack from './stacks/LoadingStack'
import mount from './helpers/mount'
import NavigateProvider from './providers/NavigateProvider'
import PoweredBy from './components/PoweredBy'
import React from 'react'
import requireReactVersion from './helpers/requireReactVersion'
import routePayments from './helpers/routePayments'
import UpdatableProvider from './providers/UpdatableProvider'

let Loading = async ({
  text,
  style,
  error,
  critical,
  container,
  before,
  document
}) => {
  requireReactVersion()
  try {
    let unmount = mount({ style, container, document: ensureDocument(document), closed }, (unmount)=> {
      return (container)=>
        <ErrorProvider errorCallback={ error } container={ container } unmount={ unmount }>
          <ConfigurationProvider configuration={ { text } }>
            <UpdatableProvider>
              <ClosableProvider unmount={ unmount } closable={ false }>
                  <NavigateProvider>
                    <LoadingStack
                      document={ document }
                      container={ container }
                    />
                    <PoweredBy/>
                  </NavigateProvider>
              </ClosableProvider>
            </UpdatableProvider>
          </ConfigurationProvider>
        </ErrorProvider>
    })
    window._depayUnmountLoading = unmount
    return { unmount }
  } catch (error) {
    console.log('critical error', error)
    if(critical != undefined) {
      critical(error)
    }
  }
}

export default Loading
